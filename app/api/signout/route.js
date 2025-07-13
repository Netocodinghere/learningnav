import { signOut } from '../../../lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const { error } = await signOut();

    if (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
}
