'use client';

import { useState } from 'react';
import QuizQuestions from '../../_components/QuizQuestions';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');

    const mode = process.env.NEXT_PUBLIC_MODE;
    const apiUrl = mode === "local" ? "http://localhost:8000/api/generate-quiz" : "/api/generate-quiz";

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
      console.log("Generated Questions:", data.questions);
      
      setQuestions(data.questions);
      setQuizGenerated(true);
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
      <div className="max-full mx-auto w-full lg:p-16 p-8 pt-38 lg:pt-38 h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Generated Quiz</h1>
          <button
            onClick={resetForm}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Generate New Quiz
          </button>
        </div>
        
        <div className="mb-6 p-4 bg-white/10 rounded-lg">
          <p className="text-gray-300">
            Generated {questions.length} questions • Difficulty: {difficulty}
          </p>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">
                {index + 1}. {question.question}
              </h3>
              
              {question.options && (
                <div className="space-y-2 mb-4">
                  {Object.entries(question.options).map(([key, value]) => (
                    <div key={key} className="text-gray-300">
                      <span className="font-medium text-blue-400">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              )}
              
              {question.answer && (
                <div className="mt-4 p-3 bg-green-500/20 rounded-lg">
                  <span className="text-green-400 font-medium">Answer: </span>
                  <span className="text-white">
                    {Array.isArray(question.answer) 
                      ? question.answer.join(', ') 
                      : question.answer}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-full mx-auto w-full lg:p-16 p-8 pt-38 lg:pt-38 h-screen overflow-y-auto space-y-8">
      <h1 className="text-3xl font-bold text-white text-center">Generate a New Quiz</h1>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Input Method Selection */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setInputMethod('text')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            inputMethod === 'text' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          Text Description
        </button>
        <button
          onClick={() => setInputMethod('file')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            inputMethod === 'file' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          Upload Notes
        </button>
        <button
          onClick={() => setInputMethod('youtube')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            inputMethod === 'youtube' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          } opacity-50 cursor-not-allowed`}
          disabled
        >
          YouTube Video (Coming Soon)
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
            className="w-full h-48 bg-white/10 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
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
              <span className="text-sm text-gray-400 mt-1">
                PDF, DOCX, or TXT files only
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
          <div className="relative">
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="Enter YouTube video URL"
              className="w-full bg-white/10 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              disabled
            />
            <div className="absolute inset-0 bg-gray-500/50 rounded-lg flex items-center justify-center">
              <span className="text-white font-medium">Coming Soon</span>
            </div>
          </div>
        )}

        <div className="w-full justify-center flex items-center">
          <button
            type="submit"
            disabled={isGenerating || inputMethod === 'youtube'}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating Quiz...' : 'Generate Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
}