import React, { useEffect, useState } from 'react';
import { PageMode, Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import axios from 'axios';
import { RingLoader } from 'react-spinners';
import { useApi } from '../../Context/ApiContext';

const ExamCalendar = ({organizationId}) => {
  const { apiBaseUrl } = useApi();

  const [examLink, setExamLink] = useState();
    // const examLink =
    // 'https://dl.dropboxusercontent.com/scl/fi/zp5m98tknhbmkf1hzvlg5/Fanse-Jay-Amrish_Maharaja-Sayajirao-University-of-Baroda.pdf?rlkey=tfkap35kn8tuixzklkb35qpb8&st=xx0exww4';

    useEffect(()=>{
        if(organizationId){
            const fetchCalendar = async () => {

                try{
                    const response = await axios.get(`${apiBaseUrl}/api/organization/calendar/${organizationId}`);
                    if(response.status===200){
                        setExamLink(response.data.calendar);
                    }
                }
                catch(err){
                    console.log(err);
                }
            }

            fetchCalendar();
        }

    },[organizationId])

    if(!examLink){
        return <div className='w-full h-screen flex justify-center'>
            <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />
        </div>
    }

  return (
    <div className='mb-10'>
      <div style={{ height: '600px', width: '100%' }}>
        <Worker workerUrl="/pdfjs/pdf.worker.min.js">
          <Viewer fileUrl={examLink}/>
        </Worker>
      </div>
    </div>
  );
};

export default ExamCalendar;
