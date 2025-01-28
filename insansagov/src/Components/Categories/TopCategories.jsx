import React, { useState, useEffect, lazy, Suspense } from 'react';
const TopCategoriesCard = lazy(() => import('./TopCategoriesCard'));
const ViewMoreButton = lazy(() => import('../Buttons/ViewMoreButton'));
import axios from 'axios';
import API_BASE_URL from '../../Pages/config';
import { RingLoader } from 'react-spinners';
import { debounce } from 'lodash';

const TopCategories = (props) => {
    const [categories, setCategories] = useState();
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
        setFilteredCategories(isExpanded ? categories.slice(0, 4) : categories);
    };

    useEffect(() => {
        const fetchCategories = debounce(async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/category/getCategories`);
                if (response.status === 201) {
                    setCategories(response.data);
                    setFilteredCategories(response.data.slice(0, 4));
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },1000);
        fetchCategories();
    }, []);

    if (!categories) {
        return <div className='w-full flex flex-col justify-center mb-10'>
            <h1 className='flex text-center text-2xl justify-center mb-5 font-bold'>Top Categories</h1>
            <div className='flex justify-center'>
                <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />

            </div>
        </div>
    }

    return (
        <>
            {!props.titleHidden && (
                <h1 className="flex text-center text-2xl justify-center mb-5 font-bold">
                    Top Categories
                </h1>
            )}
            <div className="grid grid-cols-2 lg:grid-cols-4 mb-5 gap-4">
                <Suspense fallback={<div><div className='w-full h-screen flex justify-center'>
      <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />
    </div></div>}>
                    {filteredCategories.map((category, key) => (
                        <TopCategoriesCard key={key} name={category.category} logo={category.logo} id={category._id} />
                    ))}
                </Suspense>
            </div>
            <div className="flex justify-center gap-4 mb-20">
                <Suspense fallback={<div><div className='w-full h-screen flex justify-center'>
      <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />
    </div></div>}>
                    <ViewMoreButton
                        content={isExpanded ? 'Close All ▲' : 'View More ▼'}
                        onClick={handleToggle}
                    />
                </Suspense>
            </div>
        </>
    );
};

export default TopCategories;

