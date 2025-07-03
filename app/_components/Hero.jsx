import React from 'react'

const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
  {/* Background Video */}


  {/* Overlay */}
  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

  {/* Random Cartoon Images */}
    <img
      src="/pen.png"
      alt="Floating Kid"
      className={`absolute object-cover animate-floating z-0 pointer-events-none`}
      style={{
        bottom: '1%',
        left: '1%',
      }}
    />


  {/* Hero Content */}
  <div className="relative z-10 flex flex-col bg-black/10 backdrop-blur-sm lg:backdrop-blur-xs lg:backdrop-blur-0  items-center justify-center text-center text-white h-full px-6">
    <img src="https://lukaszadam.com/images/free-illustrations/monitor.svg" className='w-80 h-80' alt="" />
    <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
      Your AI-Powered<span className='text-cyan-400 bg-black/80'> Study Companion</span> 
    </h1>
    <p className="mt-4 text-lg md:text-xl text-white max-w-2xl drop-shadow-md">
      Generate flashcards, quizzes, and study plans instantly. Learn smarter, not harder.
    </p>

    <div className="mt-8 flex flex-col sm:flex-row gap-4">
      <a
        href="#"
        className="px-6 py-3 bg-blue-700 inline-flex items-center justify-center gap-1 text-white font-semibold rounded-md shadow-md hover:bg-blue-500 transition"
      >
        <span>Get Started</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
          <path
            fillRule="evenodd"
            d="M2 8c0 .414.336.75.75.75h8.69l-1.22 1.22a.75.75 0 1 0 1.06 1.06l2.5-2.5a.75.75 0 0 0 0-1.06l-2.5-2.5a.75.75 0 1 0-1.06 1.06l1.22 1.22H2.75A.75.75 0 0 0 2 8Z"
            clipRule="evenodd"
          />
        </svg>
      </a>

      <a
        href="#"
        className="px-6 py-3 border border-white bg-white/10 text-white font-medium rounded-md hover:bg-white/30 transition inline-flex"
      >
        <span>Watch Demo</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
          <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z"
            clipRule="evenodd"
          />
        </svg>
      </a>
    </div>
  </div>
</div>



)
}

export default Hero