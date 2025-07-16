'use client';

import { useState, useEffect } from 'react';
import QuizQuestions from '../../_components/QuizQuestions';
import { supabase } from '../../../lib/auth';

export default function NewQuiz() {
  const [inputMethod, setInputMethod] = useState('text');
  const [content, setContent] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [file, setFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizGenerated, setQuizGenerated] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [metrics, setMetrics] = useState(null);
  useEffect(()=>{
    
    const fetchUser = async () => {

      const { data: { session } } = await supabase.auth.getSession()

      setUser(session?.user || null)
     
      if(session?.user){

        const metrics= await fetch("/api/get/profile",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            user_id:session?.user?.id
          })
        })
        const res= await metrics.json()
        setMetrics(res.data || null)
        
      }
    }
    fetchUser()
  },[])
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');

    const mode = process.env.NEXT_PUBLIC_MODE;
    
    const formData = new FormData();
    formData.append('number', numQuestions.toString());
    formData.append('difficulty', difficulty);

    // Validation
    if (inputMethod === 'file') {
      if (!file) {
        setError("Please upload a file.");
        setIsGenerating(false);
        return;
      }
      formData.append('file', file);
    } else if (inputMethod === 'text') {
      if (!content.trim()) {
        setError("Please enter text content.");
        setIsGenerating(false);
        return;
      }
      formData.append('text', content);
    } else if (inputMethod === 'youtube') {
      if (!youtubeUrl.trim()) {
        setError("Please enter a YouTube URL.");
        setIsGenerating(false);
        return;
      }
      setError("YouTube input is not yet supported in this version.");
      setIsGenerating(false);
      return;
    }

    try {
      const res = await fetch('/api/new/quiz', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate quiz.");
      }

      const data = await res.json();
      
      setQuestions(data.questions);
      setQuizGenerated(true);

      const updateUser=await fetch('/api/update/profile',{
        method:'POST',
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          user_id: user?.id,
          quizzes:metrics?.quizzes+1
        })
      })
    } catch (error) {
      console.error("Error generating quiz:", error);
      setError(error.message || "Something went wrong while generating the quiz.");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setQuizGenerated(false);
    setQuestions([]);
    setError('');
    setContent('');
    setFile(null);
    setYoutubeUrl('');
  };

  if (quizGenerated) {
    return (
      <div className="h-screen overflow-y-auto pt-32">
        <QuizQuestions
          questions={questions}
          title="Generated Quiz"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pt-24 bg-transparent">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-2xl backdrop-blur-sm border border-white/10">
            <svg className="w-8 h-8 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white">Create Your Quiz</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform your content into interactive quizzes powered by AI
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 backdrop-blur-md border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Main Form Container */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 space-y-8">
          {/* Step 1: Choose Input Method */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                1
              </div>
              <h2 className="text-2xl font-semibold text-white">Choose Your Content Source</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setInputMethod('text')}
                className={`group p-6 rounded-2xl border transition-all duration-300 ${
                  inputMethod === 'text'
                    ? 'bg-gradient-to-br from-blue-600/20 to-blue-700/20 border-blue-500/50 shadow-lg'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="text-center space-y-3">
                  <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center ${
                    inputMethod === 'text' ? 'bg-blue-500/30' : 'bg-white/10'
                  }`}>
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white">Text Content</h3>
                  <p className="text-sm text-gray-400">Paste or type your study material</p>
                </div>
              </button>

              <button
                onClick={() => setInputMethod('file')}
                className={`group p-6 rounded-2xl border transition-all duration-300 ${
                  inputMethod === 'file'
                    ? 'bg-gradient-to-br from-blue-600/20 to-blue-700/20 border-blue-500/50 shadow-lg'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="text-center space-y-3">
                  <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center ${
                    inputMethod === 'file' ? 'bg-blue-500/30' : 'bg-white/10'
                  }`}>
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white">Upload File</h3>
                  <p className="text-sm text-gray-400">PDF, DOCX, or TXT files</p>
                </div>
              </button>

              <button
                onClick={() => setInputMethod('youtube')}
                disabled
                className="group p-6 rounded-2xl border bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
              >
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center bg-white/10">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white">YouTube Video</h3>
                  <p className="text-sm text-gray-400">Coming Soon</p>
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Quiz Settings */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
              <h2 className="text-2xl font-semibold text-white">Configure Your Quiz</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-white font-medium">Number of Questions</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="25"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Math.min(25, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-xs text-gray-400">Max 25</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-white font-medium">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="easy" className="bg-gray-800">🟢 Easy</option>
                  <option value="medium" className="bg-gray-800">🟡 Medium</option>
                  <option value="hard" className="bg-gray-800">🔴 Hard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 3: Content Input */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
              <h2 className="text-2xl font-semibold text-white">Add Your Content</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {inputMethod === 'text' && (
                <div className="space-y-3">
                  <label className="block text-white font-medium">Enter your study material</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste your notes, textbook content, or any study material here..."
                    className="w-full h-48 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 resize-none"
                    required
                  />
                </div>
              )}

              {inputMethod === 'file' && (
                <div className="space-y-3">
                  <label className="block text-white font-medium">Upload your document</label>
                  <div className="relative">
                    <input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      accept=".txt,.pdf,.doc,.docx"
                      onChange={(e) => setFile(e.target.files[0])}
                      required
                    />
                    <label
                      htmlFor="file-upload"
                      className="group w-full h-40 flex flex-col items-center justify-center px-6 py-8 bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/20 hover:border-white/40 text-white rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/15"
                    >
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-8 h-8 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-lg font-medium">
                            {file ? file.name : 'Click to upload or drag and drop'}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            PDF, DOCX, or TXT files only
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {inputMethod === 'youtube' && (
                <div className="relative">
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="Enter YouTube video URL"
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    disabled
                  />
                  <div className="absolute inset-0 bg-gray-500/50 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <span className="text-white font-medium">Coming Soon</span>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={isGenerating || inputMethod === 'youtube'}
                  className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <div className="flex items-center gap-3">
                    {isGenerating ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Generating Quiz...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        <span>Generate Quiz</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}