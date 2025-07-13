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
    setAnswers(prev => [
      ...prev,
      {
        id: currentQ.id,
        question: currentQ.question,
        userAnswer: answer,
        correctAnswer: currentQ.correctAnswer,
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
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6 text-white">
        <h2 className="text-2xl font-bold">Quiz Completed!</h2>
        <p className="text-lg">You scored {score} out of {questions.length}</p>

        <div className="space-y-4 mt-4">
          {answers.map((ans, idx) => (
            <div key={idx} className="p-4 rounded-md bg-white/5 border border-white/10">
              <p className="font-semibold">{idx + 1}. {ans.question}</p>
              <p>
                <span className="text-gray-300">Your answer:</span>{' '}
                <span className={ans.isCorrect ? 'text-green-400' : 'text-red-400'}>
                  {String(ans.userAnswer)}
                </span>
              </p>
              {!ans.isCorrect && (
                <p className="text-sm text-gray-300">
                  Correct answer: {String(ans.correctAnswer)}
                </p>
              )}
            </div>
          ))}
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
          correctAnswer={currentQuestion.correctAnswer}
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
