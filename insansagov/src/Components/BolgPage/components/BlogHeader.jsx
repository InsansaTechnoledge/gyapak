import React from 'react';

const BlogHeader = () => {
  return (
    <header className="bg-white">
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold text-purple-800 mb-3 relative inline-block">
          <span className="relative z-10">Talks by Gyapak</span>
          <span className="absolute -bottom-2 left-0 w-full h-3 bg-purple-200 transform -rotate-1 rounded z-0"></span>
        </h1>
        <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
        From Public Sectors to Public Awareness — <span className="text-purple-800 font-semibold">gyapak</span> Writes.
        </p>

      </div>
    </header>
  );
};

export default BlogHeader;