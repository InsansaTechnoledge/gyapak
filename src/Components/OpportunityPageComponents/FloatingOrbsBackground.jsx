import React from 'react';

const FloatingOrbsBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-purple-400 opacity-20 blur-3xl"></div>
      <div className="absolute top-32 right-12 w-96 h-96 rounded-full bg-purple-400 opacity-15 blur-3xl"></div>
      <div className="absolute bottom-16 left-1/4 w-80 h-80 rounded-full bg-purple-300 opacity-10 blur-3xl"></div>
      <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-purple-300 opacity-25 blur-3xl transform -translate-y-1/2"></div>
    </div>
  );
};

export default FloatingOrbsBackground;
