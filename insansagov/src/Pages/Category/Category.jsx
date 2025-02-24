import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import API_BASE_URL from '../config'
import axios from 'axios'
import RelatedAuthorities from '../../Components/Authority/RelatedAuthorities'
import BackButton from '../../Components/BackButton/BackButton'
import { RingLoader } from 'react-spinners'
import no_data_image from '../../assets/Landing/no_data.jpg'


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
            <div className='pt-28'>
                <BackButton />
                <div className='flex flex-col justify-center mb-20'>
                    <img src={`data:image/png;base64,${logo}`} className='w-28 self-center mb-5' />
                    <h1 className='text-3xl self-center font-bold'>{name}</h1>
                </div>

                {
                    organizations && organizations.length > 0
                        ?
                        <>
                            <h1 className='font-bold text-2xl text-center mb-10'>Organizations under {name}</h1>
                            <RelatedAuthorities organizations={organizations} />

                        </>
                        :
                        <>
                            <h3 className='text-center font-bold text-lg mb-5'>No Organization under this category!</h3>
                            <img src={no_data_image} className='w-5/12 mx-auto' />
                        </>
                }
            </div>
        </>

    )
}

export default Category