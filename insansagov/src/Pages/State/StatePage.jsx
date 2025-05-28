import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import RelatedAuthorities from '../../Components/Authority/RelatedAuthorities';
import BackButton from '../../Components/BackButton/BackButton';
import { RingLoader } from 'react-spinners';
import no_data_image from '../../assets/Landing/no_data.jpg';
import { Helmet } from 'react-helmet-async';
import { useApi, CheckServer } from '../../Context/ApiContext';
import { useQuery } from '@tanstack/react-query';

const StatePage = () => {
    const { apiBaseUrl, setApiBaseUrl, setServerError } = useApi();
    const [isExpanded, setIsExpanded] = useState(false);
    const location = useLocation();
    const [logo, setLogo] = useState();
    const [organizations, setOrganizations] = useState();

    const stateTitle = location.pathname.split('/').at(-1);

    // Parse the query parameters
    const { keyword } = useParams();
    const state = keyword?.split("-in-")[1]?.replace("-for-12th-pass", "");


    const fetchStateData = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/api/state/name/${state}`);
            if (response.status === 201) {
                // console.log(response.data);
                setLogo(response.data.stateData.logo);
                setOrganizations(response.data.organizations);
                return response.data;
            }
        } catch (error) {
            console.error('Error fetching state data:', error);
            if (error.response || error.request) {
                if ((error.response && error.response.status >= 500 && error.response.status < 600) || (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND' || error.code === "ERR_NETWORK")) {
                    const url = await CheckServer();
                    setApiBaseUrl(url),
                        setServerError(error.response.status);
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

    const { data: data, isLoading } = useQuery({
        queryKey: ["fetchStateData/" + state, apiBaseUrl],
        queryFn: fetchStateData,
        staleTime: Infinity, // ✅ Data never becomes stale, preventing automatic refetch
        cacheTime: 24 * 60 * 60 * 1000, // ✅ Keeps cache alive for 24 hours in memory
        refetchOnMount: true, // ✅ Prevents refetch when component mounts again
        refetchOnWindowFocus: false, // ✅ Prevents refetch when switching tabs
    })

    useEffect(() => {
        if (data) {
            setLogo(data.stateData.logo);
            setOrganizations(data.organizations);
        }
    }, [data])

    // useEffect(() => {


    //     fetchStateData();
    // }, [location]);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    if (!organizations) {
        return <div className='w-full h-screen flex justify-center'>
            <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />
        </div>
    }

    return (
        <>
            <Helmet>
                <title>{`state-${stateTitle}`}</title>
                <meta name="description" content="gyapak.in is a trusted source for the latest government exam updates, including exam dates, notifications, admit cards, and results for both central and state government departments. Stay updated with real-time information on competitive exams, application deadlines, and result announcements!" />
                <meta name="keywords" content="government competitive exams after 12th,government organisations, exam sarkari results, government calendar,current affairs,top exams for government jobs in india,Upcoming Government Exams" />
                <meta property="og:title" content="gyapak" />
                <meta property="og:description" content="Find the latest updates on government exams, admit cards, results, and application deadlines for central and state government jobs." />
            </Helmet>
            <div className='pt-28'>
                <BackButton />
                <div className='flex flex-col justify-center mb-20'>
                    <img src={`data:image/png;base64,${logo}`} className='w-44 self-center' alt={`${state} logo`} />
                    <h1 className='text-3xl self-center font-bold'>{state}</h1>
                </div>

                {
                    organizations && organizations.length > 0
                        ?
                        <>
                            <h1 className='font-bold text-2xl text-center mb-10'>Government jobs in {state} for 12th pass</h1>
                            <RelatedAuthorities organizations={organizations} />
                        </>
                        :
                        <>
                            <h3 className='text-center font-bold text-lg mb-5'>No government jobs in {state} for 12th pass!</h3>
                            <img src={no_data_image} className='w-5/12 mx-auto' />
                        </>
                }
            </div>
        </>
    );
};

export default StatePage;
