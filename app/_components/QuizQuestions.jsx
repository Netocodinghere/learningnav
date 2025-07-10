

'use client';

import { useState } from 'react';
import Question from './Question';

export default function QuizQuestions() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('right');

  // Mock quiz data with different question types
  const quiz = {
    title: "Introduction to React Fundamentals",
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: "What is React?",
        options: [
          "A JavaScript library for building user interfaces",
          "A programming language",
          "A database management system",
          "A web server"
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        type: 'fill-in-blank',
        question: "Complete this statement: React was created by _______.",
        correctAnswer: "Facebook"
      },
      {
        id: 3,
        type: 'open-ended',
        question: "Explain what a React component is and why it's useful.",
        correctAnswer: null // Open-ended questions don't have specific correct answers
      },
      {
        id: 4,
        type: 'mcq',
        question: "What is JSX?",
        options: [
          "A JavaScript XML parser",
          "A syntax extension for JavaScript",
          "A new programming language",
          "A React component"
        ],
        correctAnswer: 1
      }
    ]
  };

  const handleAnswerSubmit = (answer, isCorrect) => {
    setSlideDirection('left');
    
    // Simulate a brief delay for the sliding animation
    setTimeout(() => {
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSlideDirection('right');
      }
    }, 300);
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Quiz Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
        <p className="text-gray-300">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </p>
      </div>

      {/* Question Card */}
      <div
        className={`bg-white/5 backdrop-blur p-6 rounded-lg shadow-lg
          transform transition-all duration-300 ease-in-out
          ${slideDirection === 'left' ? '-translate-x-full opacity-0' : 
            slideDirection === 'right' ? 'translate-x-0 opacity-100' : ''}`}
      >
        <Question
          type={currentQuestion.type}
          question={currentQuestion.question}
          options={currentQuestion.options}
          correctAnswer={currentQuestion.correctAnswer}
          onAnswer={handleAnswerSubmit}
        />
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/10 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{
            width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`
          }}
        />
      </div>
    </div>
  );
}