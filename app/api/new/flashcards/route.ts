// app/api/generate-flashcards/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function extractJsonArray(raw: string): string {
  return raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
}

const generateFlashcardPrompt = (number: number) => `
Generate exactly ${number} flashcards from the following content.

Each flashcard should be a JSON object with the following format:
{
  "front": "Question or term on the front",
  "back": "Explanation, definition, or answer on the back"
}

Only return a valid JSON array of flashcards. No extra commentary.

---

### Output Example:
[
  {
    "front": "What is the capital of France?",
    "back": "Paris"
  },
  {
    "front": "Define Photosynthesis",
    "back": "Photosynthesis is the process by which green plants use sunlight to synthesize nutrients from carbon dioxide and water."
  }
]

---

### Content:
{text}
`;

async function loadAndChunk(filePath: string, fileType: string) {
  let loader;
  switch (fileType) {
    case 'pdf': loader = new PDFLoader(filePath); break;
    case 'docx': loader = new DocxLoader(filePath); break;
    case 'txt': loader = new TextLoader(filePath); break;
    default: throw new Error('Unsupported file format');
  }
  const docs = await loader.load();
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
  return await splitter.splitDocuments(docs);
}

function chunkText(text: string) {
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
  return splitter.createDocuments([text]);
}

async function generateFlashcards(chunks: any[], number: number): Promise<{ front: string, back: string }[]> {
  const flashcards: { front: string, back: string }[] = [];
  const basePerChunk = Math.floor(number / chunks.length);
  let remainder = number % chunks.length;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const cardsThisChunk = basePerChunk + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder--;

    const prompt = generateFlashcardPrompt(cardsThisChunk).replace('{text}', chunk.pageContent || chunk);

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You generate clean flashcards. Return only valid JSON arrays.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        const cleaned = extractJsonArray(content);
        const cards = JSON.parse(cleaned);
        if (Array.isArray(cards)) flashcards.push(...cards);
      }
    } catch (err) {
      console.error('❌ Error generating flashcards:', err);
    }
  }

  return flashcards.slice(0, number);
}

export async function GET() {
  return NextResponse.json({
    message: 'Flashcard Generation API is running',
    endpoint: '/api/generate-flashcards',
    methods: ['POST'],
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const text = formData.get('text') as string | null;
    const numberParam = formData.get('number') as string | null;
    const number = numberParam ? parseInt(numberParam) : 10;

    if (!file && !text) {
      return NextResponse.json({ error: 'Provide either a file or text input' }, { status: 400, headers: corsHeaders });
    }

    if (number > 50 || number < 1) {
      return NextResponse.json({ error: 'Number of flashcards must be between 1 and 50' }, { status: 400, headers: corsHeaders });
    }

    let chunks;

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (!['pdf', 'docx', 'txt'].includes(fileExtension || '')) {
        return NextResponse.json({ error: 'Unsupported file format. Use PDF, DOCX, or TXT.' }, { status: 400, headers: corsHeaders });
      }

      const tempPath = join(tmpdir(), `upload_${Date.now()}.${fileExtension}`);
      try {
        await writeFile(tempPath, buffer);
        chunks = await loadAndChunk(tempPath, fileExtension || '');
      } catch (fileError) {
        console.error('Error processing file:', fileError);
        return NextResponse.json({ error: 'Failed to process uploaded file' }, { status: 500, headers: corsHeaders });
      } finally {
        try { await unlink(tempPath); } catch (cleanupError) { console.error('Cleanup error:', cleanupError); }
      }
    } else if (text) {
      chunks = await chunkText(text);
    }

    if (!chunks || chunks.length === 0) {
      return NextResponse.json({ error: 'No content extracted' }, { status: 400, headers: corsHeaders });
    }

    const flashcards = await generateFlashcards(chunks, number);

    if (flashcards.length === 0) {
      return NextResponse.json({ error: 'No flashcards generated' }, { status: 500, headers: corsHeaders });
    }

    return NextResponse.json({
      flashcards,
      totalFlashcards: flashcards.length,
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Flashcard generation error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}
