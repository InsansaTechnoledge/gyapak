import React, { lazy, Suspense, useEffect, useState } from 'react';
const TopAuthoritiesCard = lazy(() => import('./TopAuthoritiesCard'));
const ViewMoreButton = lazy(() => import('../Buttons/ViewMoreButton'));
import axios from 'axios';
import { RingLoader } from 'react-spinners';
import { debounce } from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { useApi, CheckServer } from '../../Context/ApiContext';

const TopAuthorities = (props) => {
    const { apiBaseUrl, setApiBaseUrl, setServerError } = useApi();
    // const [organizations, setOrganizations] = useState([]);
    const [displayCount, setDisplayCount] = useState(8); // Initial count of displayed items

    const fetchLogos = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/api/organization/logo`);
            if (response.status === 200) {
                // setOrganizations(response.data);
                // console.log(response.data);
                return response.data;
            }
        } catch (error) {
            console.error("Error fetching organizations:", error);
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
    // Fetch data from API
    // useEffect(() => {

    //     fetchLogos();
    // }, []);

    const { data: organizations, isLoading } = useQuery({
        queryKey: ["fetchLogos", apiBaseUrl],
        queryFn: fetchLogos,
        staleTime: Infinity,
        cacheTime: 24 * 60 * 60 * 1000,
        refetchOnMount: true,
        refetchOnWindowFocus: false
    });

    // Handle "View More"
    const handleViewMore = () => {
        setDisplayCount((prevCount) => Math.min(prevCount + 4, organizations.length));
    };

    // Handle "Close All"
    const handleCloseAll = () => {
        setDisplayCount(8);
    };

    if (isLoading || !organizations) {
        return <div className='w-full flex flex-col justify-center mb-10'>
            <h1 className='flex text-center text-2xl justify-center mb-5 font-bold'>Central authorities hosting upcoming government exams 2025</h1>
            <div className='flex justify-center'>
                <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />

            </div>
        </div>
    }

    return (
        <>
            {
                props.titleHidden
                    ? null
                    : <h1 className='flex text-center text-2xl justify-center mb-5 font-bold'>Central authorities hosting upcoming government exams 2025</h1>
            }
            <div className='grid grid-cols-2 lg:grid-cols-4 mb-5 gap-4'>
                <Suspense fallback={<div><div className='w-full h-screen flex justify-center'>
                    <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />
                </div></div>}>
                    {
                        organizations.length > 0 && organizations.slice(0, displayCount).map((org, key) => (
                            <TopAuthoritiesCard key={key} name={org.abbreviation} logo={org.logo} id={org._id} />
                        ))
                    }
                </Suspense>
            </div>
            <div className='flex justify-center gap-4 mb-20'>
                {/* Show "View More" button only if there are more items to load */}
                <Suspense fallback={<div><div className='w-full h-screen flex justify-center'>
                    <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />
                </div></div>}>
                    {displayCount < organizations.length && (
                        <ViewMoreButton
                            content="View More ▼"
                            onClick={handleViewMore}
                        />
                    )}

                    {/* Always show "Close All" button if more than 8 items are displayed */}
                    {displayCount > 8 && (
                        <ViewMoreButton
                            content="Close All ▲"
                            onClick={handleCloseAll}
                        />
                    )}
                </Suspense>
            </div>
        </>
    );
};

export default TopAuthorities;
