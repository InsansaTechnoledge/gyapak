import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight } from 'lucide-react';

const StateCard = ({ state, region, img }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/state/government-jobs-in-${state}-for-12th-pass`)}
      className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl bg-white hover:scale-105 cursor-pointer"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-50 z-10"></div>

      {/* Background image */}
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img 
          src={img || "/api/placeholder/400/320"} 
          alt={`${state} state`} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <div className="flex items-center mb-1">
          <MapPin size={16} className="text-purple-300 mr-1" />
          <span className="text-xs font-medium text-purple-200">{region} Region</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{state}</h3>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-300">Explore opportunities</span>
          <button 
            className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors duration-300"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StateCard;
