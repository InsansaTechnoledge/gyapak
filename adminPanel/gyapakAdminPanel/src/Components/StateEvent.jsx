import React, { useEffect, useState } from 'react'
import QuickApplyButton from './OpportunityComponents/QuickApplyButton';
import DetailsSection from './OpportunityComponents/DetailsSection';
import DocumentLinksSection from './OpportunityComponents/DocumentLinksSection';
import HeroSectionState from './OpportunityComponents/HeroSectionState';
import AdditionalDetailsSection from './OpportunityComponents/AdditionalDetailsSection';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const StateEvent = () => {
  
  const [eventData, setEventData] = useState({});
    const [stateId, setStateId] = useState();

      const handleEventDataChange = (e) => {
          const {name, value} = e.target;
  
          // console.log(name,value);
          setEventData(prev => ({
              ...prev,
              [name]: value 
          }));
      }
  
    //   useEffect(()=>{
    //       console.log(eventData);
    //   },[eventData])

    const onHandleSubmitState = async () => {
        try {
            // Required fields validation
            const requiredFields = [
                'organization_id',
                'name',
                'date_of_notification',
                'date_of_commencement',
                'end_date',
                'apply_link',
                'event_type'
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
                alert('End date cannot be earlier than the start date.');
                return;
            }
    
            const response = await axios.post(`${API_BASE_URL}/api/v1/upload/`, eventData);
    
            if (response.status === 200) {
                alert(response.data.message);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'An error occurred.');
        }
    };
    

  return (
    <>
      <div>
            <h1 className='text-purple-700 text-xl mb-4 text-center font-bold'>State Organization Event</h1>
            <div className="bg-white text-gray-900 py-10 px-4">
                <h2 className="text-purple-700 text-lg mb-4 text-center">
                <select 
                name='event_type'
                className='border-2 rounded-md border-purple-700'
                onChange={(e)=>handleEventDataChange(e)}>
                    <option value={""}>select Event Type</option>
                    {
                        ["Exam", "AdmitCard", "Result"].map((type,idx) => (
                            <option key={idx} value={type} >{type}</option>
                        ))
                    }
                </select>
            </h2>
                <HeroSectionState handleEventDataChange={handleEventDataChange} eventData={eventData} setStateId={setStateId} stateId={stateId}/>
                {
                  stateId
                  ?
                  <>
                    <QuickApplyButton handleEventDataChange={handleEventDataChange} eventData={eventData}/>
                    <h2 className='text-purple-700 text-4xl mb-4 text-center font-bold'>Document Links</h2>
                    <DocumentLinksSection setEventData={setEventData}/>
                    <h2 className='text-purple-700 text-4xl mb-4 text-center font-bold'>Additional Details</h2>
                    <DetailsSection setEventData={setEventData}/>
                    <AdditionalDetailsSection data={eventData.details}/>
                  </>
                  :
                  null
                }
            </div>
            <div className='flex justify-center w-full mt-5 mb-10'>
                <button
                    className=' bg-purple-600 text-white text-lg px-5 py-2 rounded-md'
                    onClick={() => onHandleSubmitState()}
                >
                    Upload Data
                </button>

            </div>
        </div>
    </>
  )
}

export default StateEvent