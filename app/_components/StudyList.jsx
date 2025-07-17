import { useState, useEffect } from 'react';
import { supabase } from '../../lib/auth';

function StudyList({user_id}) {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStudies() {
      try {
        setLoading(true);
        const response = await fetch('/api/get/studies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: user_id }),
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch studies');
        }

        // Transform the data to match our component's expected format
        const formattedStudies = result.data.map(study => ({
          id: study.id,
          title: study.title,
          source: study.source || 'Unknown',
          flashcardCount: study.flashcards ? study.flashcards.length : 0,
          date: study.created_at,
          studyHours: study.time_spent ? (study.time_spent / 3600).toFixed(1) : 0, // Convert seconds to hours
          progress: calculateProgress(study), // We'll implement this function
          difficulty: determineDifficulty(study) // We'll implement this function
        }));

        setStudies(formattedStudies);
      } catch (err) {
        console.error('Error fetching studies:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    
    }

    fetchStudies();
  }, []);

  // Helper function to calculate progress (placeholder implementation)
  const calculateProgress = (study) => {
    // You can implement your own logic based on your data structure
    // For now, returning a random value between 0-100
    return Math.floor(Math.random() * 100);
  };

  // Helper function to determine difficulty (placeholder implementation)
  const determineDifficulty = (study) => {
    // You can implement your own logic based on your data
    // For now, randomly selecting from the three difficulty levels
    const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case 'YouTube':
        return (
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        );
      case 'Notes':
        return (
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center animate-pulse">
          <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2">Loading studies...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 bg-red-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
          <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2">Error loading studies</h3>
        <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-3 sm:mb-4 px-4 md:max-w-md mx-auto">{error}</p>
      </div>
    );
  }

  if (studies.length === 0) {
    return (
      <div className="text-center py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center">
          <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h4v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm8 8a1 1 0 01-1-1V8a1 1 0 10-2 0v4a1 1 0 01-1 1H6a1 1 0 100 2h8a1 1 0 100-2h-2z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2">No studies yet</h3>
        <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-3 sm:mb-4 md:mb-5 px-4 md:max-w-md mx-auto">Create your first study session to get started</p>
        <a
          href="/new/study"
          className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 min-h-[44px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm sm:text-base md:text-lg font-medium rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>Create Study</span>
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full max-w-full sm:space-y-4">
      {studies.map((study) => (
        <div
          key={study.id}
          className="group bg-white/5 backdrop-blur-md w-full max-w-full border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02]"
        >
          {/* Mobile Layout */}
          <div className="block sm:hidden space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-white group-hover:text-white/90 transition-colors truncate max-w-[200px]">
                  {study.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  {getSourceIcon(study.source)}
                  <span className="text-xs text-gray-400">{study.source}</span>
                  <div className={`px-2 py-0.5 rounded-md text-xs font-medium border ${getDifficultyColor(study.difficulty)}`}>
                    {study.difficulty}
                  </div>
                </div>
              </div>
              <a
                href={`/study/${study.id}`}
                className="px-3 py-2 min-h-[44px] min-w-[80px] flex items-center justify-center bg-gradient-to-r from-blue-600/80 to-blue-700/80 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-medium rounded-lg transition-all duration-300 hover:scale-105 flex-shrink-0"
              >
                Continue
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/5 rounded-lg p-2 text-center border border-white/10">
                <div className="text-sm font-bold text-cyan-400">{study.flashcardCount}</div>
                <div className="text-xs text-gray-400">Cards</div>
              </div>
              <div className="bg-white/5 rounded-lg p-2 text-center border border-white/10">
                <div className="text-sm font-bold text-purple-400">{study.studyHours}h</div>
                <div className="text-xs text-gray-400">Time</div>
              </div>
              <div className="bg-white/5 rounded-lg p-2 text-center border border-white/10">
                <div className="text-sm font-bold text-green-400">{study.progress}%</div>
                <div className="text-xs text-gray-400">Done</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Progress</span>
                <span className="text-white font-medium">{study.progress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${study.progress}%` }}
                />
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>{formatDate(study.date)}</span>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:block">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 mb-2">
                  <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-white/90 transition-colors">
                    {study.title}
                  </h3>
                  <div className={`px-2 py-1 rounded-lg text-xs md:text-sm font-medium border ${getDifficultyColor(study.difficulty)}`}>
                    {study.difficulty}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    {getSourceIcon(study.source)}
                    <span>{study.source}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>{formatDate(study.date)}</span>
                  </div>
                </div>
              </div>

              <a
                href={`/study/${study.id}`}
                className="px-4 py-2 min-h-[44px] min-w-[100px] flex items-center justify-center bg-gradient-to-r from-blue-600/80 to-blue-700/80 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Continue
              </a>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
              <div className="bg-white/5 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-white/10">
                <div className="text-base sm:text-lg md:text-xl font-bold text-cyan-400">{study.flashcardCount}</div>
                <div className="text-xs sm:text-sm text-gray-400">Flashcards</div>
              </div>
              <div className="bg-white/5 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-white/10">
                <div className="text-base sm:text-lg md:text-xl font-bold text-purple-400">{study.studyHours}h</div>
                <div className="text-xs sm:text-sm text-gray-400">Study Time</div>
              </div>
              <div className="bg-white/5 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-white/10">
                <div className="text-base sm:text-lg md:text-xl font-bold text-green-400">{study.progress}%</div>
                <div className="text-xs sm:text-sm text-gray-400">Progress</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Study Progress</span>
                <span className="text-white font-medium">{study.progress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${study.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* View All Button */}
      {studies.length > 5 && (
        <div className="text-center pt-3 sm:pt-4">
          <button className="text-cyan-400 hover:text-cyan-300 font-medium text-sm transition-colors px-4 py-2 min-h-[44px] inline-flex items-center">
            View All Studies →
          </button>
        </div>
      )}
    </div>
  );
}

export default StudyList;
