import React from 'react'

const UnattemptedTag = ({number, noText}) => {
    return (
        <div className='flex space-x-2'>
            <span className='border-2 rounded-sm border-black bg-gray-200 py-2 px-3 font-bold'>{number.toString().padStart(2,"0")}</span>
            {
                !noText
                &&
                <span className='my-auto'>
                    Unattempted
                </span>

            }
        </div>
    )
}

export default UnattemptedTag