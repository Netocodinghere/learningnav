"use client";
import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting]=useState(false)

     
const handleSubmit =async () => {
  setIsSubmitting(true);
  const data = {
    email: email,
    password: password,
    confirmpassword:confirmPassword
  };

  if(data.password !== data.confirmpassword) {
    toast.error('Passwords do not match');
    return;
  }

  if(email.trim()==""){
      toast.error('Enter Email')
      return

  }

  
  if(password.trim()==""){
      toast.error('Enter Password')
      return

  }

  
  try{
      const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const result = await response.json();
      if (result.error) {
          throw new Error(result.error);
      }

      setIsSubmitting(false);
      if(window  != 'undefined'){
          if(!result.user.user_metadata.email_verified){
              window.location.href = '/confirmation';
          }else{
              window.location.href = '/signin';
          }
      }
  } catch (error) {
      setIsSubmitting(false);
      if(error.message=="user_already_exists"){
          toast.error('User already exists. Please login instead.');
          return;
      }
      if(error.message=="weak_password"){
          toast.error('Password is too weak. Please choose a stronger password.');
          return;
      }
      console.log('Error during signup:', error);
      toast.error('Signup failed. Please try again.');
  }


  
};

  
  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-cyan-900 flex items-center justify-center px-4 pt-20">
  <div className="w-full max-w-md bg-black/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col items-center border border-white/20 mx-auto">
  
  <h1 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-3 drop-shadow">
    Join <span className="text-cyan-400">Now</span>
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
    <input
      type="password"
      placeholder="Confirm Password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      className="px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
    />
    <button
    type='button'
       onClick={handleSubmit}
      className="w-full py-3 mt-2 rounded-lg bg-cyan-500 text-white font-bold shadow hover:bg-cyan-400 transition"
    >
      Sign Up →
    </button>
  </form>

  <div className="mt-6 w-full">
    <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-white/90 text-black font-semibold shadow hover:bg-white transition">
      <FcGoogle size={22} />
      Sign up with Google
    </button>
  </div>

  <span className="text-white text-md mt-3 ">Already Have An Account? <a className='text-cyan-400 font-bold hover:underline' href="/signin">Sign In</a></span>
</div>

</div>
  );
};

export default SignUp;