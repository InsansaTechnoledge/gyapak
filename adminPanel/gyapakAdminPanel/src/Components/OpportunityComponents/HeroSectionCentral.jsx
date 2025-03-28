import React, { useEffect, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const HeroSectionCentral = ({handleEventDataChange, eventData }) => {
    const [organizations, setOrganizations] = useState();

    useEffect(()=>{
        const fetchOrganizations = async () => {
            const response = await axios.get(`${API_BASE_URL}/api/v1/organizations/central`);
            if(response.status==200){
                console.log(response.data);
                setOrganizations(response.data);
            }
        }

        fetchOrganizations();
    },[])
    
    if(!organizations){
        return (<div>
            Loading...
        </div>)
    }

    return (
        <div className="text-center mb-16">
            <h2 className="text-purple-700 text-lg mb-4">
                <select 
                name='organization_id'
                className='border-2 rounded-md border-purple-700'
                onChange={(e)=>handleEventDataChange(e)}>
                    <option>select organization</option>
                    {
                        organizations.map(org => (
                            <option key={org._id} value={org._id} >{org.name}, {org.abbreviation}</option>
                        ))
                    }
                </select>
            </h2>
            <div className="inline-block relative mx-auto">
                <h1 className="
                text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent mb-12">
                    <input
                        placeholder='Enter event'
                        onChange={(e) => handleEventDataChange(e)}
                        type='text' name='name' value={eventData?.organization} className='w-full focus:border-4 border-purple-700 border-2 rounded-md' />
                </h1>

                {/* Floating Date Cards */}
                <div className="flex justify-center gap-8 flex-wrap">

                    <div className="transform -rotate-3 bg-purple-200 p-6 rounded-lg shadow-lg">
                        <Calendar className="w-8 h-8 mb-2 text-purple-700" />
                        <p className="text-sm text-purple-900">Notification Date</p>
                        <p className="font-bold text-purple-800">
                            <input
                                onChange={(e) => handleEventDataChange(e)}
                                type='date' name='date_of_notification' />
                        </p>
                    </div>
                    <div className="transform rotate-3 bg-purple-300 p-6 rounded-lg shadow-lg">
                        <Calendar className="w-8 h-8 mb-2 text-purple-800" />
                        <p className="text-sm text-purple-900">Start Date</p>
                        <p className="font-bold text-purple-900">
                            <input
                                onChange={(e) => handleEventDataChange(e)}
                                type='date' name='date_of_commencement' />
                        </p>
                    </div>
                    <div className="transform -rotate-3 bg-purple-400 p-6 rounded-lg shadow-lg">
                        <Clock className="w-8 h-8 mb-2 text-purple-900" />
                        <p className="text-sm text-purple-900">Last Date</p>
                        <p className="font-bold text-purple-900">
                            <input
                                onChange={(e) => handleEventDataChange(e)}
                                type='date' name='end_date' />
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HeroSectionCentral;
