"use client";
import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your sign-up logic here
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
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
      type="submit"
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