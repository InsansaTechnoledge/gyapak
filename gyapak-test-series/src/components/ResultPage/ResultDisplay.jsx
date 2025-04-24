import React, { useEffect, useState } from 'react'
import { getResultForEvent } from '../../service/testResult.service';
import ResultStats from './ResultStats';
import SubjectResultDisplay from './SubjectResultDisplay';

const ResultDisplay = ({ eventId }) => {
    const [resultData, setResultData] = useState();
    const [totalQuestions, setTotalQuestions] = useState();
    const [totalMarks, setTotalMarks] = useState();
    useEffect(() => {
        const fetchResult = async () => {
            const response = await getResultForEvent(eventId);
            if (response.status == 200) {
                console.log(response);
                setResultData(response.data);
                const totalQuestions = (response.data.detailedResult.detailedResult.total_attempted + response.data.detailedResult.detailedResult.unattemptedAns.length);
                setTotalMarks(totalQuestions * response.data.event_id.exam_id.positive_marks);
            }
        }

        fetchResult();
    }, [])

    

    if (!resultData) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div className='mb-10'>
            <h1 className='text-center font-bold text-4xl mb-3'>
                {resultData.event_id.exam_id.title}
            </h1>
            <h2 className='text-center font-semibold text-xl mb-5'>
                {resultData.event_id.name}
            </h2>
            <div className='grid grid-cols-4 w-full gap-5'>
                <div className='col-span-3 border-2 border-purple-700 rounded-lg p-2'>
                    <h1 className='text-2xl mb-5 text-center font-bold'>
                        Detailed Overview
                    </h1>
                    {
                        Object.entries(resultData.subjectWise).map(([key, value], idx) => (
                            <SubjectResultDisplay subject={key} questions={value} exam={resultData.event_id.exam_id}/>
                        ))
                    }
                </div>
                <div className='bg-gray-50 rounded-lg p-4 h-fit border-purple-700 border-2'>
                    <ResultStats total={totalMarks} score={resultData.marks} detailedResult={resultData.detailedResult.detailedResult}/>
                </div>
            </div>
        </div>
    )
}

export default ResultDisplay