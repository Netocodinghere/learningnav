'use client'

import { useEffect, useState } from 'react'

import { supabase } from '../../lib/auth' 
const Nav = () => {
  const [user, setUser] = useState(null)

  // Check auth state on mount
  useEffect(() => {
    const fetchUser = async () => {

      const { data: { session } } = await supabase.auth.getSession()

      setUser(session?.user || null)
     
      
 
    }
    fetchUser()

  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = '/signin'
  }

  return (
    <div className="w-full items-center flex justify-center ">
      <div className="flex fixed z-20 top-0 justify-between lg:w-3/4 w-[95%] rounded-full my-4 p-6 backdrop-xl  blur-sm lg:bg-black/30 bg-black/60 items-center">
        <a href="/">
          <span className="font-extrabold text-3xl self-center inline-flex items-center justify-center text-gray-50 lg:text-3xl"> 
            <img src="/oip.png" alt="Pencil Holder" className="lg:size-16 size-16 bg-white rounded-full mr-1" />
            <span>LearnNav</span>     
          </span>
        </a>

        <div className="hidden lg:flex gap-2 text-sm lg:text-lg items-center justify-center justify-self-end">
          {user ? (
            <button 
              onClick={handleSignOut} 
              className="p-1 lg:p-2 inline-flex bg-red-600 hover:bg-red-500 text-white font-semibold rounded-sm shadow-lg"
            >
              Sign Out
            </button>
          ) : (
            <>
              <a className="p-1 text-white bg-transparent hover:underline font-semibold" href="/signin">Sign In</a>
              <a className="p-1 lg:p-2 inline-flex bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-sm shadow-lg" href="/signup">
                <span>Get Started</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 self-center">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z" clipRule="evenodd" />
                </svg>
              </a>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 lg:hidden block text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
        </svg>
      </div>
    </div>
  )
}

export default Nav
