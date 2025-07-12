'use client';

import { useState } from 'react';
import Link from 'next/link';
import StudyList from './StudyList';

// Metric Card Component
function MetricCard({ title, value, icon, path, gradient }) {
  return (
    <Link href={path} className="block group">
      <div className={`bg-gradient-to-br ${gradient} shadow-lg backdrop-blur p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
        <div className="flex items-center justify-between">
          <span className="text-3xl group-hover:scale-110 transition-transform">{icon}</span>
          <span className="text-4xl font-bold text-white group-hover:text-white/90">{value}</span>
        </div>
        <h3 className="mt-3 text-lg font-semibold text-white/90 group-hover:text-white">{title}</h3>
      </div>
    </Link>
  );
}

// Action Button Component
function ActionButton({ title, description, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white/5 backdrop-blur p-6 rounded-lg text-left transition-all hover:bg-white/10 w-full"
    >
      <span className="text-2xl mb-2 block">{icon}</span>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-gray-300 mt-1">{description}</p>
    </button>
  );
}

export default function Dashboard() {
  // Mock user data - this would come from your authentication system
  const userData = {
  metrics: {
      studiesCreated: 15,
      quizzesTaken: 8,
      flashcardsGenerated: 120,
      cheatsheetsCreated: 5
    }
  };
  const metrics = [
    {
      title: "Studies Created",
      value: userData.metrics.studiesCreated,
      icon: "📚",
      path: "/study",
      gradient: "from-blue-500 to-cyan-400"
    },
    {
      title: "Quizzes Taken",
      value: userData.metrics.quizzesTaken,
      icon: "✍️",
      path: "#",
      gradient: "from-purple-500 to-pink-400"
    },
    {
      title: "Flashcards",
      value: userData.metrics.flashcardsGenerated,
      icon: "🎴",
      path: "/flashcards",
      gradient: "from-orange-500 to-amber-400"
    },
    {
      title: "Cheatsheets",
      value: userData.metrics.cheatsheetsCreated,
      icon: "📝",
      path: "/cheatsheets",
      gradient: "from-green-500 to-emerald-400"
    }
  ];

  const [showStudyList, setShowStudyList] = useState(false);

  return (
    <div className="p-6 pt-36 h-screen overflow-y-auto bg-transparent space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between bg-white/5 backdrop-blur p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-white">
          Welcome back {userData?.name??''}! 👋
        </h1>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
       {metrics.map((metric)=>{ 
        return (<MetricCard key={metric.title} title={metric.title} icon={metric.icon} gradient={metric.gradient} value={metric.value} path={metric.path} />)
    })}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ActionButton
          title="Create New Study"
          description="Start a new study session with AI-powered assistance"
          icon="📚"
          onClick={() => setShowStudyList(!showStudyList)}
        />
        <ActionButton
          title="Take a Quiz"
          description={`You've completed ${userData.metrics.quizzesTaken} quizzes`}
          icon="✍️"
          onClick={() => window != "undefined"? window.location.href="/new/quiz":""}
        />
        <ActionButton
          title="Make a Cheatsheet"
          description="Create a quick reference guide for your studies"
          icon="📝"
          onClick={() => console.log('Cheatsheet clicked')}
        />
     

      {/* Study List Section */}
      {showStudyList && (
        <div className="mt-6">
          <StudyList />
        </div>
      )}
      </div>
    </div>
  );
}
