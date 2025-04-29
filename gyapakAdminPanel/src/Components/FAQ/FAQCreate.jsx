import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '../../config';

const FAQCreate = () => {
    const stateList = [
        'All', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
        'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
        'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
        'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
        'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
        'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry', 'All'
      ];

      const [categories, setCategories] = useState([]);
      const [organizations, setOrganizations] = useState([]);
      const [formData, setFormData] = useState({});
      const [seoTags, setSeoTags] = useState([]);

    useEffect(()=>{
        const fetchOrganizations = async () => {
            const response = await axios.get(`${API_BASE_URL}/api/v1/organizations`);
            if(response.status===200){
                setOrganizations(response.data.organizations);
                console.log(response.data.organizations);
            }
        }

        fetchOrganizations();
    },[])

    const onHandleChange = (e) => {
        const {name, value} = e.target;
        console.log(name, value);
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    useEffect(()=>{
        if(formData){
            console.log(formData);
        }
    },[formData]);

    if(!organizations){
        return (
            <div>Loading...</div>
        )
    }

    useEffect(()=>{
        if(categories){
            setFormData(prev => ({
                ...prev,
                categories
            }));
        }
    },[categories])
    useEffect(()=>{
        if(seoTags){
            setFormData(prev => ({
                ...prev,
                seoTags
            }));
        }
    },[seoTags])

    const addCategory = () => {
        const category = document.getElementById('categories').value;
        console.log(category);
        setCategories(prev => ([
            ...prev, category
        ]));
    }

    const addSeoTag = () => {
        const seo = document.getElementById('seo').value;
        setSeoTags(prev => ([
            ...prev, seo
        ]));
    }



    const RenderCategory = ({category}) => {
        return (
            <div className='flex'>
                <div>{category}</div>
                <button type='button'>Delete</button>
            </div>
        )
    }
    const RenderSeo = ({seo}) => {
        return (
            <div className='flex'>
                <div>{seo}</div>
                <button type='button'>Delete</button>
            </div>
        )
    }

    const uploadFAQ = async () => {
        const response = await axios.post(`${API_BASE_URL}/api/v1i2/faq`,formData);
        if(response.status===200){
            alert(response.data.message);
        }
    }

    return (
        <>
            <h1 className='text-center text-2xl font-bold'>FAQCreate</h1>
            <form className='mt-10'>
                <div className='flex space-x-2'>
                    <label htmlFor='question' className='my-auto font-bold text-lg'>Question: </label>
                    <input 
                    className='px-2 py-1 text-lg border-purple-700 rounded-md border-2'
                    onChange={(e)=>(onHandleChange(e))} id='question' name='question' type='text' /> 
                </div>
                <div className='flex space-x-2'>
                    <label htmlFor='answer' className='my-auto font-bold text-lg'>Answer: </label>
                    <textarea 
                    className='px-2 py-1 text-lg border-purple-700 rounded-md border-2'
                    onChange={(e)=>(onHandleChange(e))} id='answer' name='answer'/> 
                </div>
                <div>
                    <label htmlFor='categories' className='my-auto font-bold text-lg'>Categories:</label>
                    <input 
                    className='px-2 py-1 text-lg border-purple-700 rounded-md border-2'
                    id='categories' name='categories' type='text' />
                    <button type='button' onClick={addCategory}>Add</button>
                </div>
                {
                    categories.map((cat, idx) => (
                        <RenderCategory category={cat} key={idx} />
                    ))
                }
                <div>
                    <label htmlFor='state' className='my-auto font-bold text-lg'>State</label>
                    <select 
                    className='px-2 py-1 text-lg border-purple-700 rounded-md border-2'
                    id='state'
                    name='state'
                    onChange={(e)=>onHandleChange(e)}
                    >
                        {
                            stateList.map((state, idx) => (
                                <option key={idx} value={state}>{state}</option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    <label htmlFor='seo' className='my-auto font-bold text-lg'>SEO Tags:</label>
                    <input 
                    className='px-2 py-1 text-lg border-purple-700 rounded-md border-2'
                    id='seo' name='seo' type='text' />
                    <button type='button' onClick={addSeoTag}>Add</button>
                </div>
                {
                    seoTags.map((seo, idx) => (
                        <RenderSeo seo={seo} key={idx} />
                    ))
                }
                <div>
                    <label htmlFor='organizationId' className='my-auto font-bold text-lg'>Organization:</label>
                    <select 
                    onChange={(e)=>(onHandleChange(e))}
                    className='px-2 py-1 text-lg border-purple-700 rounded-md border-2'
                    id='organizationId' name='organizationId'>
                        {
                            organizations.map(org => (
                                <option key={org._id} value={org._id}>{org.name}</option>
                            ))
                        }
                    </select>
                </div>
                        
                        <button 
                        className='bg-purple-700 text-white p-2 rounded-md '
                        type='button' onClick={uploadFAQ}>Upload FAQ</button>
            </form>

        </>
    )
}

export default FAQCreate