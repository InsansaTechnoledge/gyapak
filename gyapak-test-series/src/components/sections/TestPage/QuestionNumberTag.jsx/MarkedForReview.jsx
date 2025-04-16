import React from 'react'

const MarkedForReview = ({number, noText}) => {
    return (
        <div className='flex space-x-2'>
            <span className='border-black border-2 bg-violet-400 text-white rounded-t-full py-2 px-3 font-bold'>{number.toString().padStart(2,"0")}</span>
            {
                !noText
                &&
                <span className='my-auto'>
                    Marked for review
                </span>
            }
        </div>
    )
}

export default MarkedForReview