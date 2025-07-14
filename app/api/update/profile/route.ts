import { NextRequest, NextResponse } from 'next/server';
import {supabase} from "../../../../lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, quizzes, cheatsheets, studies, flashcards } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    const updateFields: Record<string, any> = {};

    if (quizzes !== undefined) updateFields.quizzes =parseInt( quizzes);
    if (cheatsheets !== undefined) updateFields.cheatsheets =parseInt( cheatsheets);
    if (studies !== undefined) updateFields.studies =parseInt( studies);
    if (flashcards !== undefined) updateFields.flashcards =parseInt( flashcards);

    const { data, error } = await supabase
      .from('profiles')
      .update(updateFields)
      .eq('id', user_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Profile updated', profile: data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
