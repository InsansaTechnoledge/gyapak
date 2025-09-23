import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '../../config';
import { v4 as uuidv4 } from 'uuid';

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
        let {name, value} = e.target;
        console.log(name, value);
        name==='organizationId' && value=='' ? value=null : null
        
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
                categories: categories.map(category => category.category)
            }));
        }
    },[categories])
    useEffect(()=>{
        if(seoTags){
            setFormData(prev => ({
                ...prev,
                seoTags: seoTags.map(seo => seo.seo)
            }));
        }
    },[seoTags])

    const addCategory = () => {
        const category = document.getElementById('categories').value;
        console.log(category);
        setCategories(prev => ([
            ...prev, 
            {
                id: uuidv4(),
                category: category
            }
        ]));

        document.getElementById('categories').value='';
    }

    const addSeoTag = () => {
        const seo = document.getElementById('seo').value;
        setSeoTags(prev => ([
            ...prev, 
            {
                id: uuidv4(),
                seo:seo
            }
        ]));

        document.getElementById('seo').value='';
    }

    const deleteCategory = (id) => {
        setCategories(categories.filter(cat => cat.id != id));
    }

    const deleteSeoTags = (id) => {
        setSeoTags(seoTags.filter(seo => seo.id != id));
    }


    const RenderCategory = ({category}) => {
        return (
            <div className='flex space-x-2'>
                <div className='px-2 border-purple-700 border rounded-lg'>{category.category}</div>
                <button 
                onClick={()=>deleteCategory(category.id)}
                type='button' className='bg-red-700 rounded-sm px-2 text-white'>Delete</button>
            </div>
        )
    }
    const RenderSeo = ({seo}) => {
        return (
            <div className='flex space-x-2'>
                <div className='px-2 border-purple-700 border rounded-lg'>{seo.seo}</div>
                <button 
                onClick={()=>deleteSeoTags(seo.id)}
                type='button' className='bg-red-700 rounded-sm px-2 text-white'>Delete</button>
            </div>
        )
    }

    const uploadFAQ = async (e) => {
        e.preventDefault();
        const response = await axios.post(`${API_BASE_URL}/api/v1i2/faq`,formData);
        if(response.data.status===200){
            alert(response.data.message);
        }

        setSeoTags([]);
        setCategories([]);
        setFormData({});
    }

    return (
        <>
            <h1 className='text-center text-2xl font-bold'>FAQCreate</h1>
            <form className='mt-10 w-1/3 mx-auto space-y-5'
            onSubmit={uploadFAQ}
            >
                <div className='flex space-x-2'>
                    <label htmlFor='question' className='my-auto font-bold text-lg'>Question: </label>
                    <input 
                    required
                    value={formData?.question || ''}
                    className='px-2 py-1 text-lg border-purple-700 rounded-md border-2'
                    onChange={(e)=>(onHandleChange(e))} id='question' name='question' type='text' /> 
                </div>
                <div className='flex flex-col space-y-2'>
                    <label htmlFor='answer' className='font-bold text-lg'>Answer: </label>
                    <textarea 
                        required
                        value={formData?.answer || ''}
                        className='px-2 py-1 text-lg border-purple-700 rounded-md border-2'
                        onChange={(e) => onHandleChange(e)} 
                        id='answer' 
                        name='answer' 
                        rows="6"
                        placeholder="Enter the detailed answer..."
                    />
                </div>
                <div>
                    <label htmlFor='categories' className='my-auto font-bold text-lg'>Categories: </label>
                    <input 
                    className='px-2 py-1 text-lg border-purple-700 rounded-md border-2'
                    id='categories' name='categories' type='text' />
                    <button 
                    className='bg-purple-700 p-2 text-white rounded-md ml-2'
                    type='button' onClick={addCategory}>Add</button>
                </div>
                {
                    categories.map((cat, idx) => (
                        <RenderCategory category={cat} key={idx} />
                    ))
                }
                <div>
                    <label htmlFor='state' className='my-auto font-bold text-lg'>State: </label>
                    <select 
                    className='px-2 py-1 text-lg border-purple-700 rounded-md border-2'
                    id='state'
                    name='state'
                    value={formData?.state || ''}
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
                    <label htmlFor='seo' className='my-auto font-bold text-lg'>SEO Tags: </label>
                    <input 
                    className='px-2 py-1 text-lg border-purple-700 rounded-md border-2'
                    id='seo' name='seo' type='text' />
                    <button 
                    className='bg-purple-700 p-2 text-white rounded-md ml-2'
                    type='button' onClick={addSeoTag}>Add</button>
                </div>
                {
                    seoTags.map((seo, idx) => (
                        <RenderSeo seo={seo} key={idx} />
                    ))
                }
                <div>
                    <label htmlFor='organizationId' className='my-auto font-bold text-lg'>Organization: </label>
                    <select 
                    onChange={(e)=>(onHandleChange(e))}
                    className='px-2 py-1 text-lg border-purple-700 rounded-md border-2'
                    value={formData?.organizationId || ''}
                    id='organizationId' name='organizationId'>
                        <option value=''>None</option>
                        {
                            organizations.map(org => (
                                <option key={org._id} value={org._id}>{org.name}</option>
                            ))
                        }
                    </select>
                </div>
                        
                        <button 
                        className='bg-purple-700 text-white p-2 rounded-md '
                        type='submit'
                        >Upload FAQ</button>
            </form>

        </>
    )
}

export default FAQCreate