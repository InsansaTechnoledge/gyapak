import React, { useEffect, useState } from 'react'
import HeroSection from './OpportunityComponents/HeroSection'

const CentralEvent = () => {

    const [eventData, setEventData] = useState();

    const handleEventDataChange = (e) => {
        const {name, value} = e.target;

        // console.log(name,value);
        setEventData(prev => ({
            ...prev,
            [name]: value 
        }));
    }

    useEffect(()=>{
        console.log(eventData);
    },[eventData])

    return (
        <div>
            <div className="bg-white text-gray-900 py-10 px-4">
                <HeroSection handleEventDataChange={handleEventDataChange} eventData={eventData}/>
            </div>
        </div>
    )
}

export default CentralEvent