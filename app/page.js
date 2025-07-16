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
  const [metrics,setMetrics]=useState(null)
  const [studies, setStudies]=useState(null)
  useEffect(()=>{
    
    const fetchUser = async () => {

      const { data: { session } } = await supabase.auth.getSession()

      setUser(session?.user || null)
     
      if(session?.user){

        setAuth(true)
        const metrics= await fetch("/api/get/profile",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            user_id:session?.user?.id
          })
        })
        const res= await metrics.json()
        setMetrics(res.data || null)

        
        
      }
       setPageLoading(false)
    }
    fetchUser()
  },[])
  return (
   <div className="w-full bg-transparent">

    {pageLoading? <div className="h-screen flex items-center justify-center w-full "> <FullScreenLoader message="Wait A Moment" type="ripple" /> </div>: auth? <Dashboard profile={metrics}/>:<Hero/>}
   </div>
  );
}
