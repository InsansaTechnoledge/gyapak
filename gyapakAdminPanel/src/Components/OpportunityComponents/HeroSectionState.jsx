import React, { useEffect, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import SearchableDropdown from '../SearchableDropdown';

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
            <div className="mb-4">
                <SearchableDropdown
                    options={states || []}
                    placeholder="Select state"
                    onSelect={(e) => setStateId(e.target.value)}
                    value={stateId || ''}
                    name="state_id"
                    displayKey="name"
                    valueKey="_id"
                    searchKeys={['name']}
                    className="max-w-md mx-auto"
                />
            </div>
            {
                stateId && organizations
                ?
                <>
                    <div className="mb-4">
                        <SearchableDropdown
                            options={organizations || []}
                            placeholder="Select organization"
                            onSelect={handleEventDataChange}
                            value={eventData?.organization_id || ''}
                            name="organization_id"
                            displayKey={(org) => `${org.name}, ${org.abbreviation}`}
                            valueKey="_id"
                            searchKeys={['name', 'abbreviation']}
                            className="max-w-md mx-auto"
                        />
                    </div>
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
