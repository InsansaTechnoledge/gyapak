import React from 'react'
import ResultDisplay from '../components/ResultPage/ResultDisplay'

const ResultPage = () => {
    const {eventId} = useParams();


  return (
    <>
        <div className='flex'>
            <ResultDisplay eventId={eventId}/>
        </div>
    </>
  )
}

export default ResultPage