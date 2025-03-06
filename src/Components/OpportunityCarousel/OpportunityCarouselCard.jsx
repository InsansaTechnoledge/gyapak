import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Clock } from 'lucide-react';


const OpportunityCarouselCard = (props) => {
  const navigate = useNavigate();
  return (
    <div className='w-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100'>
      <div className='p-4 flex flex-col h-full'>
        <div className='flex-1'>
          <h3 className='text-lg font-semibold text-gray-800 mb-2 line-clamp-2'>
            {props.item?.name || 'No Name Available'}
          </h3>
          <div className='flex items-center text-gray-600 mb-4'>
            <Building2 className='w-4 h-4 mr-2' />
            <span className='text-sm'>{props.authority}</span>
          </div>
        </div>

        <div className='mt-4 pt-4 border-t border-gray-100'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center text-gray-500'>
              <Clock className='w-4 h-4 mr-2' />
              <span className='text-sm'>
                Updated: {props.item?.date_of_notification || 'N/A'}
              </span>
            </div>
            <button onClick= {()=> navigate(`/opportunity?id=${encodeURI(props.item._id)}`)} className='bg-purple-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors'>
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCarouselCard;
