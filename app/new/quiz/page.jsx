'use client';

import { useState } from 'react';
import QuizQuestions from '../../_components/QuizQuestions';

export default function NewQuiz() {
  const [inputMethod, setInputMethod] = useState('text'); // 'text', 'file', or 'youtube'
  const [content, setContent] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [file, setFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizGenerated, setQuizGenerated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // TODO: Implement API call to generate quiz based on input method
    // For now, we'll simulate a delay
    setTimeout(() => {
      setIsGenerating(false);
      setQuizGenerated(true);
    }, 2000);
  };

  if (quizGenerated) {
    return( 
    <div className='pt-32'>
    <QuizQuestions />
    </div>

    );
  }

  return (
    <div className="max-full mx-auto p-6 pt-38 h-screen space-y-8">
      <h1 className="text-3xl font-bold text-white text-center">Generate a New Quiz</h1>
      
      {/* Input Method Selection */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setInputMethod('text')}
          className={`px-4 py-2 rounded-lg transition-colors ${inputMethod === 'text' ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
        >
          Text Description
        </button>
        <button
          onClick={() => setInputMethod('file')}
          className={`px-4 py-2 rounded-lg transition-colors ${inputMethod === 'file' ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
        >
          Upload Notes
        </button>
        <button
          onClick={() => setInputMethod('youtube')}
          className={`px-4 py-2 rounded-lg transition-colors ${inputMethod === 'youtube' ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
        >
          YouTube Video
        </button>
      </div>

      {/* Quiz Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Number of Questions */}
        <div className="space-y-2">
          <label className="block text-white font-medium">Number of Questions</label>
          <input
            type="number"
            min="1"
            max="25"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Math.min(25, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-full bg-white/10 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-gray-400 text-sm">Maximum 25 questions</p>
        </div>

        {/* Difficulty Selector */}
        <div className="space-y-2">
          <label className="block text-white font-medium">Difficulty Level</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full bg-white/10 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="easy" className="bg-gray-800">Easy</option>
            <option value="medium" className="bg-gray-800">Medium</option>
            <option value="hard" className="bg-gray-800">Hard</option>
          </select>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {inputMethod === 'text' && (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your text content here..."
            className="w-full h-48 bg-white/10 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        )}

        {inputMethod === 'file' && (
          <div className="flex items-center justify-center w-full">
            <label className="w-full h-32 flex flex-col items-center justify-center px-4 py-6 bg-white/10 text-white rounded-lg tracking-wide cursor-pointer hover:bg-white/20 transition-colors">
              <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
              </svg>
              <span className="mt-2 text-base">
                {file ? file.name : 'Select a file'}
              </span>
              <input
                type="file"
                className="hidden"
                accept=".txt,.pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </label>
          </div>
        )}

        {inputMethod === 'youtube' && (
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="Enter YouTube video URL"
            className="w-full bg-white/10 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        )}

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating Quiz...' : 'Generate Quiz'}
        </button>
      </form>
    </div>
  );
}