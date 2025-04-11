import { Star } from 'lucide-react'
import React, { useState } from 'react'

const ExamMarquee = () => {
    const [exams, setExams] = useState([
        "UPSC",
        "JEE Mains",
        "NEET",
    ])

    return (
        <>
            <marquee behavior="scroll" direction="left" scrollamount="4" className='-mb-1.5 bg-purple-500'>
                <div className='p-2 flex space-x-5 w-min'>
                    {
                        exams.map((exam, idx) => {
                            return (
                                <div key={idx} className='flex space-x-5'>
                                    <div className='flex text-lg text-white'>
                                        {exam}
                                    </div>
                                    <div className='flex'>
                                        <Star
                                            className='w-5 h-5 my-auto text-amber-200' />
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </marquee>
        </>
    )
}

export default ExamMarquee