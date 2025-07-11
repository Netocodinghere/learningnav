"use client"
import { useEffect, useState } from "react";
import Hero from "./_components/Hero";
import Dashboard from "./_components/Dashboard";
export default function Home() {
  const [auth,setAuth] = useState(true)
  const [user,setUser]=useState(null)
  useEffect(()=>{
    
    const fetchUser = async () => {

      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
     
      if(session?.user){
        setAuth(true)
        
      }
 
    }
    fetchUser()
  })
  return (
   <div>

    {auth? <Dashboard/>:<Hero/>}
   </div>
  );
}
