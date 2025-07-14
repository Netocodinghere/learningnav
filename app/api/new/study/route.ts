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
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6eGVtcmdhdHpqY2x3Ymt0enl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMzU3NTcsImV4cCI6MjA2NzkxMTc1N30.kRtUyVtztGb7Gt3j0sH4SnsYxI6JzHqr6nbJ39Kjr8w", {
        global: {
          headers: {
            Authorization: `Bearer ${formData.get('access_token')}`
          }
        }
      });
      

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

        const fullText = splitDocs.map(d => d.pageContent).join('\n');

        const embeddingResponse = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: fullText,
        });

        const embedding = embeddingResponse.data[0].embedding;

        const { data: docInsert, error: docError } = await supabase
          .from('documents')
          .insert([{ content: fullText, embedding }])
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
      } finally {
        await unlink(tempPath).catch(() => {});
      }
    }

    const { data, error } = await supabase
      .from('studies')
      .insert([{ title, flashcards, user_id, reference }])
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
