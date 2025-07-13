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

// Enable CORS for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface QuizQuestion {
  question: string;
  options?: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer?: string | string[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
function shuffleArray<T>(array: T[]): T[] {
    const result = [...array]; // avoid mutating original
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

Create questions in a 3:2:1 ratio for multiple-choice, single-choice, and open-ended questions respectively.

For ${difficulty} difficulty:
- Easy: Focus on basic facts, definitions, and simple concepts
- Medium: Include analysis, application, and connections between concepts  
- Hard: Require synthesis, evaluation, and complex reasoning

For multiple-choice and single-choice questions:
- Provide the question text
- Provide 4 answer options labeled A, B, C, and D
- Mark the correct answer(s) in the "answer" field
- For multiple-choice: "answer" should be an array of correct options
- For single-choice: "answer" should be a single option string

For open-ended questions:
- Provide only the question text
- Do NOT include "options" or "answer" fields

Return format:
{
  "question": "question text",
  "options": {
    "A": "option text",
    "B": "option text", 
    "C": "option text",
    "D": "option text"
  },
  "answer": ["A", "C"] // or "B" for single choice, or omit for open-ended
}

Content:
{text}

Return only a valid JSON array of question objects.
`;

// Helper function to load and chunk documents
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
async function generateQuestions(
    chunks: any[],
    totalQuestions: number,
    difficulty: string = 'medium'
  ): Promise<QuizQuestion[]> {
    const results: QuizQuestion[] = [];
  
    const numChunks = chunks.length;
    const basePerChunk = Math.floor(totalQuestions / numChunks);
    let remainder = totalQuestions % numChunks;
    const shuffledChunks = shuffleArray(chunks);

    for (let i = 0; i < shuffledChunks.length; i++) {
      const chunk = shuffledChunks[i];

      const questionsForChunk = basePerChunk + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;
  
      if (questionsForChunk === 0) continue; // skip if not needed
  
      const prompt = generatePrompt(difficulty, questionsForChunk).replace(
        '{text}',
        chunk.pageContent || chunk
      );
  
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful assistant that generates quiz questions. Always respond with valid JSON arrays only. No additional text or explanations.',
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
            if (Array.isArray(questions)) {
              results.push(...questions);
            }
          } catch (parseError) {
            console.error('Error parsing JSON response:', parseError);
            console.error('Raw content:', content);
          }
        }
      } catch (error) {
        console.error('❌ Error generating questions for chunk', i, error);
      }
    }
  
    return results.slice(0, totalQuestions); 
  }
  

  function chunkText(text: string) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  
  return splitter.createDocuments([text]);
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
    
    // Validate inputs
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
    } else if (text) {
      chunks = chunkText(text);
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
        details: error instanceof Error ? error.message : 'Unknown error' 
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