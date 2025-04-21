import React from 'react'

const TestInstructions = () => {

    const queryParams = new URLSearchParams(window.location.search);
    const examId = queryParams.get("examId");
    const eventId = queryParams.get("eventId");

    const handleStartTest = () => {

    }

  return (
    <>
        <div>TestInstructions</div>
        <h1 className='text-2xl font-bold text-center'></h1>
        <button 
        onClick={handleStartTest}
        className='bg-purple-600 text-white px-4 py-2 rounded-md'>Start Test</button>
    </>
  )
}

export default TestInstructions