import React from 'react'
import {ArrowLeft, ArrowRight, ChevronRight} from 'lucide-react'

const TestSubjectSelectionBar = () => {
    const subjects = ["Physics", "Chemistry", "Maths"];

    return (
        <div className='flex flex-col w-fit bg-gray-50 h-full'>
            <h1 className='font-bold text-nowrap text-xl border-b-2 p-5'>
                Subject Selection
            </h1>
            <div className='flex flex-col'>
                {
                    subjects.map(sub => (
                        <button className='flex justify-between py-2 border-b text-lg font-semibold px-2'>
                            <span>
                                {sub}
                            </span>
                            <span>
                                <ChevronRight />
                            </span>
                        </button>
                    ))
                }
            </div>
        </div>
    )
}

export default TestSubjectSelectionBar