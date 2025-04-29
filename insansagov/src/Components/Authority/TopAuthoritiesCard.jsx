import React from 'react';
import { useNavigate } from 'react-router-dom';

const TopAuthoritiesCard = (props) => {
  const navigate = useNavigate();

  

  return (
    <div 
    onClick={()=>navigate(`/organization/government-competitive-exams-after-12th/${encodeURI(props.name)}`)}
    className="flex flex-col items-center justify-center bg-white rounded-lg p-6 max-w-sm mx-auto hover:scale-110 transition-all duration-300 hover:cursor-pointer">
      {/* Logo */}
      <img
        className='xl:w-20 w-10'
        src={`data:image/png;base64,${props.logo}`}
        alt="Authority Logo"
        // width={60}
      />

     
      <p className="mt-2 text-gray-900 font-medium text-sm">{props.name}</p>
    </div>
  );
};

export default TopAuthoritiesCard;
