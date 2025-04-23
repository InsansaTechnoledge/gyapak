import React from 'react'
import ResultDisplay from '../components/ResultPage/ResultDisplay'
import { useParams } from 'react-router-dom';

const ResultPage = () => {
    const {eventId} = useParams();
    console.log(eventId);

  return (
    <>
        <div className='flex '>
            <ResultDisplay eventId={eventId}/>
        </div>
    </>
  )
}

export default ResultPage