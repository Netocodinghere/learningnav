// app/api/generate-quiz/route.ts
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

interface QuizQuestion {
  question: string;
  type: 'single-choice' | 'multiple-choice' | 'open-ended' | 'fill-in-the-blank';
  options?: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer: string | string[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function extractJsonArray(raw: string): string {
  return raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
}

const generatePrompt = (difficulty: string, number: number) => `
Generate exactly ${number} quiz questions from the following content with ${difficulty} difficulty level.
  
  Create a balanced mix of the following question types:
  - Single-choice
  - Multiple-choice
  - Open-ended (with answers)
  - Fill-in-the-blank (with answers)
  
  Aim for a roughly even distribution (e.g. 2:1:1:1 or similar, based on the total number).
  
  ---
  
  ### Difficulty Guide:
  - Easy: Basic facts, definitions, simple recall
  - Medium: Application, analysis, relationships between concepts
  - Hard: Synthesis, evaluation, complex reasoning
  
  ---
  
  ### Question Type Definitions:
  
  **Single-choice**
  - "type": "single-choice"
  - "question": string
  - "options": [ A, B, C, D ]
  - "answer": string (e.g., "A")
  
  **Multiple-choice**
  - "type": "multiple-choice"
  - "question": string
  - "options": [ A, B, C, D ]
  - "answer": array of correct options (e.g., ["A", "C"])
  
  **Open-ended**
  - "type": "open-ended"
  - "question": string
  - "answer": string (concise correct response)
  
  **Fill-in-the-blank**
  - "type": "fill-in-the-blank"
  - "question": string — must include a blank (e.g., "The capital of France is _____")
  - "answer": string (the correct word/phrase to complete the sentence)
  
  ---
  
  ### Output Format:
  Return only a valid JSON array of question objects. No explanations or extra text.
  Example:
  [
    {
      "question": "What is the capital of France?",
      "type": "single-choice",
      "options": [
        "A": "Paris",
        "B": "Berlin",
        "C": "Madrid",
        "D": "Rome"
],
      "answer": "A"
    },
    {
      "question": "The boiling point of water is _____ degrees Celsius.",
      "type": "fill-in-the-blank",
      "answer": "100"
    }
  ]
  
  ---
  
  ### Content:
  {text}`;
    
async function loadAndChunk(filePath: string, fileType: string) {
  let loader;

  switch (fileType) {
    case 'pdf':
      loader = new PDFLoader(filePath);
      break;
    case 'docx':
      loader = new DocxLoader(filePath);
      break;
    case 'txt':
      loader = new TextLoader(filePath);
      break;
    default:
      throw new Error('Unsupported file format');
  }

  const docs = await loader.load();
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  return await splitter.splitDocuments(docs);
}

function chunkText(text: string) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  return splitter.createDocuments([text]);
}

async function generateQuestions(
  chunks: any[],
  totalQuestions: number,
  difficulty: string = 'medium'
): Promise<QuizQuestion[]> {
  const numChunks = chunks.length;
  const basePerChunk = Math.floor(totalQuestions / numChunks);
  let remainder = totalQuestions % numChunks;
  const shuffledChunks = shuffleArray(chunks);

  const prompts = shuffledChunks.map((chunk, i) => {
    const questionsForChunk = basePerChunk + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder--;

    if (questionsForChunk === 0) return null;

    const prompt = generatePrompt(difficulty, questionsForChunk).replace(
      '{text}',
      chunk.pageContent || chunk
    );

    return openai.chat.completions
      .create({
        model: 'gpt-4o-mini-2024-07-18',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that generates quiz questions. Always respond with valid JSON arrays only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 2500,
      })
      .then((response) => {
        const content = response.choices[0]?.message?.content;
        if (!content) return [];

        try {
          const cleaned = extractJsonArray(content);
          const questions = JSON.parse(cleaned);
          return Array.isArray(questions) ? questions : [];
        } catch (error) {
          console.error('Parsing error:', error);
          console.error('Raw response:', content);
          return [];
        }
      })
      .catch((error) => {
        console.error(`Error generating questions for chunk ${i}:`, error);
        return [];
      });
  });

  const allResults = await Promise.all(prompts.filter(Boolean));
  const flattened = allResults.flat();
  return flattened.slice(0, totalQuestions);
}


export async function GET() {
  return NextResponse.json({
    message: 'Quiz Generation API is running',
    endpoint: '/api/generate-quiz',
    methods: ['POST'],
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get('file') as File | null;
    const text = formData.get('text') as string | null;
    const numberParam = formData.get('number') as string | null;
    const difficulty = formData.get('difficulty') as string || 'medium';

    const number = numberParam ? parseInt(numberParam) : 10;

    if (!file && !text) {
      return NextResponse.json(
        { error: 'Provide either a file or text input' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (number > 25 || number < 1) {
      return NextResponse.json(
        { error: 'Number of questions must be between 1 and 25' },
        { status: 400, headers: corsHeaders }
      );
    }

    let chunks;

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (!['pdf', 'docx', 'txt', 'doc'].includes(fileExtension || '')) {
        return NextResponse.json(
          { error: 'Unsupported file format. Please use PDF, DOCX, or TXT files.' },
          { status: 400, headers: corsHeaders }
        );
      }

      const tempPath = join(tmpdir(), `upload_${Date.now()}.${fileExtension}`);

      try {
        await writeFile(tempPath, buffer);
        chunks = await loadAndChunk(tempPath, fileExtension || '');
      } catch (fileError) {
        console.error('Error processing file:', fileError);
        return NextResponse.json(
          { error: 'Failed to process the uploaded file' },
          { status: 500, headers: corsHeaders }
        );
      } finally {
        try {
          await unlink(tempPath);
        } catch (cleanupError) {
          console.error('Error cleaning up temp file:', cleanupError);
        }
      }
    } else if (text && text.trim().length > 0) {
      if (text.trim().length < 100) {
        // Treat short input as a topic
        const topic = text.trim();
        const prompt = `
Generate exactly ${number} quiz questions from the following content with ${difficulty} difficulty level.
  
  Create a balanced mix of the following question types:
  - Single-choice
  - Multiple-choice
  - Open-ended (with answers)
  - Fill-in-the-blank (with answers)
  
  Aim for a roughly even distribution (e.g. 2:1:1:1 or similar, based on the total number).
  
  ---
  
  ### Difficulty Guide:
  - Easy: Basic facts, definitions, simple recall
  - Medium: Application, analysis, relationships between concepts
  - Hard: Synthesis, evaluation, complex reasoning
  
  ---
  
  ### Question Type Definitions:
  
  **Single-choice**
  - "type": "single-choice"
  - "question": string
  - "options": [ A, B, C, D ]
  - "answer": string (e.g., "A")
  
  **Multiple-choice**
  - "type": "multiple-choice"
  - "question": string
  - "options": [ A, B, C, D ]
  - "answer": array of correct options (e.g., ["A", "C"])
  
  **Open-ended**
  - "type": "open-ended"
  - "question": string
  - "answer": string (concise correct response)
  
  **Fill-in-the-blank**
  - "type": "fill-in-the-blank"
  - "question": string — must include a blank (e.g., "The capital of France is _____")
  - "answer": string (the correct word/phrase to complete the sentence)
  
  ---
  
  ### Output Format:
  Return only a valid JSON array of question objects. No explanations or extra text.
  Example:
  [
    {
      "question": "What is the capital of France?",
      "type": "single-choice",
      "options": [
        "A": "Paris",
        "B": "Berlin",
        "C": "Madrid",
        "D": "Rome"
],
      "answer": "A"
    },
    {
      "question": "The boiling point of water is _____ degrees Celsius.",
      "type": "fill-in-the-blank",
      "answer": "100"
    }
  ]
  
  ---
  
  ### Content:
  ${text}`;

        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini-2024-07-18',
          messages: [
            {
              role: 'system',
              content:
                'You are a quiz generator. Always respond with a valid JSON array of questions. No extra text.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 2500,
        });

        const content = response.choices[0]?.message?.content;

        if (content) {
          try {
            const cleaned = extractJsonArray(content);
            const questions = JSON.parse(cleaned);
            return NextResponse.json({
              questions,
              totalQuestions: questions.length,
              topic,
              difficulty,
            }, { headers: corsHeaders });
          } catch (err) {
            return NextResponse.json(
              { error: 'Failed to parse topic-generated questions' },
              { status: 500, headers: corsHeaders }
            );
          }
        }
      } else {
        // Treat as full text content
        chunks = await chunkText(text);
      }
    }

    if (!chunks || chunks.length === 0) {
      return NextResponse.json(
        { error: 'No content could be extracted from the input' },
        { status: 400, headers: corsHeaders }
      );
    }

    const questions = await generateQuestions(chunks, number, difficulty);

    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions could be generated from the content' },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json({
      questions,
      totalQuestions: questions.length,
      chunksProcessed: chunks.length,
      difficulty,
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error in quiz generation:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}
