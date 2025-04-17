import React from 'react'
import TestSubjectSelectionBar from './TestSubjectSelectionBar'

const QuestionSection = () => {
    return (
        <>
            <div className='w-full flex flex-col justify-between'>
                <div className='flex'>
                    <div>
                        <TestSubjectSelectionBar />
                    </div>
                    <div>
                <h3 className='font-bold text-3xl '>Q1. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, cupiditate?</h3>
                <img src='' alt='img here'/>
                <div className='mt-10 space-y-10'>
                    <div className='flex text-2xl space-x-2'>
                        <input type='radio' id='option1' name='option1' value={'Option 1'}/>
                        <label htmlFor='option1'>Option 1</label>
                    </div>
                    <div className='flex text-2xl space-x-2'>
                        <input type='radio' id='option2' name='option2' value={'Option 2'}/>
                        <label htmlFor='option1'>Option 2</label>
                    </div>
                    <div className='flex text-2xl space-x-2'>
                        <input type='radio' id='option3' name='option3' value={'Option 3'}/>
                        <label htmlFor='option1'>Option 3</label>
                    </div>
                    <div className='flex text-2xl space-x-2'>
                        <input type='radio' id='option4' name='option4' value={'Option 4'}/>
                        <label htmlFor='option1'>Option 4</label>
                    </div>
                </div>
                </div>
                </div>
                <div className=' w-full justify-between flex text-lg'>
                    <button className='px-4 py-2 bg-purple-600 text-white rounded-md font-semibold'>Previous</button>
                    <div className='space-x-5'>
                        <button className='px-4 py-2 bg-purple-600 text-white rounded-md font-semibold'>Mark for review and next</button>
                        <button className='px-4 py-2 bg-purple-600 text-white rounded-md font-semibold'>Next</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default QuestionSection