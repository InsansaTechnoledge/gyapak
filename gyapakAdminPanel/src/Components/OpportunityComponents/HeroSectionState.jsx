import React, { useEffect, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const HeroSectionState = ({handleEventDataChange, eventData, setStateId, stateId }) => {
    const [organizations, setOrganizations] = useState();
    const [states, setStates] = useState();

    useEffect(()=>{
        const fetchStates = async () => {
            const response = await axios.get(`${API_BASE_URL}/api/v1/states/all`);
            if(response.status===200){
                setStates(response.data);
            }
        }

        fetchStates();
    })

    useEffect(()=>{
        const fetchOrganizations = async () => {
            const response = await axios.get(`${API_BASE_URL}/api/v1/organizations/state?stateId=${stateId}`);
            if(response.status==200){
                setOrganizations(response.data);
            }
        }

        if(stateId){
            fetchOrganizations();
        }

    },[stateId])
    
    if(!states){
        return (<div>
            Loading...
        </div>)
    }

    return (
        <div className="text-center mb-16">
            <h2 className="text-purple-700 text-lg mb-4">
                <select 
                name='state_id'
                className='border-2 rounded-md border-purple-700'
                onChange={(e)=>{
                    setStateId(e.target.value)
                    }}>
                    <option value={""}>select state</option>
                    {
                        states.map(state => (
                            <option key={state._id} value={state._id}>{state.name}</option>
                        ))
                    }
                </select>
            </h2>
            {
                stateId && organizations
                ?
                <>
                    <h2 className="text-purple-700 text-lg mb-4">
                        <select 
                        name='organization_id'
                        className='border-2 rounded-md border-purple-700'
                        onChange={(e)=>handleEventDataChange(e)}>
                            <option value={""}>select organization</option>
                            {
                                organizations.map(org => (
                                    <option key={org._id} value={org._id} >{org.name}, {org.abbreviation}</option>
                                ))
                            }
                        </select>
                    </h2>
                    <div className="inline-block relative mx-auto">
                        {/* <h1 className="
                        text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent mb-12"> */}
                            <input
                                placeholder='Enter event'
                                onChange={(e) => handleEventDataChange(e)}
                                type='text' name='name' value={eventData?.organization} 
                                className='text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-purple-700 mb-12
                        w-full focus:border-4 border-purple-700 border-2 rounded-md' />
                        {/* </h1> */}

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
                </>
                :
                null
            }
        </div>
    );
};

export default HeroSectionState;
