import { useState } from 'react';

export default function Flashcard({ question, answer }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="w-full max-w-sm h-60 mx-auto cursor-pointer perspective"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style ${flipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front Side */}
        <div className="absolute w-full h-full rounded-xl bg-cyan-600 text-white flex items-center justify-center p-4 shadow-lg backface-hidden">
          <h3 className="text-lg font-semibold text-center">{question}</h3>
        </div>

        {/* Back Side */}
        <div className="absolute w-full h-full rounded-xl bg-white text-gray-900 flex items-center justify-center p-4 shadow-lg rotate-y-180 backface-hidden">
          <p className="text-base text-center">{answer}</p>
        </div>
      </div>
    </div>
  );
}
