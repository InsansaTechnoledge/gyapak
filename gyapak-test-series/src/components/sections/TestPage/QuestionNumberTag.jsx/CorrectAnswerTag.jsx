import React from 'react'

const CorrectAnswerTag = ({number, noText, current}) => {
    return (
        <div className='flex space-x-2'>
            <span className={`${current ? 'border-3' : 'border-2'} border-black rounded-full bg-green-600 text-white py-2 px-3 font-bold`}>{number.toString().padStart(2,'0')}</span>
            {
                !noText
                &&
                <span className='my-auto text-sm'>
                    Answered
                </span>
            }
        </div>
    )
}

export default CorrectAnswerTag