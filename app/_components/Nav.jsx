'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/auth' 

const Nav = () => {
  const [user, setUser] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navLinks = user ? [
    { href: '/', label: 'Dashboard', icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    )},
    { href: '/new/quiz', label: 'Create Quiz', icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )},
    { href: '/study', label: 'Study', icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h4v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm8 8a1 1 0 01-1-1V8a1 1 0 10-2 0v4a1 1 0 01-1 1H6a1 1 0 100 2h8a1 1 0 100-2h-2z" clipRule="evenodd" />
      </svg>
    )}
  ] : []

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="max-w-full mx-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 shadow-xl">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <a href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                    </svg>
                  </div>
                </div>
                <span className="text-xl font-bold text-white group-hover:text-white/90 transition-colors">
                  LearnNav
                </span>
              </a>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
                {user && navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                  >
                    {link.icon}
                    <span className="text-sm font-medium">{link.label}</span>
                  </a>
                ))}
              </div>

              {/* Desktop Auth Buttons */}
              <div className="hidden lg:flex items-center space-x-3">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-300 max-w-32 truncate">
                        {user.email}
                      </span>
                    </div>
                    <button 
                      onClick={handleSignOut} 
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 font-medium rounded-xl transition-all duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <a 
                      href="/signin" 
                      className="px-4 py-2 text-gray-300 hover:text-white font-medium transition-colors"
                    >
                      Sign In
                    </a>
                    <a 
                      href="/signup" 
                      className="group px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <span className="flex items-center space-x-2">
                        <span>Get Started</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </a>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
              >
                <svg 
                  className={`w-6 h-6 transition-transform duration-200 ${isMenuOpen ? 'rotate-90' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 w-full lg:hidden">
          <div className="fixed inset-0 w-full bg-black/50 backdrop-blur-sm" onClick={toggleMenu}></div>
          <div className="fixed top-20 left-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
            <div className="p-6 space-y-4">
              {user && navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                  onClick={toggleMenu}
                >
                  {link.icon}
                  <span className="font-medium">{link.label}</span>
                </a>
              ))}
              
              <div className="border-t border-white/10 pt-4">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-gray-300 truncate">{user.email}</span>
                    </div>
                    <button 
                      onClick={handleSignOut} 
                      className="w-full px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-medium rounded-xl transition-all duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <a 
                      href="/signin" 
                      className="block w-full px-4 py-3 text-center text-gray-300 hover:text-white hover:bg-white/10 font-medium rounded-xl transition-all duration-200"
                      onClick={toggleMenu}
                    >
                      Sign In
                    </a>
                    <a 
                      href="/signup" 
                      className="block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center font-medium rounded-xl shadow-lg transition-all duration-300"
                      onClick={toggleMenu}
                    >
                      Get Started
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Nav
