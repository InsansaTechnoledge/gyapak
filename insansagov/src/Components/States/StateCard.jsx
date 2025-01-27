import React from 'react'
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

const StateCard = ({ state }) => {

    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`state?name=${encodeURI(state)}`)}
            className="group bg-white p-3 sm:p-4 rounded-xl border border-purple-100 hover:border-purple-400 
             shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer relative
             overflow-hidden active:bg-purple-50 touch-manipulation"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-purple-500" />
                    <p className="text-xs sm:text-sm font-medium text-gray-700">{state}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-purple-400 transform translate-x-2 opacity-0 
                           group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 
                   to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </div>
    )
};

export default StateCard