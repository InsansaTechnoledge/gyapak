import React from 'react'
import MarksCircle from './MarksCircle'

const ResultStats = ({score, total, detailedResult}) => {
    return (
        <div>
            <MarksCircle score={score} total={total} />
            <div className='mt-5 rounded-lg space-y-3'>
                <div className='text-lg font-bold px-4 py-2 rounded-xl bg-yellow-100 border-yellow-700 flex justify-between border-2'>
                    <span className='text-yellow-700'>
                        Attempted
                    </span>
                    <span>
                        {detailedResult.total_attempted}
                    </span>
                </div>
                <div className='text-lg font-bold px-4 py-2 rounded-xl bg-green-100 border-green-700 flex justify-between border-2'>
                    <span className='text-green-700'>
                        Correct answers
                    </span>
                    <span>
                        {detailedResult.right_count}
                    </span>
                </div>
                <div className='text-lg font-bold px-4 py-2 rounded-xl bg-red-100 border-red-700 flex justify-between border-2'>
                    <span className='text-red-700'>
                        Wrong answers
                    </span>
                    <span>
                        {detailedResult.wrong_count}
                    </span>
                </div>
                <div className='text-lg font-bold px-4 py-2 rounded-xl bg-gray-100 border-gray-700 flex justify-between border-2'>
                    <span className='text-gray-700'>
                        Unattempted
                    </span>
                    <span>
                        {detailedResult.unattemptedAns.length}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ResultStats