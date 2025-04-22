import React, { useEffect, useState } from 'react'
import QuestionListSection from './QuestionListSection'
import QuestionSection from './QuestionSection'
import TestSubjectSelectionBar from './TestSubjectSelectionBar'
import { deleteEventAttemptsByUser, getFullEventDetails } from '../../../service/event.service'
import CountdownTimer from './TestTimer/CountdownTimer'
import CryptoJS from 'crypto-js';
import { checkUsersAnswers } from '../../../service/testResult.service'
import { useUser } from '../../../context/UserContext'
import { useLocation } from 'react-router-dom'

const TestWindow = () => {

    const event_id = '5f5dc6ea-b940-479a-b3be-b5f912484d24';
    const [eventDetails, setEventDetails] = useState();
    const [selectedQuestion, setSelectedQuestion] = useState();
    const [subjectSpecificQuestions, setSubjectSpecificQuestions] = useState();
    const [selectedSubjectId, setSelectedSubjectId] = useState();
    const secretKey = 'secret-key-for-encryption'
    const [submitted, setSubmitted] = useState(false);
    const {user} = useUser();
    const [warning, setWarning] = useState(null);
    const [warningCount, setWarningCount] = useState(0);

    const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const userId = searchParams.get('userId');
  const examId = searchParams.get('examId');
  const eventId = searchParams.get('eventId');



    useEffect(() => {
        if (window?.electronAPI?.onProctorWarning) {
          window.electronAPI.onProctorWarning((data) => {
            console.log("⚠️ Anomaly Detected:", data);
            setWarning(data.details);  // Or customize this with parsed content
            setTimeout(() => setWarning(null), 5000); // Auto-hide after 5s
          });
        }
      }, []);

      useEffect(() => {
        const handleProctorWarning = (event) => {
          console.warn("⚠️ Proctor Warning:", event);
          setWarningCount(prev => {
            const newCount = prev + 1;
            if (newCount >= 5 && !submitted) {
              console.warn("🚨 Auto-submitting due to multiple warnings");
              handleSubmitTest(); // Automatically submit test
            }
            return newCount;
          });
        };
      
        if (window?.electronAPI?.onProctorWarning) {
          window.electronAPI.onProctorWarning(handleProctorWarning);
        }
      
        return () => {
          if (window?.electronAPI?.removeProctorWarningListener) {
            window.electronAPI.removeProctorWarningListener();
          }
        };
      }, [submitted]);
      
      

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {

        const response = await getFullEventDetails(eventId);
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
            localStorage.removeItem('testQuestions');
            localStorage.removeItem('encryptedTimeLeft');
            setSubmitted(true);

            const answers = Object.entries(subjectSpecificQuestions).reduce((acc,[Key,value]) => {
                const objects = value.map(val => ({
                    question_id: val.id,
                    response: val.response
                }))
                return [...acc,...objects]
            },[]);

            const deletedAttempt = await deleteEventAttemptsByUser(eventId, userId);
            if(deletedAttempt.status===200){
                console.log(deletedAttempt.data);
            }

            console.log(answers);
            
            const response = await checkUsersAnswers(answers, userId, eventDetails.exam_id, eventDetails.id);
            if(response.status==200){
                console.log(response.data);
            }
        }
        catch(err){
            console.log(err)
            // console.log(err.response.data.errors[0] || err.message);

            if (window?.electronAPI?.stopProctorEngine) {
                window.electronAPI.stopProctorEngine();
            }

            if (window?.electronAPI?.closeWindow) {
                window.electronAPI.closeWindow();
            }

        }
    }

    if (!eventDetails) {
        return (
            <div>Loading test...</div>
        )
    }

        
    
  

  return (

    <div className='p-3 flex flex-col'>
            {warning && (
            <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-100 border-l-4 border-yellow-500 text-yellow-800 px-6 py-4 rounded-xl shadow-lg animate-pulse w-[90%] sm:w-[500px] text-center font-semibold text-base sm:text-lg backdrop-blur">
                <span className="text-xl mr-2">⚠️</span> {warning}
            </div>
            )}
            <div className='flex w-full justify-between space-x-5'>
                <div className=' font-bold p-5'>
                    <h1 className='text-3xl font-bold'>{eventDetails.exam.title}</h1>
                    <h2 className='text-lg font-bold'>
                        {eventDetails.name}
                    </h2>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base text-red-700 font-semibold px-4 py-1.5 bg-red-100 border border-red-300 rounded-xl shadow-sm transition-all">
                    <span className="text-lg sm:text-xl">🚨</span>
                    <span>
                        Warnings: <span className="font-bold text-red-800">{warningCount}</span>/5
                    </span>
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
                            <CountdownTimer initialTime={eventDetails.duration} handleSubmitTest={handleSubmitTest} submitted={submitted}/>    
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
