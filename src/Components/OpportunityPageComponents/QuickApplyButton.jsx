import React from 'react';
import { ArrowRight } from 'lucide-react';

const QuickApplyButton = ({ data }) => {
  if (!data.apply_link){
    return null
  }

  return (
    <div className="text-center mb-20">
      <a
        href={typeof(data.apply_link)=='string' ? data.apply_link || "/not-found" : data.apply_link[0]}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block group relative overflow-hidden rounded-2xl shadow-lg"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800 opacity-90 transition-transform transform group-hover:scale-110"></div>
        <div className="relative px-12 py-6 flex items-center gap-4">
          <span className="text-2xl font-bold text-white group-hover:text-gray-300 group-hover:scale-110 transition-all">
            {
            data.event_type==='Exam'
            ?
            "Apply Now"
            :
            data.event_type==='Result'
            ?
            "View Result"
            :
            "visit Link"
          }
          </span>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/40 group-hover:scale-110 transition-transform">
            <ArrowRight className="w-6 h-6 text-white group-hover:text-gray-100" />
          </div>
        </div>
      </a>
    </div>
  );
};

export default QuickApplyButton;
