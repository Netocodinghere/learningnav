"use client"
import { useEffect, useState } from "react";
import Hero from "./_components/Hero";
import Dashboard from "./_components/Dashboard";
import  FullScreenLoader  from "./_components/Loader";
import { supabase, signInWithGoogle } from "../lib/auth";

export default function Home() {
  const [auth,setAuth] = useState(false)
  const [pageLoading,setPageLoading]=useState(true)
  const [user,setUser]=useState(null)
  useEffect(()=>{
    
    const fetchUser = async () => {

      const { data: { session } } = await supabase.auth.getSession()

      setUser(session?.user || null)
     
      if(session?.user){
        setAuth(true)
        setPageLoading(false)
        
      }
      
    setPageLoading(false)
 
    }
    fetchUser()
  })
  return (
   <div className="bg-transparent">

    {pageLoading? <div className="h-screen flex items-center justify-center w-full "> <FullScreenLoader message="Wait A Moment" type="ripple" /> </div>: auth? <Dashboard/>:<Hero/>}
   </div>
  );
}
