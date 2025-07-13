'use client';

import { useState } from 'react';
import StudyList from '../_components/StudyList';
function StudyModal({
  open,
  onClose,
  onVideoSubmit,
  onFileUpload,
  videoUrl,
  setVideoUrl,
  file,
  setFile,
  numFlashcards,
  setNumFlashcards
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Create New Study</h2>

        {/* YouTube Upload (Disabled) */}
        <form
          onSubmit={e => e.preventDefault()}
          className="mb-6 opacity-50 cursor-not-allowed"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Video URL</label>
          <input
            type="url"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-3 bg-gray-100 text-gray-500"
          />
          <button
            type="button"
            disabled
            className="w-full bg-gray-400 text-white px-6 py-2 rounded-md cursor-not-allowed"
          >
            Coming Soon: Create Study from Video
          </button>
        </form>

        {/* Flashcard Count Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Number of Flashcards</label>
          <input
            type="number"
            min={1}
            max={50}
            value={numFlashcards}
            onChange={(e) => setNumFlashcards(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. 10"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Note File</label>
          <input
            type="file"
            onChange={e => {
              setFile(e.target.files[0]);
              onFileUpload(e);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-3 focus:ring-blue-500 focus:border-blue-500"
            accept=".pdf,.doc,.docx,.txt"
          />
          {file && (
            <button
              onClick={() => console.log('Processing file...')}
              className="w-full bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-colors"
            >
              Create Study from Notes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


export default function StudyPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [file, setFile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [numberOfFlashcards, setNumberOfFlashcards] = useState(10);


  const handleVideoSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement video processing logic
    console.log('Processing video:', videoUrl);
    setModalOpen(false);
  };
 
  const handleFileUpload = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');

    
    const formData = new FormData();
    if (!file) {
        setError("Please upload a file.");
        setIsGenerating(false);
        return;
      }
      formData.append('file', file);
      formData.append('number', numberOfFlashcards);

    try {
      const res = await fetch('/api/new/study', {
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



  return (
    <div className="pt-32 overflow-y-auto mx-auto px-6 min-h-screen w-full  ">
      <div className="flex justify-between items-center w-full mb-8">
        <h1 className="lg:text-3xl text-white text-2xl font-bold">Study Dashboard</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-700 text-white lg:px-6 px-2 py-2 rounded-md hover:bg-blue-800 transition-colors"
        >
          New Study +
        </button>
      </div>

      {/* Previous Studies List */}
      <div className="bg-black text-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Previous Studies</h2>
        <StudyList />
      </div>

      <StudyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onVideoSubmit={handleVideoSubmit}
        onFileUpload={handleFileUpload}
        videoUrl={videoUrl}
        setVideoUrl={setVideoUrl}
        setNumFlashcards={setNumberOfFlashcards}
        file={file}
        setFile={setFile}
      />
    </div>
  );
}