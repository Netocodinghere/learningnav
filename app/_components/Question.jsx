'use client';

import { useState, useEffect } from 'react';

export default function Question({ 
  type = 'mcq',
  question,
  options = [],
  correctAnswer,
  onAnswer,
  className = ''
}) {
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  // Reset isCorrect when question changes
  useEffect(() => {
    setIsCorrect(null);
    setAnswer('');
  }, [question]);

  const handleSubmit = (value) => {
    const options=['A','B','C','D']
    let correct = false;
  
    // Utility for open-ended similarity
    const isSimilarAnswer = (userAnswer, expectedAnswer) => {
      if (!userAnswer || !expectedAnswer) return false;
  
      const normalize = (str) =>
        str.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/);
  
      const userTokens = new Set(normalize(userAnswer));
      const correctTokens = new Set(normalize(expectedAnswer));
  
      const intersection = [...userTokens].filter(token => correctTokens.has(token));
      const similarity = intersection.length / Math.max(correctTokens.size, 1);
  
      return similarity >= 0.5; // tweak threshold if needed
    };
  
    switch (type) {
      case 'multi-choice':
        correct = options[value] === correctAnswer.join('');
        setAnswer(value);
        break;
  
      case'single-choice':
        correct = options[value] === correctAnswer;
        setAnswer(value);
        break;
  
      case 'fill-in-the-blank':
        correct = typeof value === 'string' &&
                  typeof correctAnswer === 'string' &&
                  value.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
        setAnswer(value);
        break;
  
      case 'open-ended':
        if (typeof correctAnswer === 'string') {
          correct = isSimilarAnswer(value, correctAnswer);
        } else {
          // If no correctAnswer provided, mark as unscored (optional logic)
          correct = null;
        }
        setAnswer(value);
        break;
  
      default:
        console.warn('Unknown question type:', type);
    }
  
    setIsCorrect(correct);
    onAnswer && onAnswer(value, correct);
  };
  

  const renderQuestion = () => {
    switch (type) {
      case 'multiple-choice' :
        return (
          <div className="space-y-3">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSubmit(index)}
                className={`w-full text-left p-4 rounded-lg transition-all duration-200
                  ${answer === index
                    ? isCorrect
                      ? 'bg-green-500/20 text-green-200'
                      : 'bg-red-500/20 text-red-200'
                    : 'bg-white/10 hover:bg-white/20 text-white'}
                `}
              >
                <span className="font-medium">{String.fromCharCode(65 + index)}. </span>
                {option}
              </button>
            ))}
          </div>
        );

      case 'single-choice':
        return (
          <div className="space-y-3">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSubmit(index)}
                className={`w-full text-left p-4 rounded-lg transition-all duration-200
                  ${answer === index
                    ? isCorrect
                      ? 'bg-green-500/20 text-green-200'
                      : 'bg-red-500/20 text-red-200'
                    : 'bg-white/10 hover:bg-white/20 text-white'}
                `}
              >
                <span className="font-medium">{String.fromCharCode(65 + index)}. </span>
                {option}
              </button>
            ))}
          </div>
        );

      case 'open-ended':
        return (
          <div className="space-y-4">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full h-32 bg-white/10 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your answer here..."
            />
            <button
              onClick={() => handleSubmit(answer)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Submit Answer
            </button>
          </div>
        );

      case 'fill-in-the-blank':
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full bg-white/10 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Fill in your answer..."
            />
            <button
              onClick={() => handleSubmit(answer)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Submit Answer
            </button>
          </div>
        );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-xl font-semibold text-white mb-4">{question}</h2>
      {renderQuestion()}
      {isCorrect !== null && (
        <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
          {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
        </div>
      )}
    </div>
  );
}