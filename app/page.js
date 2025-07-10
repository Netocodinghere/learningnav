import { useEffect, useState } from "react";
import Hero from "./_components/Hero";
export default function Home() {
  const [auth,setAuth] = useState(false)
  useEffect(()=>{
    
  })
  return (
   <div>
    <Hero/>
   </div>
  );
}
