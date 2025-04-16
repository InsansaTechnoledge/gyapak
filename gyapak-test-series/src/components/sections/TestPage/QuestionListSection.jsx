import React from 'react'
import CorrectAnswerTag from './QuestionNumberTag.jsx/CorrectAnswerTag'
import UnattemptedTag from './QuestionNumberTag.jsx/UnattemptedTag'
import MarkedForReview from './QuestionNumberTag.jsx/MarkedForReview'
import AnsweredAndMarkedForReview from './QuestionNumberTag.jsx/AnsweredAndMarkedForReview'

const QuestionListSection = () => {
    return (
        <div className='flex flex-col w-fit px-10 space-y-2 border-l-2'>
            <div className='grid grid-cols-2 gap-10'>
                <CorrectAnswerTag number={1} />
                <UnattemptedTag number={1} />
                <MarkedForReview number={1} />
                <AnsweredAndMarkedForReview number={1} />
            </div>
            <div className='grid grid-cols-5 border-2 rounded-md gap-2 p-5 mt-5'>
                {
                    [...Array(29)].map((_, i) => (
                        <UnattemptedTag key={i + 1} number={i + 1} noText={true}/>
                    ))
                }
            </div>
        </div>
    )
}

export default QuestionListSection