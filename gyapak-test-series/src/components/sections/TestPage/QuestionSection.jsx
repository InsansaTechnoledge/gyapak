import React, { useEffect, useState } from 'react'

const QuestionSection = ({ setSelectedQuestion, selectedQuestion, selectedSubjectId, subjectSpecificQuestions, setSubjectSpecificQuestions }) => {
    const [option, setOption] = useState();

    useEffect(()=>{
        if(selectedQuestion){
            setOption(selectedQuestion.response);
        }
    }, [selectedQuestion])

    const handleChangeOption = (option) => {
        setOption(option);

    }

    if (!selectedQuestion) {
        return (
            <div>Loading...</div>
        )
    }

    const handlePrevious = () => {
        setSelectedQuestion(subjectSpecificQuestions[selectedSubjectId][selectedQuestion.index - 2])
    }

    const handleNext = () => {
        if (selectedQuestion.index != subjectSpecificQuestions[selectedSubjectId].length) {
            setSelectedQuestion(subjectSpecificQuestions[selectedSubjectId][selectedQuestion.index])
        }

        setSubjectSpecificQuestions(prev => ({
            ...prev,
            [selectedSubjectId]: prev[selectedSubjectId].map(q =>
                q.index === selectedQuestion.index
                    ? {
                        ...q,
                        response: option,
                        ...(option ? q.status=='markedForReview' ? null : {status : 'answered'} : {status: 'unanswered'}) 
                    }
                    : q
            )
        }));
    }

const handleMarkForReview = () => {
    setSubjectSpecificQuestions(prev => ({
        ...prev,
        [selectedSubjectId]: prev[selectedSubjectId].map(q =>
            q.index === selectedQuestion.index
                ? { ...q, 
                    response: option,
                    status: 'markedForReview' }
                : q
        )
    }));

    if (selectedQuestion.index != subjectSpecificQuestions[selectedSubjectId].length) {
        setSelectedQuestion(subjectSpecificQuestions[selectedSubjectId][selectedQuestion.index])
    }
}

const handleUnMarkForReview = () => {
    setSubjectSpecificQuestions(prev => ({
        ...prev,
        [selectedSubjectId]: prev[selectedSubjectId].map(q =>
            q.index === selectedQuestion.index
                ? { ...q, 
                    ...(option ? {status: 'answered'} : {status: 'unanswered'} ) 
                }
                : q
        )
    }));

    if (selectedQuestion.index != subjectSpecificQuestions[selectedSubjectId].length) {
        setSelectedQuestion(subjectSpecificQuestions[selectedSubjectId][selectedQuestion.index])
    }
}

return (
    <>

        <div className='relative w-full flex flex-col justify-between space-y-5'>

            <div>
                <h3 className='font-bold text-3xl '>Q{selectedQuestion.index}. {selectedQuestion.question}</h3>
                {
                    selectedQuestion.image
                        ?
                        <img src='' alt='img here' />
                        :
                        null
                }
                <div className='mt-10 space-y-10'>
                    <div className='flex text-2xl space-x-2'>
                        <input type='radio' id='A'
                            checked={option==='A'}
                            onChange={(e) => handleChangeOption(e.target.id)}
                            name='option' value={selectedQuestion.options['A']} />
                        <label htmlFor='A'>{selectedQuestion.options['A']}</label>
                    </div>
                    <div className='flex text-2xl space-x-2'>
                        <input type='radio' id='B'
                        checked={option==='B'}
                            onChange={(e) => handleChangeOption(e.target.id)}
                            name='option' value={selectedQuestion.options['B']} />
                        <label htmlFor='B'>{selectedQuestion.options['B']}</label>
                    </div>
                    <div className='flex text-2xl space-x-2'>
                        <input type='radio' id='C'
                        checked={option==='C'}
                            onChange={(e) => handleChangeOption(e.target.id)}
                            name='option' value={selectedQuestion.options['C']} />
                        <label htmlFor='C'>{selectedQuestion.options['C']}</label>
                    </div>
                    <div className='flex text-2xl space-x-2'>
                        <input type='radio' id='D'
                        checked={option==='D'}
                            onChange={(e) => handleChangeOption(e.target.id)}
                            name='option' value={selectedQuestion.options['D']} />
                        <label htmlFor='D'>{selectedQuestion.options['D']}</label>
                    </div>
                </div>
            </div>
            <div className=' w-full justify-between flex text-lg'>
                {
                    selectedQuestion.index != 1
                        ?
                        <button
                            onClick={handlePrevious}
                            className='px-4 py-2 bg-purple-600 text-white rounded-md font-semibold'>Previous</button>
                        :
                        <div>
                        </div>
                }
                <div className='space-x-5'>


                    <button
                        onClick={() => handleChangeOption(null)}
                        className='px-4 py-2 bg-purple-600 text-white rounded-md font-semibold'>Clear response</button>
                    {
                        subjectSpecificQuestions[selectedSubjectId][selectedQuestion.index-1]?.status==='markedForReview'
                        ?
                        <button
                            onClick={handleUnMarkForReview}
                            className='px-4 py-2 bg-purple-600 text-white rounded-md font-semibold'>Unmark for review and next</button>
                            :
                            <button
                                onClick={handleMarkForReview}
                                className='px-4 py-2 bg-purple-600 text-white rounded-md font-semibold'>Mark for review and next</button>

                    }
                    <button
                        onClick={handleNext}
                        className='px-4 py-2 bg-purple-600 text-white rounded-md font-semibold'>Next</button>


                </div>
            </div>
        </div>
    </>
)
}

export default QuestionSection