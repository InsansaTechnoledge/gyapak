import React, { useState } from 'react'
import StateMonumentCard from './StateMonumentCard';
import Gujarat from '../../../public/states/Gujarat.webp';
import Haryana from '../../../public/states/Haryana.jpg'
import Bihar from '../../../public/states/Bihar.jpg'
import Karnataka from '../../../public/states/Karnataka.png'
import Kerala from '../../../public/states/Kerala.jpg'
import Maharashtra from '../../../public/states/Maharashtra.jpg'
import Odisha from '../../../public/states/Odisha.jpg'
import Punjab from '../../../public/states/Punjab.jpg'
import Rajasthan from '../../../public/states/Rajasthan.jpg'
import Uttar_pradesh from '../../../public/states/Uttar_pradesh.webp'
import Madhya_Pradesh from '../../../public/states/Madhya_Pradesh.jpg'
import Tamil_Nadu from '../../../public/states/Tamil_Nadu.webp'
import Uttarakhand from '../../../public/states/Uttarakhand.webp'
import Andhra_Pradesh from '../../../public/states/Andhra_Pradesh.jpg'
import Himachal_Pradesh from '../../../public/states/Himachal_Pradesh.jpg'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useApi } from '../../Context/ApiContext';
import { formatDate } from '../../Utils/dateFormatter';

const StatesLanding = () => {

    const [region, setRegion] = useState('North');
    const { apiBaseUrl, setApiBaseUrl, setServerError } = useApi();


    const stateImages = {
        "Gujarat": Gujarat,
        "Haryana": Haryana,
        "Bihar": Bihar,
        "Karnataka": Karnataka,
        "Kerala": Kerala,
        "Maharashtra": Maharashtra,
        "Odisha": Odisha,
        "Punjab": Punjab,
        "Rajasthan": Rajasthan,
        "Uttar Pradesh": Uttar_pradesh,
        "Madhya Pradesh": Madhya_Pradesh,
        "Tamil Nadu": Tamil_Nadu,
        "Uttarakhand": Uttarakhand,
        "Andhra Pradesh": Andhra_Pradesh,
        "Himachal Pradesh": Himachal_Pradesh
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
                        Explore upcoming government exams 2025
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
                        <StateMonumentCard state={state} region={region} img={stateImages[state]} />
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