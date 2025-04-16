import React, { useState } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="bg-gradient-to-br from-purple-900 to-purple-900 text-white overflow-hidden relative">
    
      <div className="max-w-6xl mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 transform transition-all duration-500 hover:scale-105">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 animate-fadeIn">
              Partner With Us For Educational Excellence
            </h1>
            <p className="text-xl mb-8 text-purple-100">
              Join our platform to transform how your institution delivers assessments and manages student progress.
            </p>
            <div 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="inline-block"
            >
              <a 
                href="#registration-form" 
                className="group bg-white text-purple-700 font-semibold py-3 px-8 rounded-lg hover:bg-purple-50 transition-all shadow-lg flex items-center space-x-2"
              >
                <span>Register Now</span>
                <ChevronRight 
                  className={`transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`} 
                  size={20} 
                />
                <Sparkles 
                  className={`transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} 
                  size={20} 
                />
              </a>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-10 transform transition-all duration-700 hover:scale-105 hover:rotate-1">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-purple-300 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <img 
                src="/api/placeholder/600/400" 
                alt="Institute partnership illustration" 
                className="rounded-lg shadow-xl relative"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;