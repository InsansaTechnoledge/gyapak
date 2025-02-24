import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import API_BASE_URL from '../config'
import axios from 'axios'
import RelatedAuthorities from '../../Components/Authority/RelatedAuthorities'
import BackButton from '../../Components/BackButton/BackButton'
import { RingLoader } from 'react-spinners'
import { Helmet } from 'react-helmet-async'



const Category = () => {

    const [isExpanded, setIsExpanded] = useState(false);
    const location = useLocation();
    const [logo, setLogo] = useState();
    const [organizations, setOrganizations] = useState();

    // Parse the query parameters
    const queryParams = new URLSearchParams(location.search);
    const name = queryParams.get("name"); // Access the 'name' parameter

    useEffect(() => {

        const fetchCategoryOrganization = async () => {
            const response = await axios.get(`${API_BASE_URL}/api/category/organizations/${name}`);
            if (response.status === 201) {
                // console.log(response.data);
                setLogo(response.data.categoryData.logo);
                setOrganizations(response.data.organizations.filter(org => org.logo));
            }
        }

        fetchCategoryOrganization();
    }, [location])

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
                <title>gyapak</title>
                <meta name="description" content="gyapak.in is a trusted source for the latest government exam updates, including exam dates, notifications, admit cards, and results for both central and state government departments. Stay updated with real-time information on competitive exams, application deadlines, and result announcements!" />
                <meta name="keywords" content="government exams, exam dates, admit cards, results, central government jobs, state government jobs, competitive exams, government jobs" />
                <meta property="og:title" content="gyapak" />
                <meta property="og:description" content="Find the latest updates on government exams, admit cards, results, and application deadlines for central and state government jobs." />
            </Helmet>
            <div className='pt-28'>
                <BackButton />
                <div className='flex flex-col justify-center mb-20'>
                    <img src={`data:image/png;base64,${logo}`} className='w-28 self-center mb-5' />
                    <h1 className='text-3xl self-center font-bold'>{name}</h1>
                </div>

                <h1 className='font-bold text-2xl text-center mb-10'>Organizations under {name}</h1>
                {
                    organizations && organizations.length > 0
                        ?
                        <RelatedAuthorities organizations={organizations} />
                        :
                        <div className='text-center'>No organizations found!</div>
                }
            </div>
        </>

    )
}

export default Category