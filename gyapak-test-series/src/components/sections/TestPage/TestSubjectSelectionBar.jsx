import React from 'react'

const TestSubjectSelectionBar = () => {
    const subjects = ["Physics", "Chemistry", "Maths"];

    return (
        <div className='relative flex flex-col w-fit'>
            <h1 className='font-bold text-nowrap text-xl border-b-2'>
                Subject Selection
            </h1>
            <div className='flex flex-col'>
                {
                    subjects.map(sub => (
                        <div className='py-2 border-b text-lg font-semibold'>
                            {sub}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default TestSubjectSelectionBar