import React from 'react'

const AnsweredAndMarkedForReview = ({number, noText}) => {
    return (
        <div className='flex space-x-2'>
            <div className='relative border-black border-2 bg-violet-400 text-white rounded-t-full py-2 px-3 font-bold'>
                {number.toString().padStart(2,"0")}
                <div className='absolute bottom-0 right-0 translate-1/2 p-2 rounded-full bg-green-500'></div>
            </div>
            {
                !noText
                &&
                <span className='my-auto'>
                    Answered and marked for review
                </span>
            }
        </div>
    )
}

export default AnsweredAndMarkedForReview