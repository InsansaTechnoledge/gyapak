import React, { useState, useEffect } from 'react'
import OpportunityCarouselCard from '../../Components/OpportunityCarousel/OpportunityCarouselCard'
import ViewMoreButton from '../../Components/Buttons/ViewMoreButton';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import AuthorityLatestUpdates from '../../Components/Authority/AuthorityLatesUpdate';
import RelatedAuthorities from '../../Components/Authority/RelatedAuthorities';
import { RingLoader } from 'react-spinners';
import no_data_image from '../../assets/Landing/no_data.jpg'
import { Helmet } from 'react-helmet-async';
import { CheckServer, useApi } from '../../Context/ApiContext';
import { useQuery } from '@tanstack/react-query';
import ExamCalendar from '../../Components/Calendar/ExamCalendar';
import { set } from 'lodash';
import FAQ from '../../Components/FAQ';

const Authority = () => {
    const { apiBaseUrl, setApiBaseUrl, setServerError } = useApi();
    const [isExpanded, setIsExpanded] = useState(false);
    const [organization, setOrganization] = useState();
    const [latestUpdates, setLatestUpdates] = useState();
    const location = useLocation();
    const [events, setEvents] = useState();
    const [filteredEvents, setFilteredEvents] = useState();
    const [relatedOrganizations, setRelatedOrganizations] = useState();
    const [calendarDisplay, setCalendarDidsplay] = useState(false);

    const metaTitle = location.pathname.split('/')[2];

    // const FAQ = React.lazy(() => import('../../Components/FAQ/FAQ'));

    // Parse the query parameters
    const queryParams = new URLSearchParams(location.search);
    // const name = queryParams.get("name"); // Access the 'name' parameter
    const { name } = useParams();
    const fetchOrganization = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/api/organization/${name}`);
            if (response.status === 201) {
                setOrganization(response.data.organization);
                setRelatedOrganizations(response.data.relatedOrganizations.filter(org => org._id !== response.data.organization._id));
                const sortedUpdates = response.data.events.sort((a, b) => {
                    const dateA = new Date(a.updatedAt);
                    const dateB = new Date(b.updatedAt);

                    // Check if the dates are valid, in case some of the dates are 'Not specified'
                    if (isNaN(dateA) || isNaN(dateB)) {
                        return 0; // Leave invalid dates in their original order
                    }

                    return dateB - dateA; // Descending order
                });

                setLatestUpdates(sortedUpdates);
                setEvents(sortedUpdates);
                setFilteredEvents(sortedUpdates.slice(0, 6));
                return response.data;

            }
        }
        catch (error) {
            console.log(error.response);
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
    }

    const { data: data, isLoading } = useQuery({
        queryKey: ["fetchOrganization/" + name, apiBaseUrl],
        queryFn: fetchOrganization,
        staleTime: Infinity,
        cacheTime: 24 * 60 * 60 * 1000,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (data) {
            setRelatedOrganizations(data.relatedOrganizations.filter(org => org._id !== data.organization._id));

            const sortedUpdates = data.events.sort((a, b) => {
                const dateA = new Date(a.updatedAt);
                const dateB = new Date(b.updatedAt);

                if (isNaN(dateA) || isNaN(dateB)) {
                    return 0;
                }

                return dateB - dateA;
            });

            setLatestUpdates(sortedUpdates);
            setEvents(sortedUpdates);
            setFilteredEvents(sortedUpdates.slice(0, 6));

            setOrganization(data.organization);
        }
    }, [data]);



    const handleToggle = () => {
        setIsExpanded(!isExpanded);
        if (!isExpanded) {
            setFilteredEvents(events);
        }
        else {
            setFilteredEvents(events.slice(0, 6));
        }
    };

    if (isLoading || !organization) {
        return <div className='w-full h-screen flex justify-center'>
            <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />
        </div>
    }

    const toggleCalendarDisplay = () => {
        if (calendarDisplay) {
            document.getElementById('view-calendar').innerHTML = 'View annual calendar'
        }
        else {
            document.getElementById('view-calendar').innerHTML = 'Hide annual calendar'
        }
        setCalendarDidsplay(!calendarDisplay);

    }

    return (
        <>
            <Helmet>
                <title>{metaTitle}</title>
                <meta name="description" content="gyapak.in is a trusted source for the latest government exam updates, including exam dates, notifications, admit cards, and results for both central and state government departments. Stay updated with real-time information on competitive exams, application deadlines, and result announcements!" />
                <meta name="keywords" content="government competitive exams after 12th,government organisations, exam sarkari results, government calendar,current affairs,top exams for government jobs in india,Upcoming Government Exams" />
                <meta property="og:title" content="gyapak" />
                <meta property="og:description" content="Find the latest updates on government exams, admit cards, results, and application deadlines for central and state government jobs." />
            </Helmet>
            <div className='pt-28 bg-red'>
                <div className='flex flex-col justify-center mb-20'>
                    <img src={`data:image/png;base64,${organization.logo}`} className='w-32 self-center mb-5' />
                    <h1 className='text-3xl self-center font-bold mb-5'>{organization.name}</h1>
                    <div className='self-center text-center'>{organization.description}</div>
                </div>

                {
                    organization.calendar
                        ?
                        <div className='flex justify-end mb-10'>
                            <button
                                id='view-calendar'
                                onClick={toggleCalendarDisplay}
                                className='py-3 px-4 rounded-md bg-purple-700 text-white font-medium'>
                                View annual calendar
                            </button>

                        </div>
                        :
                        null
                }
                {
                    calendarDisplay
                        ?
                        <ExamCalendar organizationId={organization._id} />
                        :
                        null
                }

                {
                    filteredEvents.length > 0
                        ?
                        <>
                            <AuthorityLatestUpdates latestUpdates={latestUpdates} name={organization.abbreviation} organization={organization.name} />
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
                            <h3 className='text-center font-bold text-lg mb-5'>No Active events for {organization.abbreviation} right now!</h3>
                            <img src={no_data_image} className='w-5/12 mx-auto' />
                        </>
                }

                {
                    organization._id && (
                        <div className="px-4 md:px-16 lg:px-64 py-16">
                            <FAQ orgId={organization._id} title={`frequently asked questions for ${organization.abbreviation}`} />
                        </div>
                    )
                }

                {
                    relatedOrganizations && relatedOrganizations.length > 0
                        ?
                        <>
                            <h1 className='text-2xl xl:text-3xl font-bold text-gray-900 mb-5'>
                                Related Authorities for {organization.abbreviation}
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
