"use client";
import React, { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';

import { signInWithGoogle } from '../../lib/auth';

const Toast = ({ message, type, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) {
        onClose();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg text-white ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
};


const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [user, setUser] = useState(null);

 
  useEffect(()=>{
        const fetchUser = async () => {
    
          const { data: { session } } = await supabase.auth.getSession()
          setUser(session?.user || null)
         
          if(session?.user) {
          if(window  != 'undefined'){
            window.location.href = '/'
          }
        }
          
        }

        fetchUser()
      
      },[])



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    const req= await fetch('/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      }),
    });

    const { user, session,user_metadata, error } =  await req.json();

    setIsProcessing(false);

    if (error) {
      setError(error.message);
      setToastMessage({ message: error.message, type: "error" });
         if(window  != 'undefined' && error.message==="Email not confirmed"){
            window.location.href = '/confirmation';
        }
    } else {
      if (!user.email_confirmed_at) {
        router.push("/confirmation");
      } else {

        if(localStorage !== null){
          localStorage.setItem("sb-vzxemrgatzjclwbktzyx-auth-token",JSON.stringify(session))
        
        }  
        if(window  != 'undefined'){
            window.location.href = '/';
        }
      }
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-cyan-900 flex items-center justify-center px-4 pt-20">
  <div className="w-full max-w-md bg-black/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col items-center border border-white/20 mx-auto">
  
  <h1 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-3 drop-shadow">
    Welcome <span className="text-cyan-400">Back</span>
  </h1>

  <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
    />
    <button
      type="submit"
      className="w-full py-3 mt-2 rounded-lg bg-cyan-500 text-white font-bold shadow hover:bg-cyan-400 transition"
    >
      Sign In →
    </button>
  </form>

  <div className="mt-6 w-full">
    <button onClick={signInWithGoogle} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-white/90 text-black font-semibold shadow hover:bg-white transition">
      <FcGoogle size={22} />
      Sign up with Google
    </button>
  </div>
  
  <span className="text-white text-md mt-3 ">Don't Have An Account? <a className='text-cyan-400 font-bold hover:underline' href="/signup">Sign Up</a></span>
</div>
{toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}
</div>
  );
};

export default SignIn;