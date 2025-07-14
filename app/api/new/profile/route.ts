import { NextRequest, NextResponse } from 'next/server';
import {supabase} from "../../../../lib/auth"

export default async function POST(request: NextRequest ){
    const  req= await request.json()
    const {user_id}= req
    try{
    const {data, error}= await supabase.from('profiles').insert({id:user_id}).select()
    if(error){
        return NextResponse.json({error: error.message})
    }
    return NextResponse.json({success:"Data Saved Successfully",data})
    }
    catch(error){
        return NextResponse.json({error: error.message})
    }


}