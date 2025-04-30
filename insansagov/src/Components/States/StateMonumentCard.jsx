import React from 'react'
import { useNavigate } from 'react-router-dom'

const StateMonumentCard = ({state, region, img}) => {
    const navigate = useNavigate();
  
    return (
    <div 
    onClick={()=>navigate(`/state/government-jobs-in-${state}-for-12th-pass`)}
    className='bg-white shadow-lg border-purple-300 border-2 p-3 rounded-md hover:scale-[1.02] transition-all duration-200'>
        <div className='rounded-md overflow-hidden'>
            <img 
            className='w-full object-cover h-40'
            src={img}
            alt={`upcoming government exams 2025 for ${state}`}
            />
        </div>
        <div className='mt-5 mb-5'>
            <h2 className='font-bold text-lg'>{state}</h2>
            <div
            className='w-min text-sm mt-2 rounded-full border font-semibold bg-purple-200 border-purple-700 text-purple-900 h-min py-1 px-5'
            >{region}</div>
        </div>
    </div>
  )
}

export default StateMonumentCard