import { NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";



const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function POST(req) {
    try {
        const data = await req.json();
        const { email, password } = data;

        if (!email || !password) {
            const error = {
                title: 'Missing Fields',
                message: 'Email and password are required'
            };
            return NextResponse.json({ error }, { status: 400 });
        }

        const { data: response, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) { 
        const { title, message } = {title:'Error', message:error.message || 'An unexpected error occurred'};
            return NextResponse.json({ error: { title, message } }, { status: 400 });
        }

        return NextResponse.json(response);
    } catch (error) {
        const { title, message } = {title:'Error', message:error.message || 'An unexpected error occurred'};
        return NextResponse.json({ error: { title, message } }, { status: 500 });
    }
}
