import React, { useEffect, useState } from 'react'
import CorrectAnswerTag from './QuestionNumberTag.jsx/CorrectAnswerTag'
import UnattemptedTag from './QuestionNumberTag.jsx/UnattemptedTag'
import MarkedForReview from './QuestionNumberTag.jsx/MarkedForReview'
import AnsweredAndMarkedForReview from './QuestionNumberTag.jsx/AnsweredAndMarkedForReview'
import TestSubjectSelectionBar from './TestSubjectSelectionBar'

const QuestionListSection = ({eventDetails, selectedQuestion, setSelectedQuestion, subjectSpecificQuestions, setSubjectSpecificQuestions, selectedSubjectId, setSelectedSubjectId}) => {
    const [subjectSelectionVisible, setSubjectSelectionVisible] = useState(false);

    if(!subjectSpecificQuestions || !selectedQuestion){
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div className='flex space-x-2 px-2 border-l-2 h-full'>
            {
                !subjectSelectionVisible
                ?
                <>
                    <div className='flex flex-col space-y-5'>
                        <div className='p-2 border-2 rounded-md text-center'>
                            {eventDetails.subjects.find(subject => subject.id === selectedSubjectId).name}
                        </div>
                        <button 
                        onClick={()=>setSubjectSelectionVisible(true)}
                        className='border h-min w-fit px-4 py-2 bg-purple-600 text-white rounded-md'>Select Subject</button>
                    </div>
                </>
                :
                <TestSubjectSelectionBar selectedSubjectId={selectedSubjectId} setSelectedSubjectId={setSelectedSubjectId} eventDetails={eventDetails} setSubjectSelectionVisible={setSubjectSelectionVisible}/>
            }
            <div className='flex flex-col w-fit px-10 space-y-2 border-l-2'>
                <div className='grid grid-cols-2 gap-10'>
                    <CorrectAnswerTag number={1} />
                    <UnattemptedTag number={1} />
                    <MarkedForReview number={1} />
                    <AnsweredAndMarkedForReview number={1} />
                </div>
                <div className='grid grid-cols-5 border-2 rounded-md gap-2 p-5 mt-5'>
                    {
                        subjectSpecificQuestions[selectedSubjectId].map((ques, i) => (
                            <button key={i + 1}
                            onClick={()=>setSelectedQuestion(ques)}>
                                {
                                    ques.status=='unanswered'
                                    ?
                                    <UnattemptedTag number={i + 1} noText={true} current={ques.id==selectedQuestion.id}/>
                                    :
                                    ques.status=='answered'
                                    ?
                                    <CorrectAnswerTag number={i+1} noText={true} current={ques.id==selectedQuestion.id}/>
                                    :
                                    ques.status=='markedForReview' && !ques.response
                                    ?
                                    <MarkedForReview number={i+1} noText={true} current={ques.id==selectedQuestion.id}/>
                                    :
                                    <AnsweredAndMarkedForReview number={i+1} noText={true} current={ques.id==selectedQuestion.id}/>
                                }
                            </button>
                        ))
                    }
                </div>
            </div>
        </div>

    )
}

export default QuestionListSection