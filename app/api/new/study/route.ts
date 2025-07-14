import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import OpenAI from 'openai';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { createClient } from '@supabase/supabase-js';
import  {supabase} from "../../../../lib/auth"
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    

    const title = formData.get('title') as string;
    const flashcardsRaw = formData.get('flashcards') as string;
    const user_id = formData.get('user_id') as string;
    const file = formData.get('file') as File;

    if (!title || !flashcardsRaw || !user_id) {
      return NextResponse.json(
        { error: 'Title, flashcards, and user_id are required' },
        { status: 400 }
      );
    }

    let flashcards;
    try {
      flashcards = JSON.parse(flashcardsRaw);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid flashcards JSON' }, { status: 400 });
    }

    let reference = null;

    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!['pdf', 'docx', 'txt', 'doc'].includes(fileExtension || '')) {
        return NextResponse.json({ error: 'Unsupported file format' }, { status: 400 });
      }
    
      const buffer = Buffer.from(await file.arrayBuffer());
      const tempPath = join(tmpdir(), `upload_${Date.now()}.${fileExtension}`);
    
      try {
        await writeFile(tempPath, buffer);
    
        let loader;
        if (fileExtension === 'pdf') loader = new PDFLoader(tempPath);
        else if (fileExtension === 'docx' || fileExtension === 'doc') loader = new DocxLoader(tempPath);
        else loader = new TextLoader(tempPath);
    
        const docs = await loader.load();
        const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 512, chunkOverlap: 32 });
        const splitDocs = await splitter.splitDocuments(docs);
    
        const resultPairs = await Promise.all(splitDocs.map(async d => {
          try {
            const res = await openai.embeddings.create({
              model: 'text-embedding-3-small',
              input: d.pageContent,
            });
            return { content: d.pageContent, embedding: res.data[0].embedding };
          } catch (err) {
            console.error('Embedding failed:', err);
            return null;
          }
        }));
    
        const validResults = resultPairs.filter(Boolean);
        if (validResults.length === 0) {
          return NextResponse.json(
            { error: 'All document chunks failed to embed.' },
            { status: 500 }
          );
        }
    
        const textChunks = validResults.map(r => r.content);
        const embeddings = validResults.map(r => r.embedding);
    
        const averageEmbeddings = (vectors: number[][]): number[] => {
          const length = vectors[0].length;
          const avg = new Array(length).fill(0);
          for (const vec of vectors) {
            for (let i = 0; i < length; i++) {
              avg[i] += vec[i];
            }
          }
          return avg.map(v => v / vectors.length);
        };
    
        const averagedEmbedding = averageEmbeddings(embeddings);
    
        const { data: docInsert, error: docError } = await supabase
          .from('documents')
          .insert([{ content: textChunks.join(''), embedding: averagedEmbedding }])
          .select('id')
          .single();
    
        if (docError) {
          console.error('Error inserting into documents:', docError);
          return NextResponse.json(
            { error: 'Failed to save document embedding' },
            { status: 500 }
          );
        }
    
        reference = docInsert.id;
      } catch (err) {
        console.error('File processing or embedding error:', err);
        return NextResponse.json(
          { error: 'Error while processing file and embedding' },
          { status: 500 }
        );
      } finally {
        await unlink(tempPath).catch(() => {});
      }
    }
        const { data, error } = await supabase
      .from('studies')
      .insert([{ title, flashcards, user_id, reference, source:"note" }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save study' }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Study created successfully', study: data },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
