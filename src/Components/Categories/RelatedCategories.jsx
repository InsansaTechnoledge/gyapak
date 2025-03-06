import React, { useState, useEffect } from 'react';
import TopCategoriesCard from './TopCategoriesCard';

const RelatedCategories = (props) => {
    const [categories, setCategories] = useState([]);


    useEffect(() => {
        if(props.categories){
            setCategories(props.categories);
        }
    }, [props]);

    return (
        <>
            <div className="grid grid-cols-2 lg:grid-cols-4 mb-5 gap-4">
                {categories.map((category, key) => (
                    <TopCategoriesCard key={key} name={category.category} logo={category.logo} id={category._id} />
                ))}
            </div>
        </>
    );
};

export default RelatedCategories;

