import React from 'react';
import { ChevronRight, Star, Users, BookOpen, TrendingUp } from 'lucide-react';

const HeroHeading = () => {
  return (
    <div className="relative max-w-5xl mx-auto py-20 px-6 overflow-hidden">
      
      <div className="relative space-y-8 text-center md:text-left">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 text-sm font-medium border border-purple-200 shadow-sm hover:shadow-md transition-all duration-300">
          <span className="flex items-center">
            {/* <Star className="w-4 h-4 mr-1.5 text-purple-600" /> */}
            Frequently Updated
            <ChevronRight className="w-4 h-4 ml-1 animate-bounce" />
          </span>
        </div>
        
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 bg-clip-text text-transparent pb-2 mb-2">
            Gyapak Test Series
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto md:mx-0 mb-6"></div>
        </div>
        
        <h2 className="text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed">
          Comprehensive exam preparation resources to help you excel in your academic pursuits. 
          Join thousands of students who have achieved their goals with our effective study methods.
        </h2>
    
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* <div className="flex items-center justify-center md:justify-start space-x-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span className="text-gray-700 font-medium">10,000+ Students</span>
          </div> */}
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <span className="text-gray-700 font-medium">250+ Test Papers</span>
          </div>
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <TrendingUp className="w-5 h-5 text-pink-600" />
            <span className="text-gray-700 font-medium">Epic Success Rate</span>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default HeroHeading;