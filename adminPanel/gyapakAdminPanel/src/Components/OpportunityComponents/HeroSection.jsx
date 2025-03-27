import React, { useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const HeroSection = ({ organizations, handleEventDataChange, eventData }) => {
    
    useEffect(()=>{
        const fetchOrganizations = async () => {
            const response = await axios.get(`${API_BASE_URL}/api/v1/organizations/central-organizations`);
            if(response.status(200)){
                console.log(response.data);
            }
        }

        fetchOrganizations();
    },[])
    
    return (
        <div className="text-center mb-32">
            <h2 className="text-purple-700 text-lg mb-4">
                {
                    // organizations.map(org => {

                    // })
                }
            </h2>
            <div className="inline-block relative mx-auto">
                <h1 className="
                
                text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent mb-12">
                    <input
                        onChange={(e) => handleEventDataChange(e)}
                        type='text' name='name' value={eventData?.organization} className='focus:border-4 border-purple-700 border-2 rounded-md' />
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

export default HeroSection;
