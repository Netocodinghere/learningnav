'use client';
import { useState, useEffect } from 'react';
import Flashcard from '../../_components/FlashCard';
import { useParams } from 'next/navigation';
import { supabase } from "../../../lib/auth"
import { FullScreenLoader } from '../../_components/Loader';

export default function StudyPage() {
  const [studyHours, setStudyHours] = useState(2.5);
  const [study, setStudy] = useState(null);
  const [user, setUser] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [aiQuestion, setAiQuestion] = useState('');
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('flashcards');
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setAccessToken(session?.access_token || null);
     
      if (session?.user) {
        const metrics = await fetch("/api/get/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_id: session?.user?.id
          })
        });
        const res = await metrics.json();
        setMetrics(res.data || null);

        const study = await fetch("/api/get/study", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_id: session?.user?.id,
            study_id: id
          })
        });
        const studyRes = await study.json();
        setStudy(studyRes.data);
        setPageLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleAiSubmit = () => {
    // Handle AI question submission
    console.log('AI Question:', aiQuestion);
    setAiQuestion('');
  };

  const handleNotesUpdate = () => {
    // Handle notes update
    console.log('Notes updated:', notes);
  };

  if (pageLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <FullScreenLoader type='ripple' />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pt-24 bg-transparent">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h4v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm8 8a1 1 0 01-1-1V8a1 1 0 10-2 0v4a1 1 0 01-1 1H6a1 1 0 100 2h8a1 1 0 100-2h-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {study?.title || 'Study Session'}
                  </h1>
                  <p className="text-gray-400">Continue your learning journey</p>
                </div>
              </div>
            </div>

            {/* Study Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
                <div className="text-2xl font-bold text-cyan-400">{study?.flashcards?.length || 0}</div>
                <div className="text-xs text-gray-400">Flashcards</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
                <div className="text-2xl font-bold text-purple-400">{studyHours}h</div>
                <div className="text-xs text-gray-400">Study Time</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
                <div className="text-2xl font-bold text-green-400">85%</div>
                <div className="text-xs text-gray-400">Progress</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">Study Progress</span>
              <span className="text-white font-medium">85%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500" style={{ width: '85%' }} />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'flashcards', label: 'Flashcards', icon: '🎴' },
              { id: 'ai-tutor', label: 'AI Tutor', icon: '🤖' },
              { id: 'notes', label: 'Notes', icon: '📝' },
              { id: 'cheatsheet', label: 'Cheat Sheet', icon: '📄' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Flashcards Section */}
          {activeTab === 'flashcards' && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Flashcards</h2>
                <span className="text-sm text-gray-400">
                  {study?.flashcards?.length || 0} cards available
                </span>
              </div>
              
              {study?.flashcards?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {study.flashcards.map((card, index) => (
                    <Flashcard key={index} question={card.front} answer={card.back} />
                  ))}
                </div>
              ) : (
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h4v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm8 8a1 1 0 01-1-1V8a1 1 0 10-2 0v4a1 1 0 01-1 1H6a1 1 0 100 2h8a1 1 0 100-2h-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No flashcards yet</h3>
                  <p className="text-gray-400 mb-4">Create flashcards to start studying</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-2xl transition-all duration-300 hover:scale-105">
                    Create Flashcards
                  </button>
                </div>
              )}
            </section>
          )}

          {/* AI Tutor Section */}
          {activeTab === 'ai-tutor' && (
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-400 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">AI Study Assistant</h2>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="space-y-4">
                  <label className="block text-white font-medium">Ask your AI tutor anything about this topic</label>
                  <textarea
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder="e.g., Can you explain this concept in simpler terms? What are some real-world applications?"
                    className="w-full h-32 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 resize-none"
                  />
                  <button
                    onClick={handleAiSubmit}
                    disabled={!aiQuestion.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-2xl transition-all duration-300 hover:scale-105"
                  >
                    Ask AI Tutor
                  </button>
                </div>

                {/* Sample Questions */}
                <div className="border-t border-white/10 pt-4">
                  <p className="text-sm text-gray-400 mb-3">Quick questions to get started:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Explain the key concepts",
                      "Give me examples",
                      "What should I focus on?",
                      "Test my understanding"
                    ].map((question) => (
                      <button
                        key={question}
                        onClick={() => setAiQuestion(question)}
                        className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white text-sm rounded-xl transition-all duration-200"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Notes Section */}
          {activeTab === 'notes' && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Study Notes</h2>
                <button
                  onClick={handleNotesUpdate}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Save Notes
                </button>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write your study notes here... You can jot down key points, questions, or insights as you study."
                  className="w-full h-64 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 resize-none"
                />
              </div>
            </section>
          )}

          {/* Cheat Sheet Section */}
          {activeTab === 'cheatsheet' && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Quick Reference</h2>
              
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Cheat sheet coming soon</h3>
                  <p className="text-gray-400 mb-4">We're working on generating a comprehensive cheat sheet for this topic</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-medium rounded-2xl transition-all duration-300 hover:scale-105">
                    Generate Cheat Sheet
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            Take a Quiz
          </button>
          <button className="px-8 py-4 border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium rounded-2xl backdrop-blur-sm transition-all duration-300">
            Study More Topics
          </button>
        </div>
      </div>
    </div>
  );
}
