import React, { useEffect, useState } from 'react'
import QuickApplyButton from '../OpportunityComponents/QuickApplyButton';
import DetailsSection from '../OpportunityComponents/DetailsSection';
import DocumentLinksSection from '../OpportunityComponents/DocumentLinksSection';
import AdditionalDetailsSection from '../OpportunityComponents/AdditionalDetailsSection';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import HeroSectionEdit from '../OpportunityComponents/HeroSectionEdit';
import ModernExamDetailsPage from '../../Pages/Opportunities/Opportunities';

const DeleteEventShowcase = ({data, setEventDataMain, setEventId}) => {

    const [eventData, setEventData] = useState(data);


    const SUBMIT_SECRET = "Gyapak_Insansa@123"

    const handleDeleteEvent = async () => {
        const prompt1 = prompt("Enter secret key");
                if(prompt1!==SUBMIT_SECRET){
                    alert("Unauthorized access");
                    return;
                }
        try {
            
            const response = await axios.delete(`${API_BASE_URL}/api/v1i2/event/`, {
                data: {
                    organizationId: eventData.organization_id,
                    eventId: eventData._id
                }
            });
    
            if (response.status === 200) {
                alert(response.data.message);
                setEventDataMain(null);
                setEventId(null)
            }
        } catch (err) {
            alert(err.response?.data?.message || 'An error occurred.');
        }
    };
    


    return (
        <>
            <div className='flex justify-center'>
                <button 
                onClick={handleDeleteEvent}
                className='bg-red-700 text-white px-4 py-2 text-lg rounded-md mt-12'>Delete Event</button>
            </div>
            <ModernExamDetailsPage eventData={eventData} />
        </>
    )
}

export default DeleteEventShowcase