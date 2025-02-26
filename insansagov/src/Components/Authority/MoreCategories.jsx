import React, { lazy, Suspense, useEffect, useState } from 'react'
import axios from 'axios';
const TopCategoriesCard = lazy(() => import('../Categories/TopCategoriesCard'));
const ViewMoreButton = lazy(() => import('../Buttons/ViewMoreButton'));

import { RingLoader } from 'react-spinners';
import { useApi } from '../../Context/ApiContext';
import { useQuery } from '@tanstack/react-query';

const MoreCategories = ({ currentCategory }) => {
    const { apiBaseUrl, setApiBaseUrl } = useApi();
    // const [moreCategories, setMoreCategories] = useState();
    const [displayCount, setDisplayCount] = useState(8); // Initial count of displayed items

    // Handle "View More"
    const handleViewMore = () => {
        setDisplayCount((prevCount) => Math.min(prevCount + 4, moreCategories.length));
    };

    // Handle "Close All"
    const handleCloseAll = () => {
        setDisplayCount(8);
    };

    const getMoreCategories = async () => {
        try {

            const response = await axios.get(`${apiBaseUrl}/api/category/getCategories/`);
            if (response.status === 201) {
                console.log(response.data);
                const data = response.data;
                const filteredData = data.filter(cat => cat._id != currentCategory._id);
                return filteredData;
            }
        }
        catch(error){
            if (error.response) {
                if (error.response.status >= 500 && error.response.status < 600) {
                    console.error("🚨 Server Error:", error.response.status, error.response.statusText);
                    const url=CheckServer();
                    setApiBaseUrl(url);
                    getMoreCategories();
                }
                else{
                    console.error('Error fetching state count:', error);
                }
            }
                else {
                    console.error('Error fetching state count:', error);
            }
        }
    }
    // useEffect(() => {

    //     getMoreCategories();
    // }, []);

    const { data: moreCategories, isLoading } = useQuery({
        queryKey: ["moreCategories"],
        queryFn: getMoreCategories,
        staleTime: Infinity, // ✅ Data never becomes stale, preventing automatic refetch
        cacheTime: 24 * 60 * 60 * 1000, // ✅ Keeps cache alive for 24 hours in memory
        refetchOnMount: true, // ✅ Prevents refetch when component mounts again
        refetchOnWindowFocus: false, // ✅ Prevents refetch when switching tabs
    })

    if (isLoading || !moreCategories) {
        return <div className='w-full flex flex-col justify-center mb-10'>
            <div className='flex justify-center'>
                <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />

            </div>
        </div>
    }

    if (moreCategories.length === 0) {
        return null;
    }

    return (
        <>
            <h1 className='text-2xl xl:text-3xl font-bold text-gray-900 mb-10'>
                More Categories
            </h1>
            <div className='grid grid-cols-4 mb-5 gap-4'>
                <Suspense fallback={<div><div className='w-full h-screen flex justify-center'>
                    <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />
                </div></div>}>
                    {
                        moreCategories.slice(0, displayCount).map((category, key) => (
                            <TopCategoriesCard key={key} name={category.category} logo={category.logo} id={category._id} />
                        ))
                    }
                </Suspense>
            </div>
            <div className='flex justify-center gap-4 mb-20'>
                {/* Show "View More" button only if there are more items to load */}
                <Suspense fallback={<div><div className='w-full h-screen flex justify-center'>
                    <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />
                </div></div>}>
                    {displayCount < moreCategories.length && (
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

export default MoreCategories