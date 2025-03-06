import React, { useEffect, useState } from 'react';
import TopAuthoritiesCard from './TopAuthoritiesCard';
import ViewMoreButton from '../Buttons/ViewMoreButton';


const RelatedAuthorities = (props) => {
    const [organizations, setOrganizations] = useState();
    const [displayCount, setDisplayCount] = useState(8); // Initial count of displayed items

    useEffect(()=>{
        if(props.organizations){
            // console.log("rel",props.organizations);
            setOrganizations(props.organizations);
        }
    },[props]);

    if(!organizations){
        return <div>Loading!...</div>;
    }

    // Handle "View More"
    const handleViewMore = () => {
        setDisplayCount((prevCount) => Math.min(prevCount + 4, organizations.length));
    };

    // Handle "Close All"
    const handleCloseAll = () => {
        setDisplayCount(8);
    };

    

    return (
        <>
            <div className='grid grid-cols-2 lg:grid-cols-4 mb-5 gap-4'>
                {/* {visibleCards} */}
                {
                    organizations && organizations.slice(0, displayCount).map((org,key) => {
                        return <TopAuthoritiesCard key={key} name={org.abbreviation} logo={org.logo} id={org._id}/>
                    })
                }
            </div>
            <div className='flex justify-center gap-4 mb-20'>
                {/* Show "View More" button only if there are more items to load */}
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
            </div>
        </>
    );
};

export default RelatedAuthorities;
