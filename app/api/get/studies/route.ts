import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest ){
    const  req= await request.json()
    const {user_id,study_id}= req
    try{
    const {data, error}= await supabase.from('studies').select('*').eq('id',study_id).single()
    if(error){
        return NextResponse.json({error: error.message})
    }
    return NextResponse.json({success:"Study Received Successfully",data})
    }
    catch(error){
        return NextResponse.json({error: error.message})
    }


}