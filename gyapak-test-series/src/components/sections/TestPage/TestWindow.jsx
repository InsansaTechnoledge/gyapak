import React, { useEffect, useState } from 'react'
import QuestionListSection from './QuestionListSection'
import QuestionSection from './QuestionSection'
import TestSubjectSelectionBar from './TestSubjectSelectionBar'
import { getFullEventDetails } from '../../../service/event.service'
import CountdownTimer from './TestTimer/CountdownTimer'
import CryptoJS from 'crypto-js';
import { checkUsersAnswers } from '../../../service/testResult.service'
import { useUser } from '../../../context/UserContext'

const TestWindow = () => {

    const event_id = '5f5dc6ea-b940-479a-b3be-b5f912484d24';
    const [eventDetails, setEventDetails] = useState();
    const [selectedQuestion, setSelectedQuestion] = useState();
    const [subjectSpecificQuestions, setSubjectSpecificQuestions] = useState();
    const [selectedSubjectId, setSelectedSubjectId] = useState();
    const secretKey = 'secret-key-for-encryption'
    const {user} = useUser();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {

        const response = await getFullEventDetails(event_id);
        if (response.status == 200) {
          console.log(response.data);
          setEventDetails(response.data);
        }
      }
      catch (err) {
        console.log(err.response.data.errors[0] || err.message);
      }
    }

        fetchEventDetails();
    }, [])

    useEffect(() => {
        if (subjectSpecificQuestions) {
            const encrypted = CryptoJS.AES.encrypt(JSON.stringify(subjectSpecificQuestions), secretKey).toString();
            localStorage.setItem('testQuestions', encrypted);
        }
    }, [subjectSpecificQuestions])

    useEffect(() => {
        if (eventDetails) {

            if (!localStorage.getItem('testQuestions')) {

                setSubjectSpecificQuestions(
                    eventDetails.questions.reduce((acc, quest) => {
                        if (!acc[quest.subject_id]) {
                            acc[quest.subject_id] = [{ ...quest, index: 1, status: 'unanswered', response: null }]
                        }
                        else {
                            acc[quest.subject_id].push({ ...quest, index: acc[quest.subject_id].length + 1, status: 'unanswered', response: null });
                        }
                        return acc;
                    }, {})
                )
            }
            else {
                const bytes = CryptoJS.AES.decrypt(localStorage.getItem('testQuestions'), secretKey);
                const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                setSubjectSpecificQuestions(decrypted);
            }


            setSelectedSubjectId(eventDetails.subjects[0].id);
        }
    }, [eventDetails]);

    useEffect(() => {
        if (selectedSubjectId && subjectSpecificQuestions) {
            setSelectedQuestion(subjectSpecificQuestions[selectedSubjectId][0]);
        }
    }, [selectedSubjectId])


    useEffect(() => {
        console.log("AAA", subjectSpecificQuestions);
    }, [subjectSpecificQuestions]);


    const handleSubmitTest = async () => {
        try{

            const answers = Object.entries(subjectSpecificQuestions).reduce((acc,[Key,value]) => {
                const objects = value.map(val => ({
                    question_id: val.id,
                    response: val.response
                }))
                return [...acc,...objects]
            },[]);

            console.log(answers);
            
            const response = await checkUsersAnswers(answers, user._id, eventDetails.exam_id, eventDetails.id);
            if(response.status==200){
                console.log(response.data);
            }
        }
        catch(err){
            console.log(err)
            // console.log(err.response.data.errors[0] || err.message);
        }
    }

    if (!eventDetails) {
        return (
            <div>Loading test...</div>
        )
    }

        
    
  

  return (
    <div className='p-3 flex flex-col'>
            <div className='flex w-full justify-between space-x-5'>
                <div className=' font-bold p-5'>
                    <h1 className='text-3xl font-bold'>{eventDetails.exam.title}</h1>
                    <h2 className='text-lg font-bold'>
                        {eventDetails.name}
                    </h2>
                </div>
                <div className='flex justify-end space-x-3 bg-gray-100 border-purple-600 border-2 rounded-lg p-3'>
                    <div className='text-green-700 font-bold w-full border rounded-lg text-nowrap text-sm px-4 py-2'>
                        Correct
                        <div className='font-bold text-lg'>
                            +{eventDetails.exam.positive_marks} marks
                        </div>
                    </div>
                    <div className='text-red-700 font-bold w-full border rounded-lg text-nowrap text-sm px-4 py-2'>
                        Wrong
                        <div className='font-bold text-lg'>
                            -{eventDetails.exam.negative_marks} marks
                        </div>
                    </div>
                    <div className='text-gray-500 font-bold w-full border rounded-lg text-nowrap text-sm px-4 py-2'>
                        Unattempted
                        <div className='font-bold text-lg'>
                            0 marks
                        </div>
                    </div>
                    <div className=' flex flex-col px-4 py-2 rounded-lg bg-purple-200'>
                        <div className='font-semibold text-nowrap'>Time Left</div>
                        <div className='font-bold text-xl'>
                            {/* <CountdownTimer initialTime={eventDetails.duration} handleSubmitTest={handleSubmitTest}/>     */}
                            <CountdownTimer initialTime={'00:00:10'} handleSubmitTest={handleSubmitTest}/>    
                        </div>
                    </div>

                </div>
            </div>
            <div className='grid grid-cols-5 mt-5 space-x-5 p-3'>
                <div className='col-span-3 relative flex flex-col space-y-5 p-3'>
                    <QuestionSection
                        setSubjectSpecificQuestions={setSubjectSpecificQuestions}
                        setSelectedQuestion={setSelectedQuestion}
                        selectedQuestion={selectedQuestion}
                        selectedSubjectId={selectedSubjectId}
                        subjectSpecificQuestions={subjectSpecificQuestions}
                    />
                </div>
                {/* <div className='absolute'> */}
                {/* <TestSubjectSelectionBar /> */}
                {/* </div> */}
                <div className='col-span-2 '>
                    <QuestionListSection
                        subjectSpecificQuestions={subjectSpecificQuestions}
                        setSubjectSpecificQuestions={setSubjectSpecificQuestions}
                        selectedSubjectId={selectedSubjectId}
                        setSelectedSubjectId={setSelectedSubjectId}
                        selectedQuestion={selectedQuestion}
                        setSelectedQuestion={setSelectedQuestion}
                        eventDetails={eventDetails} />
                </div>
            </div>
            <button 
            onClick={handleSubmitTest}
            className='mx-auto mt-10 rounded-md text-lg font-semibold bg-purple-600 px-4 py-2 w-fit text-white'>
                Submit Test
            </button>
        </div>
  );
};

export default TestWindow;
