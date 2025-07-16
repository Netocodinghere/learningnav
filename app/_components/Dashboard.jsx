'use client';

import { useState } from 'react';
import Link from 'next/link';
import StudyList from './StudyList';

// Metric Card Component
function MetricCard({ title, value, icon, path, gradient }) {
  return (
    <Link href={path} className="block group">
      <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} shadow-xl backdrop-blur-sm p-6 rounded-2xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-white/10`}>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
              <span className="text-2xl">{icon}</span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-white block">{value}</span>
              <span className="text-xs text-white/70 uppercase tracking-wide">Total</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white/90 group-hover:text-white transition-colors">{title}</h3>
        </div>
      </div>
    </Link>
  );
}

// Action Button Component
function ActionButton({ title, description, icon, onClick, primary = false }) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden p-6 rounded-2xl text-left transition-all duration-300 w-full border ${
        primary 
          ? 'bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-blue-500/30 shadow-lg hover:shadow-xl' 
          : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
      } backdrop-blur-sm`}
    >
      <div className="relative z-10">
        <div className={`inline-flex p-3 rounded-xl mb-3 ${primary ? 'bg-white/20' : 'bg-white/10'} group-hover:scale-110 transition-transform`}>
          <span className="text-xl">{icon}</span>
        </div>
        <h3 className={`text-lg font-semibold mb-2 ${primary ? 'text-white' : 'text-white'}`}>{title}</h3>
        <p className={`text-sm ${primary ? 'text-blue-100' : 'text-gray-300'}`}>{description}</p>
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
    </button>
  );
}

export default function Dashboard({profile}) {
  const userData = {
    metrics: {
      studiesCreated: profile?.studies || 0,
      quizzesTaken: profile?.quizzes || 0,
      flashcardsGenerated: profile?.flashcards || 0,
      cheatsheetsCreated: profile?.cheatsheets || 0
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
    <div className="min-h-screen  w-full p-6 pt-2 bg-transparent">
      <div className="max-w-full mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back! 👋
              </h1>
              <p className="text-gray-300">Ready to continue your learning journey?</p>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <MetricCard 
              key={metric.title} 
              title={metric.title} 
              icon={metric.icon} 
              gradient={metric.gradient} 
              value={metric.value} 
              path={metric.path} 
            />
          ))}
        </div>

        {/* Quick Actions Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
            <span className="text-sm text-gray-400">Choose what you'd like to do next</span>
          </div>
          
          <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-6">
            <ActionButton
              title="Create New Study"
              description="Start a new study session with AI-powered assistance"
              icon="📚"
              primary={true}
              onClick={() => window !== "undefined" ? window.location.href = "/study" : ""}
            />
            <ActionButton
              title="Take a Quiz"
              description={`You've completed ${userData.metrics.quizzesTaken} quizzes so far`}
              icon="✍️"
              onClick={() => window !== "undefined" ? window.location.href = "/new/quiz" : ""}
            />
            <ActionButton
              title="Make a Cheatsheet"
              description="Create a quick reference guide for your studies"
              icon="📝"
              onClick={() => console.log('Cheatsheet clicked')}
            />
          </div>
        </div>

        {/* Recent Studies Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Recent Studies</h2>
            <button 
              onClick={() => setShowStudyList(!showStudyList)}
              className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
            >
              {showStudyList ? 'Hide' : 'View All'}
            </button>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6">
            <StudyList />
          </div>
        </div>
      </div>
    </div>
  );
}
