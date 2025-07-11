import React from 'react';

const Loader = ({ type = 'spinner', size = 'md', color = 'blue' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'border-blue-500',
    white: 'border-white',
    gray: 'border-gray-500',
    green: 'border-green-500',
    red: 'border-red-500'
  };

  const renderSpinner = () => (
    <div className={`${sizeClasses[size]} border-4 border-t-transparent ${colorClasses[color]} rounded-full animate-spin`}></div>
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizeClasses[size]} ${colorClasses[color].replace('border-', 'bg-')} rounded-full animate-pulse`}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s'
          }}
        ></div>
      ))}
    </div>
  );

  const renderBars = () => (
    <div className="flex items-end space-x-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`w-1 ${colorClasses[color].replace('border-', 'bg-')} rounded animate-pulse`}
          style={{
            height: `${12 + (i % 3) * 8}px`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.8s'
          }}
        ></div>
      ))}
    </div>
  );

  const renderPulse = () => (
    <div className={`${sizeClasses[size]} ${colorClasses[color].replace('border-', 'bg-')} rounded-full animate-ping`}></div>
  );

  const renderRipple = () => (
    <div className="relative">
      <div className={`${sizeClasses[size]} ${colorClasses[color].replace('border-', 'bg-')} rounded-full animate-ping absolute`}></div>
      <div className={`${sizeClasses[size]} ${colorClasses[color].replace('border-', 'bg-')} rounded-full animate-ping absolute`} style={{ animationDelay: '0.5s' }}></div>
      <div className={`${sizeClasses[size]} ${colorClasses[color].replace('border-', 'bg-')} rounded-full`}></div>
    </div>
  );

  const renderSquares = () => (
    <div className="grid grid-cols-3 gap-1">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={i}
          className={`w-2 h-2 ${colorClasses[color].replace('border-', 'bg-')} animate-pulse`}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1.2s'
          }}
        ></div>
      ))}
    </div>
  );

  const loaderTypes = {
    spinner: renderSpinner,
    dots: renderDots,
    bars: renderBars,
    pulse: renderPulse,
    ripple: renderRipple,
    squares: renderSquares
  };

  return (
    <div className="flex items-center justify-center">
      {loaderTypes[type] ? loaderTypes[type]() : renderSpinner()}
    </div>
  );
};

// Full-screen overlay loader component
export const FullScreenLoader = ({ message = 'Loading...', type = 'spinner', color = 'blue' }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white/10 backdrop-blur p-8 rounded-lg shadow-lg text-center">
      <Loader type={type} size="lg" color={color} />
      <p className="text-white mt-4 text-lg">{message}</p>
    </div>
  </div>
);

// Inline loader with text
export const InlineLoader = ({ message = 'Loading...', type = 'spinner', size = 'sm', color = 'blue' }) => (
  <div className="flex items-center space-x-2">
    <Loader type={type} size={size} color={color} />
    <span className="text-gray-600">{message}</span>
  </div>
);

export default Loader;