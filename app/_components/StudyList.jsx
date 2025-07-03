'use client';

export default function StudyList() {
  // Mock data for demonstration - replace with actual data fetching
  const studies = [
    { id: 1, title: 'Introduction to React', source: 'YouTube', flashcardCount: 15, date: '2024-01-20' },
    { id: 2, title: 'JavaScript Fundamentals', source: 'Notes', flashcardCount: 25, date: '2024-01-19' },
    { id: 3, title: 'CSS Grid Layout', source: 'YouTube', flashcardCount: 10, date: '2024-01-18' },
  ];

  return (
    <div className="space-y-4">
      {studies.map((study) => (
        <div
          key={study.id}
          className="flex items-center lg:flex-row flex-col justify-between p-4 border border-gray-200 rounded-lg transition-colors"
        >
          <div className="flex-1">
            <h3 className="text-lg text-white font-medium text-gray-900">{study.title}</h3>
            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-200">
              <span>Source: {study.source}</span>
              <span>Created: {study.date}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-200">
              <span className="font-semibold">{study.flashcardCount}</span> flashcards
            </div>
            <button
              onClick={() => console.log(`View study ${study.id}`)}
              className="px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
            >
              View Study
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}