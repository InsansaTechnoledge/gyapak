import React, { lazy, Suspense, useEffect, useState } from 'react'
import axios from 'axios';
import API_BASE_URL from '../../Pages/config';
import { RingLoader } from 'react-spinners';
const TopAuthoritiesCard = lazy(() => import('./TopAuthoritiesCard'));
const ViewMoreButton = lazy(() => import('../Buttons/ViewMoreButton'));


const MoreOrganizations = ({ currentOrganization }) => {
    const [moreOrganizations, setMoreOrganizations] = useState();
    const [displayCount, setDisplayCount] = useState(8); // Initial count of displayed items

    // Handle "View More"
    const handleViewMore = () => {
        setDisplayCount((prevCount) => Math.min(prevCount + 4, moreOrganizations.length));
    };

    // Handle "Close All"
    const handleCloseAll = () => {
        setDisplayCount(8);
    };

    useEffect(() => {
        const getMoreOrganizations = async () => {
            const response = await axios.get(`${API_BASE_URL}/api/organization/more/${currentOrganization.category}`);
            if (response.status === 201) {
                const data = response.data;

                const filteredData = data.filter(org => org._id != currentOrganization._id);
                setMoreOrganizations(filteredData);
            }
        }

        getMoreOrganizations();
    }, []);

    if (!moreOrganizations) {
        return <div className='w-full flex flex-col justify-center mb-10'>
            <div className='flex justify-center'>
                <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />

            </div>
        </div>
    }

    if(moreOrganizations.length===0){
        return null;
    }

    return (
        <>
        <h1 className='text-2xl xl:text-3xl font-bold text-gray-900 mb-10'>
            More Organizations
        </h1>
            <div className='grid grid-cols-4 mb-5 gap-4'>
                            <Suspense fallback={<div>Loading...</div>}>
                            {
                                moreOrganizations.slice(0, displayCount).map((org, key) => (
                                    <TopAuthoritiesCard key={key} name={org.abbreviation} logo={org.logo} id={org._id} />
                                ))
                            }
                            </Suspense>
                        </div>
                        <div className='flex justify-center gap-4 mb-20'>
                            {/* Show "View More" button only if there are more items to load */}
                            <Suspense fallback={<div>Loading...</div>}>
                            {displayCount < moreOrganizations.length && (
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

export default MoreOrganizations