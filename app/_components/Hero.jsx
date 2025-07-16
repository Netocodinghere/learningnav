import React from 'react'

const Hero = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating cartoon elements */}
        <img src="/kid.png" className="absolute top-20 right-10 w-16 h-16 opacity-20 animate-bounce" alt="" />
        <img src="/pen.png" className="absolute top-40 left-20 w-12 h-12 opacity-15 animate-pulse" alt="" />
        <img src="/study.png" className="absolute bottom-40 right-20 w-20 h-20 opacity-10 animate-float" alt="" />

        {/* Subtle geometric shapes */}
        <div className="absolute top-32 left-1/4 w-32 h-32 bg-cyan-400/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-1/4 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Hero Content */}
          <div className="mb-16">
            <div className="mb-8 relative">
              <img
                src="/monitor.svg"
                className="w-48 h-48 lg:w-64 lg:h-64 mx-auto opacity-90"
                alt="Learning platform illustration"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl scale-150"></div>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Transform Any Content Into
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Smart Study Materials
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Upload PDFs or paste YouTube links to instantly generate
              <span className="text-cyan-400 font-medium"> flashcards, cheat sheets, and quizzes</span> powered by AI
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <a
                href="/signup"
                className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl inline-flex items-center justify-center gap-2"
              >
                <span>Start Learning Free</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>

              <a
                href="#demo"
                className="px-8 py-4 border border-gray-500/30 bg-black/20 backdrop-blur-md hover:bg-black/30 text-gray-300 hover:text-white font-medium rounded-2xl transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span>Watch Demo</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Everything You Need to Study Smarter
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From any source to structured learning materials in seconds
            </p>
          </div>

          {/* Main Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="group p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h4v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm8 8a1 1 0 01-1-1V8a1 1 0 10-2 0v4a1 1 0 01-1 1H6a1 1 0 100 2h8a1 1 0 100-2h-2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI Flashcards</h3>
              <p className="text-gray-400 leading-relaxed">
                Upload PDFs or YouTube videos and get intelligent flashcards that focus on key concepts and definitions
              </p>
            </div>

            <div className="group p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Smart Cheat Sheets</h3>
              <p className="text-gray-400 leading-relaxed">
                Get concise, organized summaries of complex topics with key formulas, concepts, and quick references
              </p>
            </div>

            <div className="group p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Interactive Quizzes</h3>
              <p className="text-gray-400 leading-relaxed">
                Test your understanding with AI-generated quizzes that adapt to your learning progress and weak points
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-white mb-8">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center text-black font-bold text-lg mb-4">1</div>
                <h4 className="text-lg font-semibold text-white mb-2">Upload Content</h4>
                <p className="text-gray-400 text-center">Drop your PDF files or paste YouTube video links</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-black font-bold text-lg mb-4">2</div>
                <h4 className="text-lg font-semibold text-white mb-2">AI Processing</h4>
                <p className="text-gray-400 text-center">Our AI analyzes and extracts key learning points</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center text-black font-bold text-lg mb-4">3</div>
                <h4 className="text-lg font-semibold text-white mb-2">Start Learning</h4>
                <p className="text-gray-400 text-center">Get your personalized study materials instantly</p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <div className="p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Learning?</h3>
              <p className="text-gray-400 mb-6">Join thousands of students who are already learning smarter with AI</p>
              <a
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span>Get Started Free</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero