import React, { useEffect } from 'react';
import QuestionListSection from './QuestionListSection';
import QuestionSection from './QuestionSection';
import TestSubjectSelectionBar from './TestSubjectSelectionBar';
import { useParams } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';

const TestWindow = () => {
  const { examId, eventId } = useParams();
  const { user } = useUser(); 
  useEffect(() => {
    if (window?.electronAPI && user?.id && examId && eventId) {
      window.electronAPI.startProctorEngine(user.id, examId, eventId);
    }

    return () => {
      window.electronAPI?.stopProctorEngine?.();
    };
  }, [user, examId, eventId]);

  return (
    <div className='p-3 flex flex-col'>
      <div className='flex w-full justify-between space-x-5'>
        <div className='font-bold p-5'>
          <h1 className='text-3xl font-bold'>Exam Name</h1>
          <h2 className='text-lg font-bold'>
            Test Name Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, commodi.
          </h2>
        </div>
        <div className='flex justify-end space-x-3 bg-gray-100 border-purple-600 border-2 rounded-lg p-3'>
          <div className='text-green-700 font-bold w-full border rounded-lg text-nowrap text-sm px-4 py-2'>
            Correct
            <div className='font-bold text-lg'>+4 marks</div>
          </div>
          <div className='text-red-700 font-bold w-full border rounded-lg text-nowrap text-sm px-4 py-2'>
            Wrong
            <div className='font-bold text-lg'>-1 marks</div>
          </div>
          <div className='text-gray-500 font-bold w-full border rounded-lg text-nowrap text-sm px-4 py-2'>
            Unattempted
            <div className='font-bold text-lg'>0 marks</div>
          </div>
          <div className='flex flex-col px-4 py-2 rounded-lg bg-purple-200'>
            <div className='font-semibold text-nowrap'>Time Left</div>
            <div className='font-bold text-xl'>03:00:00</div>
          </div>
        </div>
      </div>

      <div className='relative flex mt-5 space-x-5 p-3'>
        <button className='border h-min'>Select Subject</button>
        {/* Uncomment to use subject bar */}
        {/* <TestSubjectSelectionBar /> */}
        <QuestionSection />
        <QuestionListSection />
      </div>

      <button className='mx-auto mt-10 rounded-md text-lg font-semibold bg-purple-600 px-4 py-2 w-fit text-white'>
        Submit Test
      </button>
    </div>
  );
};

export default TestWindow;
