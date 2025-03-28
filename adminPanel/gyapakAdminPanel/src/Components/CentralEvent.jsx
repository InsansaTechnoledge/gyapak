import React, { useEffect, useState } from 'react'
import QuickApplyButton from './OpportunityComponents/QuickApplyButton';
import DetailsSection from './OpportunityComponents/DetailsSection';
import DocumentLinksSection from './OpportunityComponents/DocumentLinksSection';
import HeroSectionCentral from './OpportunityComponents/HeroSectionCentral';
import AdditionalDetailsSection from './OpportunityComponents/AdditionalDetailsSection';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const CentralEvent = () => {

    const [eventData, setEventData] = useState({});

    const handleEventDataChange = (e) => {
        const { name, value } = e.target;

        // console.log(name,value);
        setEventData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const onHandleSubmitCentral = async () => {
        const response = await axios.post(`${API_BASE_URL}/api/v1/upload/central`,
            eventData
        );

        if(response.status===200){
            alert(response.data.message);
        }
    }

    useEffect(() => {
        console.log(eventData);
    }, [eventData])

    return (
        <div>
            <h1 className='text-purple-700 text-xl mb-4 text-center font-bold'>Central Organization Event</h1>
            <div className="bg-white text-gray-900 py-10 px-4">
                <h2 className="text-purple-700 text-lg mb-4 text-center">
                    <select
                        name='event_type'
                        className='border-2 rounded-md border-purple-700'
                        onChange={(e) => handleEventDataChange(e)}>
                        <option>select Event Type</option>
                        {
                            ["Exam", "AdmitCard", "Result"].map((type, idx) => (
                                <option key={idx} value={type} >{type}</option>
                            ))
                        }
                    </select>
                </h2>
                <HeroSectionCentral handleEventDataChange={handleEventDataChange} eventData={eventData} />
                <QuickApplyButton handleEventDataChange={handleEventDataChange} eventData={eventData} />
                <h2 className='text-purple-700 text-4xl mb-4 text-center font-bold'>Document Links</h2>
                <DocumentLinksSection setEventData={setEventData} />
                <h2 className='text-purple-700 text-4xl mb-4 text-center font-bold'>Additional Details</h2>
                <DetailsSection setEventData={setEventData} />
                <AdditionalDetailsSection data={eventData.details} />
            </div>
            <div className='flex justify-center w-full mt-5 mb-10'>
                <button
                    className=' bg-purple-600 text-white text-lg px-5 py-2 rounded-md'
                    onClick={() => onHandleSubmitCentral()}
                >
                    Upload Data
                </button>

            </div>
        </div>
    )
}

export default CentralEvent