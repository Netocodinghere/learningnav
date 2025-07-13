import { supabase } from '../../../../lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const flashcardsRaw = formData.get('flashcards') as string;
    const user_id = formData.get('user_id') as string;
    const file = formData.get('file') as File; // still ignored for now

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
      return NextResponse.json(
        { error: 'Invalid flashcards JSON' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('studies')
      .insert([{ title, flashcards, user_id }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to save study' },
        { status: 500 }
      );
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
