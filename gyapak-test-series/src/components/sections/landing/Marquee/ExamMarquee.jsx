import { Star } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'
import { usePricing } from '../../../../hooks/usePricing';

const ExamMarquee = () => {
   const {
    exams
  } = usePricing();
  
  const marqueeRef = useRef(null);
  const contentRef = useRef(null);
  
  useEffect(() => {
    // Clone the content for seamless looping
    if (contentRef.current && marqueeRef.current) {
      const clone = contentRef.current.cloneNode(true);
      marqueeRef.current.appendChild(clone);
    }
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg">
      {/* Glowing edge effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-30 blur-sm"></div>
      
      {/* Marquee container */}
      <div className="relative overflow-hidden py-3 px-2">
        <div 
          ref={marqueeRef}
          className="flex whitespace-nowrap animate-marquee"
          style={{
            animation: 'scroll 30s linear infinite',
          }}
        >
          {/* First set of items */}
          <div ref={contentRef} className="flex space-x-16">
            { exams && exams.map((exam, idx) => (
              <div key={idx} className="flex items-center gap-2 px-2">
                <Star className="w-5 h-5 text-yellow-300" />
                <span className="text-lg font-medium text-white">{exam.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Gradient fade effect on edges */}
      <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-indigo-600 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-purple-600 to-transparent pointer-events-none"></div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: scroll 30s linear infinite;
        } 
      `}</style>
    </div>
  );
};

export default ExamMarquee;