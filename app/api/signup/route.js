
import { NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";


const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);


export async function POST(req) {
        const data = await req.json();
        const { email, password}=data

        if (!email || !password ) {
            return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 });
        }

        const res= await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}`,
              
            }
        });

        const { user, session, error } = res.data;
        console.log(res)

        if(!user ) {
            return NextResponse.json({ error:res.error?.code }, { status: 200 });
        }

        if (error) {
            return NextResponse.json({ error: error?.code }, { status: 200 });
        }
        return NextResponse.json({ user, session }, {status:200});

}
