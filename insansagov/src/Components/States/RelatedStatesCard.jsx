import React from 'react'
import { useNavigate } from 'react-router-dom';

const RelatedStatesCard = (props) => {
    const navigate = useNavigate();
    return (
      <div 
      onClick={()=>navigate(`/state/government-jobs-in-${props.name}-for-12th-pass`)}
      className='flex flex-col justify-center hover:cursor-pointer hover:scale-110 transition-all duration-300'>
          <div className='flex justify-center'>
              <img
            className='w-32 h-28 object-contain'
              src={`data:image/png;base64,${props.logo}`}
              alt="Category Logo"/>
  
          </div>
          <p className='flex justify-center mt-4 text-gray-900 text-sm font-medium'>{props.name}</p>
      </div>
    )
}

export default RelatedStatesCard