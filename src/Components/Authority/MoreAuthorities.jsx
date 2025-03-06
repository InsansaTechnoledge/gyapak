import React, { lazy, Suspense, useEffect, useState } from 'react'
import axios from 'axios';
const TopAuthoritiesCard = lazy(() => import('./TopAuthoritiesCard'));
const ViewMoreButton = lazy(() => import('../Buttons/ViewMoreButton'));
import { RingLoader } from 'react-spinners';
import RelatedStatesCard from '../States/RelatedStatesCard';
import { useApi, CheckServer } from '../../Context/ApiContext';
import { useQuery } from '@tanstack/react-query';

const MoreAuthorities = ({ currentAuthority }) => {
    const { apiBaseUrl, setApiBaseUrl } = useApi();
    // const [moreAuthorities, setMoreAuthorities] = useState();
    const [displayCount, setDisplayCount] = useState(8); // Initial count of displayed items

    // Handle "View More"
    const handleViewMore = () => {
        setDisplayCount((prevCount) => Math.min(prevCount + 4, moreAuthorities.length));
    };

    // Handle "Close All"
    const handleCloseAll = () => {
        setDisplayCount(8);
    };
    const getMoreAuthorities = async () => {
        try {

            const response = await axios.get(`${apiBaseUrl}/api/state/more/`);
            if (response.status === 201) {

                const data = response.data;
                const filteredData = data.filter(auth => auth._id !== currentAuthority._id);
                return filteredData;
            }
        }
        catch (error) {
            if (error.response || error.request) {
                if ((error.response && error.response.status >= 500 && error.response.status < 600) || (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND' || error.code === "ERR_NETWORK")) {
                    const url = await CheckServer();
                    setApiBaseUrl(url);
                }
                else {
                    console.error('Error fetching state count:', error);
                }
            }
            else {
                console.error('Error fetching state count:', error);
            }
        }
    }
    // useEffect(() => {

    //     getMoreAuthorities();
    // }, []);

    const { data: moreAuthorities, isLoading } = useQuery({
        queryKey: ["moreAuthorities", apiBaseUrl],
        queryFn: getMoreAuthorities,
        staleTime: Infinity, // ✅ Data never becomes stale, preventing automatic refetch
        cacheTime: 24 * 60 * 60 * 1000, // ✅ Keeps cache alive for 24 hours in memory
        refetchOnMount: true, // ✅ Prevents refetch when component mounts again
        refetchOnWindowFocus: false, // ✅ Prevents refetch when switching tabs
    })

    if (isLoading || !moreAuthorities) {
        return <div className='w-full flex flex-col justify-center mb-10'>
            <div className='flex justify-center'>
                <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />

            </div>
        </div>
    }

    if (moreAuthorities.length === 0) {
        return null;
    }


    return (
        <>
            <h1 className='text-2xl xl:text-3xl font-bold text-gray-900 mb-10'>
                More Authorities
            </h1>
            <div className='grid grid-cols-4 mb-5 gap-4'>
                <Suspense fallback={<div><div className='w-full h-screen flex justify-center'>
                    <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />
                </div></div>}>
                    {
                        moreAuthorities.slice(0, displayCount).map((auth, key) => (
                            <RelatedStatesCard key={key} name={auth.name} logo={auth.logo} id={auth._id} />
                        ))
                    }
                </Suspense>
            </div>
            <div className='flex justify-center gap-4 mb-20'>
                {/* Show "View More" button only if there are more items to load */}
                <Suspense fallback={<div><div className='w-full h-screen flex justify-center'>
                    <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />
                </div></div>}>
                    {displayCount < moreAuthorities.length && (
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
    )
}

export default MoreAuthorities