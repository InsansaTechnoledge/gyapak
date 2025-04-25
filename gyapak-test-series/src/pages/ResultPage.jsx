import React from 'react'
import ResultDisplay from '../components/ResultPage/ResultDisplay'
import { useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar/Navbar';
import Footer from '../components/common/Footer/Footer';

const ResultPage = () => {
    const {eventId} = useParams();
    console.log(eventId);

  return (
    <>
        <Navbar />
        <div className='px-36 mt-24'>
            <ResultDisplay eventId={eventId}/>
        </div>
        <Footer />
    </>
  )
}

export default ResultPage