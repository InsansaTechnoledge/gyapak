import React from 'react';
import { ArrowRight, Calendar, Clock, Users, Book , Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExamCard = ({ exam }) => {
  const navigate = useNavigate();
  
  const { id, title, description, events = [], institute = {} , validity } = exam;
  
  const handleViewExam = () => {
    navigate(id);
  };
  
  return (
    <div className="group relative flex flex-col h-full rounded-lg border border-purple-300 bg-white p-6 shadow-sm transition-all duration-300 hover:border-purple-500 hover:shadow-md">
      {/* Institute name */}
      <div className="absolute -right-2 -top-2 rounded-md border border-gray-200 bg-white p-2 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="text-center text-xs font-medium text-gray-700">
          <Building className="mr-2 h-4 w-4 text-purple-600" />
          {institute.name}
        </div>
      </div>
      
      {/* Card Header */}
      <div className="mb-4">
        
        <div className="flex items-center justify-center rounded-md bg-purple-50 p-4">
          <h2 className="font-medium text-xl text-gray-800">{title}</h2>
        </div>
      </div>
      
      {/* Stats Row */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center rounded-md bg-purple-50 px-3 py-2">
          <Book className="mr-2 h-4 w-4 text-purple-600" />
          <span className="font-medium text-gray-700">{events.length}+ Tests</span>
        </div>
        
        <div className="flex items-center rounded-md bg-purple-50 px-3 py-2">
          <Calendar className="mr-2 h-4 w-4 text-purple-600" />
          <span className="font-medium text-gray-700">{validity}</span>
        </div>
      </div>
      
      {/* Animated Description */}
      <div className="mt-0 max-h-0 rounded-md bg-gray-50 text-sm text-gray-600 opacity-0 transition-all duration-300 ease-in-out overflow-hidden group-hover:mt-2 group-hover:max-h-40 group-hover:opacity-100 group-hover:p-4">
        <p className="leading-relaxed">{description}</p>
      </div>
      
      {/* Card Footer */}
      <div className="mt-auto pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">
            {Math.floor(Math.random() * 200) + 50} Enrolled
          </span>
        </div>
        
        <button
          onClick={handleViewExam}
          className="flex items-center rounded-md bg-purple-600 px-0 py-0 text-white opacity-0 transition-all duration-300 ease-in-out hover:bg-purple-700 group-hover:px-4 group-hover:py-2 group-hover:opacity-100"
        >
          <span className="font-medium">View Exam</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ExamCard;