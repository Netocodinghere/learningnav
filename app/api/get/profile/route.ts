import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest ){
    const  req= await request.json()
    const {user_id}= req
    try{
    const {data, error}= await supabase.from('profiles').select('*').eq('id',user_id).single()
    if(data.length<1){
     const {data, error}= await supabase.from('profiles').insert({id:user_id}).select()
     if(error){
         return NextResponse.json({error: error.message})
     }
      return NextResponse.json({success:"Data Saved Successfully",data})
    }
    if(error){
        return NextResponse.json({error: error.message})
    }
    return NextResponse.json({success:"Data Saved Successfully",data})
    }
    catch(error){
        return NextResponse.json({error: error.message})
    }


}