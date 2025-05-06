import React, { useState } from 'react'
import StateMonumentCard from './StateMonumentCard';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useApi } from '../../Context/ApiContext';
import { formatDate } from '../../Utils/dateFormatter';

const StatesLanding = () => {

    const [region, setRegion] = useState('North');
    const { apiBaseUrl, setApiBaseUrl, setServerError } = useApi();

    const stateImages = {
        "Gujarat": "/states/Gujarat.png",
        "Haryana": "/states/Haryana.png",
        "Bihar": "/states/Bihar.png",
        "Karnataka": "/states/Karnataka.png",
        "Kerala": "/states/Kerala.png",
        "Maharashtra": "/states/Maharashtra.png",
        "Odisha": "/states/Odisha.png",
        "Punjab": "/states/Punjab.png",
        "Rajasthan": "/states/Rajasthan.png",
        "Uttar Pradesh": "/states/Uttar_pradesh.png",
        "Madhya Pradesh": "/states/Madhya Pradesh.png",
        "Tamil Nadu": "/states/Tamil_Nadu.png",
        "Uttarakhand": "/states/Uttarakhand.png",
        "Andhra Pradesh": "/states/Andhra_Pradesh.png",
        "Himachal Pradesh": "/states/Himachal_Pradesh.png",
    }

    const statesByRegion = {
        'North': [
            "Haryana",
            "Himachal Pradesh",
            "Punjab",
            "Uttar Pradesh",
            "Uttarakhand"
        ],
        'South': [
            "Andhra Pradesh",
            "Karnataka",
            "Kerala",
            "Tamil Nadu"
        ],
        'East': [
            "Bihar",
            "Odisha"
        ],
        'West': [
            "Gujarat",
            "Rajasthan",
            "Maharashtra",
            "Madhya Pradesh"
        ]
    };

    const fetchLastUpdated = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/api/event/lastupdated`);
            // setLastUpdated(formatDate(response.data.data));
            return formatDate(response.data.data);
        } catch (error) {
            if (error.response) {
                if (error.response.status >= 500 && error.response.status < 600) {
                    console.error("🚨 Server Error:", error.response.status, error.response.statusText);
                    const url = CheckServer();
                    setApiBaseUrl(url),
                        setServerError(error.response.status);
                    fetchLastUpdated();
                }
                else {
                    console.error('Error fetching state count:', error);
                }
            }
            else {
                console.error('Error fetching state count:', error);
            }
        }
    };

    const { data: lastUpdated, isLoading2 } = useQuery({
        queryKey: ["lastUpdated"],
        queryFn: fetchLastUpdated,
        staleTime: Infinity, // ✅ Data never becomes stale, preventing automatic refetch
        cacheTime: 24 * 60 * 60 * 1000, // ✅ Keeps cache alive for 24 hours in memory
        refetchOnMount: true, // ✅ Prevents refetch when component mounts again
        refetchOnWindowFocus: false, // ✅ Prevents refetch when switching tabs
    });

    if (isLoading2) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div>
            <div className='flex justify-between flex-col  lg:flex-row'>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                        State government authorities
                    </h1>
                    <p className="text-xs sm:text-sm">
                        {`Explore upcoming government exams ${new Date().getFullYear()}`}
                    </p>
                </div>
                <div className='flex space-x-2 mt-10 lg:mt-0 flex-wrap'>
                    <button
                        className={`mt-5 rounded-full border font-semibold ${region === 'North' ? 'bg-purple-200 text-purple-900 border-purple-900' : 'bg-white text-black border-black'} h-min py-1 px-5`}
                        onClick={() => (setRegion("North"))}
                    >
                        North
                    </button>
                    <button
                        className={`mt-5 rounded-full border font-semibold ${region === 'South' ? 'bg-purple-200 text-purple-900 border-purple-900' : 'bg-white text-black border-black'} h-min py-1 px-5`}
                        onClick={() => (setRegion("South"))}
                    >South
                    </button>
                    <button
                        className={`mt-5 rounded-full border font-semibold ${region === 'East' ? 'bg-purple-200 text-purple-900 border-purple-900' : 'bg-white text-black border-black'} h-min py-1 px-5`}
                        onClick={() => (setRegion("East"))}
                    >East
                    </button>
                    <button
                        className={`mt-5 rounded-full border font-semibold ${region === 'West' ? 'bg-purple-200 text-purple-900 border-purple-900' : 'bg-white text-black border-black'} h-min py-1 px-5`}
                        onClick={() => (setRegion("West"))}
                    >West
                    </button>
                </div>
            </div>
            <div className='grid lg:grid-cols-3 xl:grid-cols-4 md:grid-cols-2 grid-cols-1 mt-12 gap-10'>
                {
                    statesByRegion[region].map(state => (
                        <StateMonumentCard
                            key={state}
                            state={state}
                            region={region}
                            img={stateImages[state]}
                        />
                    ))
                }
            </div>
            <div className="mt-6 sm:mt-8 text-center">
                <p className="text-xs sm:text-sm text-purple-600">
                    Last updated: {lastUpdated}
                </p>
            </div>
        </div>
    )
}

export default StatesLanding