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
    },
    {
      id: 2,
      title: 'JavaScript Fundamentals',
      source: 'Notes',
      flashcardCount: 25,
      date: '2024-01-19',
      studyHours: 4,
    },
    {
      id: 3,
      title: 'CSS Grid Layout',
      source: 'YouTube',
      flashcardCount: 10,
      date: '2024-01-18',
      studyHours: 1.2,
    },
  ];

  return (<div className="space-y-4">
    {studies.map((study) => (
      <div
        key={study.id}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-gray-200 rounded-lg bg-white/5 backdrop-blur transition-colors w-full"
      >
        <div className="flex-1 w-full">
          <h3 className="text-base sm:text-lg font-semibold text-white break-words">{study.title}</h3>
          <div className="flex flex-wrap items-start gap-2 mt-1 text-sm text-gray-200">
            <span>Source: {study.source}</span>
            <span>Created: {study.date}</span>
            <span>Study Hours: {study.studyHours}h</span>
          </div>
        </div>
  
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="text-sm text-gray-200 text-left sm:text-right">
            <span className="font-semibold">{study.flashcardCount}</span> flashcards
          </div>
          <a
           href={`/study/${study.id}`}
            className="w-full sm:w-auto px-4 py-2 text-sm text-blue-700 bg-white/90 hover:bg-white text-black rounded-md transition-colors"
          >
            View Study
          </a>
        </div>
      </div>
    ))}
  </div>
  
  );
}
