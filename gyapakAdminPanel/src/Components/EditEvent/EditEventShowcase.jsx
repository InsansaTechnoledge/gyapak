import React, { useEffect, useState } from 'react'
import QuickApplyButton from '../OpportunityComponents/QuickApplyButton';
import DetailsSection from '../OpportunityComponents/DetailsSection';
import DocumentLinksSection from '../OpportunityComponents/DocumentLinksSection';
import AdditionalDetailsSection from '../OpportunityComponents/AdditionalDetailsSection';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import HeroSectionEdit from '../OpportunityComponents/HeroSectionEdit';
import BriefEditableSection from '../OpportunityPageComponents/BriefDetailsSection';

const EditEventShowcase = ({data, setEventDataMain, setEventId}) => {

    const [eventData, setEventData] = useState(data);

    const handleEventDataChange = (e) => {
        const { name, value } = e.target;

        // console.log(name,value);
        setEventData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const SUBMIT_SECRET = "Gyapak_Insansa@123"

    const onHandleSubmitCentral = async () => {
        const prompt1 = prompt("Enter secret key");
                if(prompt1!==SUBMIT_SECRET){
                    alert("Unauthorized access");
                    return;
                }
        try {
            // Required fields validation
            const requiredFields = [
                'organization_id',
                'name',
                'date_of_notification',
                'date_of_commencement',
                'end_date',
                'apply_link',
                'event_type',
                // 'breifDetails',
            ];
    
            for (const field of requiredFields) {
                if (!eventData[field]) {
                    alert(`${field} is required.`);
                    return;
                }
            }
    
            // Validate date range
            const commencementDate = new Date(eventData.date_of_commencement);
            const endDate = new Date(eventData.end_date);
    
            if (endDate < commencementDate) {
                alert('End date cannot be earlier than the commencement date.');
                return;
            }  
            
            const response = await axios.post(`${API_BASE_URL}/api/v1i2/event/${eventData._id}`, eventData);
    
            if (response.status === 200) {
                alert(response.data.message);
                setEventDataMain(null);
                setEventId(null);

            }
        } catch (err) {
            alert(err.response?.data?.message || 'An error occurred.');
        }
    };
    

    // useEffect(() => {
    //     console.log(eventData);
    // }, [eventData])

    return (
        <div>
            <div className="bg-white text-gray-900 py-10 px-4">
                <h2 className="text-purple-700 text-lg mb-4 text-center">
                    <select
                        name='event_type'
                        value={eventData.event_type}
                        defaultValue={eventData.event_type}
                        className='border-2 rounded-md border-purple-700'
                        onChange={(e) => handleEventDataChange(e)}>
                        <option value={""}>select Event Type</option>
                        {
                            ["Exam", "AdmitCard", "Result"].map((type, idx) => (
                                <option key={idx} value={type} >{type}</option>
                            ))
                        }
                    </select>
                </h2>
                <HeroSectionEdit handleEventDataChange={handleEventDataChange} eventData={eventData} />
                <QuickApplyButton handleEventDataChange={handleEventDataChange} eventData={eventData} />
                <h2 className='text-purple-700 text-4xl mb-4 text-center font-bold'>Document Links</h2>
                <DocumentLinksSection setEventData={setEventData} eventData={eventData} />
                <h2 className='text-purple-700 text-4xl mb-4 text-center font-bold'>Additional Details</h2>
                <DetailsSection setEventData={setEventData} eventData={eventData}/>
                <AdditionalDetailsSection data={eventData.details} />
                <BriefEditableSection
                                        value={eventData.briefDetails}
                                        onChange={(value) => setEventData(prev => ({ ...prev, briefDetails: value }))}
                                        
                                    />
            </div>
            <div className='flex justify-center w-full mt-5 mb-10'>
                <button
                    className=' bg-purple-600 text-white text-lg px-5 py-2 rounded-md'
                    onClick={() => onHandleSubmitCentral()}
                >
                    Update Data
                </button>

            </div>
        </div>
    )
}

export default EditEventShowcase