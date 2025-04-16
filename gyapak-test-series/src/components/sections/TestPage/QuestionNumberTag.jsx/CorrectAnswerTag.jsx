import React from 'react'

const CorrectAnswerTag = ({number, noText}) => {
    return (
        <div className='flex space-x-2'>
            <span className='border-2 border-black rounded-full bg-green-600 text-white py-2 px-3 font-bold'>{number.toString().padStart(2,'0')}</span>
            {
                !noText
                &&
                <span className='my-auto'>
                    Answered
                </span>
            }
        </div>
    )
}

export default CorrectAnswerTag