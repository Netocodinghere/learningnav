'use client';

import { useState } from 'react';
import Question from './Question';

export default function QuizQuestions({ questions, title }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('right');
  const [answers, setAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleAnswerSubmit = (answer, isCorrect) => {
    setSlideDirection('left');

    // Store the current answer
    const currentQ = questions[currentQuestionIndex];
    const options=['A','B','C','D']
    const value=currentQ.type=="single-choice" || currentQ.type=="multiple-choice" ? options[answer]:''
    setAnswers(prev => [
      ...prev,
      {
        id: currentQ.id,
        question: currentQ.question,
        options: currentQ.options, // Assuming options are part of the question object
        userAnswer: currentQ.type=="single-choice" || currentQ.type=="multiple-choice" ? value:answer,
        correctAnswer: currentQ.answer,
        isCorrect: isCorrect
      }
    ]);

    // Proceed or finish quiz
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSlideDirection('right');
      } else {
        setQuizFinished(true);
      }
    }, 300);
  };

  const score = answers.filter(ans => ans.isCorrect).length;

  if (quizFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const getScoreColor = () => {
      if (percentage >= 80) return 'from-green-500 to-emerald-400';
      if (percentage >= 60) return 'from-yellow-500 to-orange-400';
      return 'from-red-500 to-pink-400';
    };
    
    const getScoreMessage = () => {
      if (percentage >= 90) return { emoji: '🎉', message: 'Outstanding! Perfect performance!' };
      if (percentage >= 80) return { emoji: '🌟', message: 'Excellent work! Great job!' };
      if (percentage >= 70) return { emoji: '👍', message: 'Good job! Well done!' };
      if (percentage >= 60) return { emoji: '👌', message: 'Not bad! Keep practicing!' };
      return { emoji: '💪', message: 'Keep studying! You\'ll improve!' };
    };

    const scoreMessage = getScoreMessage();

    return (
      <div className="min-h-screen p-6 pt-24 bg-transparent">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Results Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex p-4 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-2xl backdrop-blur-sm border border-white/10">
              <svg className="w-8 h-8 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white">Quiz Complete!</h1>
            <p className="text-xl text-gray-300">{scoreMessage.emoji} {scoreMessage.message}</p>
          </div>

          {/* Score Summary */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Score */}
              <div className="md:col-span-1 text-center">
                <div className={`relative w-32 h-32 mx-auto mb-4 bg-gradient-to-r ${getScoreColor()} rounded-full flex items-center justify-center shadow-xl`}>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{percentage}%</div>
                    <div className="text-sm text-white/80">Score</div>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{score} / {questions.length}</p>
                <p className="text-gray-400">Questions Correct</p>
              </div>

              {/* Stats */}
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
                  <div className="text-2xl font-bold text-green-400">{score}</div>
                  <div className="text-sm text-gray-400">Correct</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
                  <div className="text-2xl font-bold text-red-400">{questions.length - score}</div>
                  <div className="text-sm text-gray-400">Incorrect</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
                  <div className="text-2xl font-bold text-blue-400">{questions.length}</div>
                  <div className="text-sm text-gray-400">Total Questions</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
                  <div className="text-2xl font-bold text-purple-400">{Math.round(questions.length * 0.5)}min</div>
                  <div className="text-sm text-gray-400">Est. Time</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Take Quiz Again
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-8 py-4 border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium rounded-2xl backdrop-blur-sm transition-all duration-300"
            >
              Create New Quiz
            </button>
          </div>

          {/* Detailed Results */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Detailed Results</h2>
              <span className="text-sm text-gray-400">{answers.length} questions reviewed</span>
            </div>

            <div className="space-y-4">
              {answers.map((ans, idx) => (
                <div
                  key={idx}
                  className={`bg-white/5 backdrop-blur-md border rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 ${
                    ans.isCorrect ? 'border-green-500/30' : 'border-red-500/30'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        ans.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ans.isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {ans.isCorrect ? 'Correct' : 'Incorrect'}
                      </div>
                    </div>
                    <div className={`p-2 rounded-full ${
                      ans.isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {ans.isCorrect ? (
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Question Text */}
                  <h3 className="text-lg font-semibold text-white mb-4">{ans.question}</h3>

                  {/* Options or Answer */}
                  {Array.isArray(ans.options) ? (
                    <div className="space-y-2 mb-4">
                      {ans.options.map((opt, i) => {
                        const isCorrect = i === ans.correctAnswer;
                        const isUserAnswer = ans.userAnswer === ['A','B','C','D'][i];
                        
                        let optionClass = "p-3 rounded-xl border transition-all duration-200";
                        if (isCorrect && isUserAnswer) {
                          optionClass += " bg-green-500/20 border-green-500/50 text-green-300";
                        } else if (isCorrect) {
                          optionClass += " bg-green-500/10 border-green-500/30 text-green-400";
                        } else if (isUserAnswer) {
                          optionClass += " bg-red-500/20 border-red-500/50 text-red-300";
                        } else {
                          optionClass += " bg-white/5 border-white/10 text-gray-300";
                        }

                        return (
                          <div key={i} className={optionClass}>
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium">
                                  {['A','B','C','D'][i]}
                                </span>
                                {opt}
                              </span>
                              {isCorrect && (
                                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                              {isUserAnswer && !isCorrect && (
                                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-3 mb-4">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-400">Your Answer:</span>
                          <span className={`font-medium ${ans.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                            {String(ans.userAnswer)}
                          </span>
                        </div>
                        {!ans.isCorrect && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">Correct Answer:</span>
                            <span className="font-medium text-green-400">{String(ans.correctAnswer)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Quiz Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="text-gray-300">
          Question {currentQuestionIndex + 1} of {questions.length}
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
          correctAnswer={currentQuestion.answer}
          onAnswer={handleAnswerSubmit}
        />
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/10 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{
            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
          }}
        />
      </div>
    </div>
  );
}
