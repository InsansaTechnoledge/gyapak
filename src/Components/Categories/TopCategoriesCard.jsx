import React from 'react'
import { useNavigate } from 'react-router-dom'

const TopCategoriesCard = (props) => {
  const navigate = useNavigate();
  return (
    <div 
    onClick={()=>navigate(`/category?name=${encodeURI(props.name)}`)}
    className='flex flex-col justify-center hover:cursor-pointer hover:scale-110 transition-all duration-300'>
        <div className='flex justify-center'>
            <img
          className='xl:w-20 w-10'
            src={`data:image/png;base64,${props.logo}`}
            alt="Category Logo"/>

        </div>
        <p className='flex justify-center mt-4 text-gray-900 text-sm font-medium'>{props.name}</p>
    </div>
  )
}

export default TopCategoriesCard