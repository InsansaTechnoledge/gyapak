import React from 'react'
import QuestionSection from '../components/sections/TestPage/QuestionSection'
import TestWindow from '../components/sections/TestPage/TestWindow'
import TestSubjectSelectionBar from '../components/sections/TestPage/TestSubjectSelectionBar'

const TestPage = () => {
  return (
    <>
        <div className='flex'>
            <TestWindow />

        </div>
    </>
  )
}

export default TestPage