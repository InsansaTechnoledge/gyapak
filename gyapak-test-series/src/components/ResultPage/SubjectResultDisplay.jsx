import React from 'react'
import ResultQuestion from './ResultQuestion'

const SubjectResultDisplay = ({subject, questions, exam}) => {
    return (
        <div className='p-2'>
            <h1 className='font-semibold text-xl text-center bg-gray-100 rounded-md w-fit mb-2 mx-auto px-4 py-2'>{subject}</h1>
            {
                questions.map((question,idx) => (
                    <ResultQuestion key={idx} question={question} number={idx+1} positive_marks={exam.positive_marks} negative_marks={exam.negative_marks}/>
                ))
            }
        </div>
    )
}

export default SubjectResultDisplay