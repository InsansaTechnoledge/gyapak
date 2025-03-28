import React from 'react';
import { ArrowRight } from 'lucide-react';

const QuickApplyButton = ({ handleEventDataChange, eventData }) => {

  return (
    <div className="text-center mb-10">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 opacity-90 rounded-lg w-fit mx-auto">
      <div className="relative px-6 py-4 flex items-center gap-4">
        <input 
        type='text' 
        name='apply_link' 
        onChange={(e) => handleEventDataChange(e)} 
        value={eventData?.apply_link} 
        className='border-2 rounded-md border-white text-white font-bold text-xl py-4 px-2'
        placeholder='Apply Link here'
        />
        
      </div>
      </div>
    </div>
  );
};

export default QuickApplyButton;
