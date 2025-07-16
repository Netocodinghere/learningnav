'use client';

export default function StudyList() {
  // Mock data with studyHours added
  const studies = [
    {
      id: 1,
      title: 'Introduction to React',
      source: 'YouTube',
      flashcardCount: 15,
      date: '2024-01-20',
      studyHours: 2.5,
      progress: 75,
      difficulty: 'Intermediate'
    },
    {
      id: 2,
      title: 'JavaScript Fundamentals',
      source: 'Notes',
      flashcardCount: 25,
      date: '2024-01-19',
      studyHours: 4,
      progress: 90,
      difficulty: 'Beginner'
    },
    {
      id: 3,
      title: 'CSS Grid Layout',
      source: 'YouTube',
      flashcardCount: 10,
      date: '2024-01-18',
      studyHours: 1.2,
      progress: 45,
      difficulty: 'Advanced'
    },
  ];

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

  if (studies.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h4v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm8 8a1 1 0 01-1-1V8a1 1 0 10-2 0v4a1 1 0 01-1 1H6a1 1 0 100 2h8a1 1 0 100-2h-2z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-white mb-2">No studies yet</h3>
        <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4 px-4">Create your first study session to get started</p>
        <a
          href="/study"
          className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm sm:text-base font-medium rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>Create Study</span>
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {studies.map((study) => (
        <div
          key={study.id}
          className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02]"
        >
          {/* Mobile Layout */}
          <div className="block sm:hidden space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-white group-hover:text-white/90 transition-colors truncate">
                  {study.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {getSourceIcon(study.source)}
                  <span className="text-xs text-gray-400">{study.source}</span>
                  <div className={`px-2 py-0.5 rounded-md text-xs font-medium border ${getDifficultyColor(study.difficulty)}`}>
                    {study.difficulty}
                  </div>
                </div>
              </div>
              <a
                href={`/study/${study.id}`}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-600/80 to-blue-700/80 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-medium rounded-lg transition-all duration-300 hover:scale-105 flex-shrink-0"
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
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Progress</span>
                <span className="text-white font-medium">{study.progress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${study.progress}%` }}
                />
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
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
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white group-hover:text-white/90 transition-colors">
                    {study.title}
                  </h3>
                  <div className={`px-2 py-1 rounded-lg text-xs font-medium border ${getDifficultyColor(study.difficulty)}`}>
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
                className="px-4 py-2 bg-gradient-to-r from-blue-600/80 to-blue-700/80 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Continue
              </a>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                <div className="text-lg font-bold text-cyan-400">{study.flashcardCount}</div>
                <div className="text-xs text-gray-400">Flashcards</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                <div className="text-lg font-bold text-purple-400">{study.studyHours}h</div>
                <div className="text-xs text-gray-400">Study Time</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                <div className="text-lg font-bold text-green-400">{study.progress}%</div>
                <div className="text-xs text-gray-400">Progress</div>
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
      <div className="text-center pt-3 sm:pt-4">
        <button className="text-cyan-400 hover:text-cyan-300 font-medium text-sm transition-colors">
          View All Studies →
        </button>
      </div>
    </div>
  );
}
