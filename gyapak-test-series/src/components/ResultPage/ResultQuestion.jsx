import { Check, X } from 'lucide-react'
import React from 'react'

const ResultQuestion = ({ number, question, positive_marks, negative_marks }) => {
    return (
        <div className='mb-2 p-5 rounded-lg bg-gray-100'>
            <div className='flex justify-between'>
                <h1 className='text-xl font-semibold'>Q{number}. {question.question}</h1>
                {
                    question.status === 'correct'
                        ?
                        <div className='rounded-md bg-green-200 text-green-800 px-4 font-semibold py-2'>
                            correct: +{positive_marks}
                        </div>
                        :
                        question.status === 'wrong'
                            ?
                            <div className='rounded-md bg-red-200 text-red-800 px-4 font-semibold py-2'>
                                Wrong: -{negative_marks}
                            </div>
                            :
                            <div className='rounded-md bg-gray-200 text-gray-800 px-4 font-semibold py-2'>
                                Unattempted: 0
                            </div>

                }

            </div>

            <div className='text-lg ml-8'>

                {
                    Object.entries(question.options).map(([key, value], idx) => (
                        <>
                            <div key={idx} className='flex space-x-1'>
                                <div>
                                    {key} : {value}
                                </div>
                                {
                                    question.correct === key
                                        ?
                                        <Check className='text-green-700 my-auto' />
                                        :
                                        null
                                }
                                {
                                    question.status === 'wrong' && question.response === key
                                        ?
                                        <X className='text-red-700 my-auto' />
                                        :
                                        null
                                }
                            </div>
                        </>
                    ))
                }
            </div>
            <div className='ml-8 mt-5 font-semibold text-lg'>
                Explanation:
            </div>
            <div className='ml-8 text-lg'>
                {question.explanation}
            </div>
        </div>
    )
}

export default ResultQuestion