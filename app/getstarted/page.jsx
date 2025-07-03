import React from 'react'
import Link from 'next/link'
const page = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen '>
      <div className='bg-gray-100 p-8 rounded-lg shadow-lg max-w-md w-full'>
        <h1 className='text-3xl font-bold mb-4'>Get Started</h1>
        <p className='mb-6'>Welcome to our platform! Follow the steps below to get started:</p>
        <ol className='list-decimal list-inside space-y-2'>
          <li>Create an account by clicking the "Sign Up" button.</li>
          <li>Complete your profile with relevant information.</li>
          <li>Explore our features and start using the platform.</li>
        </ol>
        <div className='flex flex-col items-start mt-6'>
        <Link href="/signup" className=' px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'>
          Sign Up
        </Link>
        </div>
      </div>

    </div>
  )
}

export default page