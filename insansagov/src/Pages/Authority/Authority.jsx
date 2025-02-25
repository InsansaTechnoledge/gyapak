import React, { useState, useEffect } from 'react'
import OpportunityCarouselCard from '../../Components/OpportunityCarousel/OpportunityCarouselCard'
import ViewMoreButton from '../../Components/Buttons/ViewMoreButton';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import AuthorityLatestUpdates from '../../Components/Authority/AuthorityLatesUpdate';
import RelatedAuthorities from '../../Components/Authority/RelatedAuthorities';
import { RingLoader } from 'react-spinners';
import no_data_image from '../../assets/Landing/no_data.jpg'
import { Helmet } from 'react-helmet-async';
import { useApi } from '../../Context/ApiContext';

const cards = [
    { title: 'Exam Schedule 2025', authority: 'Education Board', latestUpdate: '1/1/2025' },
    { title: 'Result Announcement', authority: 'University XYZ', latestUpdate: '12/25/2024' },
    { title: 'Application Deadline', authority: 'Scholarship Authority', latestUpdate: '12/15/2024' },
    { title: 'Course Enrollment', authority: 'Online Academy', latestUpdate: '11/30/2024' },
    { title: 'Internship Program', authority: 'Tech Corp', latestUpdate: '11/20/2024' },
    { title: 'Job Fair 2025', authority: 'Career Center', latestUpdate: '10/25/2024' },
    { title: 'Exam Schedule 2025', authority: 'Education Board', latestUpdate: '1/1/2025' },
    { title: 'Result Announcement', authority: 'University XYZ', latestUpdate: '12/25/2024' },
    { title: 'Application Deadline', authority: 'Scholarship Authority', latestUpdate: '12/15/2024' },
    { title: 'Course Enrollment', authority: 'Online Academy', latestUpdate: '11/30/2024' },
    { title: 'Internship Program', authority: 'Tech Corp', latestUpdate: '11/20/2024' },
    { title: 'Job Fair 2025', authority: 'Career Center', latestUpdate: '10/25/2024' }
];


const Authority = () => {
    const { apiBaseUrl } = useApi();
    const [isExpanded, setIsExpanded] = useState(false);
    const [organization, setOrganization] = useState();
    const [latestUpdates, setLatestUpdates] = useState();
    const location = useLocation();
    const [events, setEvents] = useState();
    const [filteredEvents, setFilteredEvents] = useState();
    const [relatedOrganizations, setRelatedOrganizations] = useState();

    // Parse the query parameters
    const queryParams = new URLSearchParams(location.search);
    const name = queryParams.get("name"); // Access the 'name' parameter

    useEffect(() => {

        const fetchOrganization = async () => {
            const response = await axios.get(`${apiBaseUrl}/api/organization/${name}`);

            if (response.status === 201) {
                setOrganization(response.data.organization);
                setRelatedOrganizations(response.data.relatedOrganizations.filter(org => org._id !== response.data.organization._id));

                const sortedUpdates = response.data.events.sort((a, b) => {
                    const dateA = new Date(a.notificationDate);
                    const dateB = new Date(b.notificationDate);

                    // Check if the dates are valid, in case some of the dates are 'Not specified'
                    if (isNaN(dateA) || isNaN(dateB)) {
                        return 0; // Leave invalid dates in their original order
                    }

                    return dateB - dateA; // Descending order
                });

                setLatestUpdates(sortedUpdates);
                setEvents(sortedUpdates);
                setFilteredEvents(sortedUpdates.slice(0, 6));



            }
        }

        fetchOrganization();
    }, [location])



    const handleToggle = () => {
        setIsExpanded(!isExpanded);
        if (!isExpanded) {
            setFilteredEvents(events);
        }
        else {
            setFilteredEvents(events.slice(0, 6));
        }
    };

    const visibleCards = isExpanded ? cards : cards.slice(0, 6);

    if (!organization) {
        return <div className='w-full h-screen flex justify-center'>
            <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />
        </div>
    }

    return (
        <>
            <Helmet>
                <title>gyapak</title>
                <meta name="description" content="gyapak.in is a trusted source for the latest government exam updates, including exam dates, notifications, admit cards, and results for both central and state government departments. Stay updated with real-time information on competitive exams, application deadlines, and result announcements!" />
                <meta name="keywords" content="government exams, exam dates, admit cards, results, central government jobs, state government jobs, competitive exams, government jobs" />
                <meta property="og:title" content="gyapak" />
                <meta property="og:description" content="Find the latest updates on government exams, admit cards, results, and application deadlines for central and state government jobs." />
            </Helmet>
            <div className='pt-28'>
                <div className='flex flex-col justify-center mb-20'>
                    <img src={`data:image/png;base64,${organization.logo}`} className='w-32 self-center mb-5' />
                    <h1 className='text-3xl self-center font-bold mb-5'>{organization.name}</h1>
                    <div className='self-center text-center'>{organization.description}</div>
                </div>

                {
                    filteredEvents.length > 0
                        ?
                        <>
                            <AuthorityLatestUpdates latestUpdates={latestUpdates} name={organization.abbreviation} />
                            <div className='font-bold text-2xl flex items-center mb-5'>Events under {organization.name}</div>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-7 mb-10'>
                                {filteredEvents && filteredEvents.map((item, index) => (
                                    <OpportunityCarouselCard index={index} item={item} authority={organization.abbreviation} />
                                ))}
                            </div>
                            {
                                events.length > 6
                                    ?
                                    <div className='flex justify-center mb-20'>
                                        <ViewMoreButton content={isExpanded ? "view less ▲" : "View More ▼"}
                                            onClick={handleToggle} />
                                    </div>
                                    :
                                    null
                            }
                        </>
                        :
                        <>
                            <h3 className='text-center font-bold text-lg mb-5'>No Active events right now!</h3>
                            <img src={no_data_image} className='w-5/12 mx-auto' />
                        </>
                }

                {
                    relatedOrganizations && relatedOrganizations.length > 0
                        ?
                        <>
                            <h1 className='text-2xl xl:text-3xl font-bold text-gray-900 mb-5'>
                                Related Authorities
                            </h1>
                            <RelatedAuthorities organizations={relatedOrganizations} />
                        </>
                        :
                        null
                }
                {/* <TopAuthorities titleHidden={true} /> */}
            </div>
        </>
    )
}

export default Authority
