'use client';

import { useState } from 'react';
import StudyList from '../_components/StudyList';

function StudyModal({ open, onClose, onVideoSubmit, onFileUpload, videoUrl, setVideoUrl, file, setFile }) {
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
        {/* YouTube Link */}
        <form onSubmit={onVideoSubmit} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Video URL</label>
          <input
            type="url"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-3 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-colors"
          >
            Create Study from Video
          </button>
        </form>
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

  const handleVideoSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement video processing logic
    console.log('Processing video:', videoUrl);
    setModalOpen(false);
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    // TODO: Implement note processing logic
    console.log('Processing file:', uploadedFile?.name);
  };

  return (
    <div className=" overflow-y-auto mx-auto px-6 min-h-screen w-full  ">
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
        file={file}
        setFile={setFile}
      />
    </div>
  );
}