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

    //   const [categories, setCategories] = useState([]);
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

    // useEffect(()=>{
    //     if(categories){
    //         setFormData(prev => ({
    //             ...prev,
    //             categories: categories.map(category => category.category)
    //         }));
    //     }
    // },[categories])
    // useEffect(()=>{
    //     if(seoTags){
    //         setFormData(prev => ({
    //             ...prev,
    //             seoTags: seoTags.map(seo => seo.seo)
    //         }));
    //     }
    // },[seoTags])

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

    // const deleteCategory = (id) => {
    //     setCategories(categories.filter(cat => cat.id != id));
    // }

    const deleteSeoTags = (id) => {
        setSeoTags(seoTags.filter(seo => seo.id != id));
    }


    // const RenderCategory = ({category}) => {
    //     return (
    //         <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
    //             <span>{category.category}</span>
    //             <button 
    //                 onClick={() => deleteCategory(category.id)}
    //                 type="button" 
    //                 className="bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition"
    //             >
    //                 ×
    //             </button>
    //         </div>
    //     )
    // }

    const RenderSeo = ({seo}) => {
        return (
            <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                <span>#{seo.seo}</span>
                <button 
                    onClick={() => deleteSeoTags(seo.id)}
                    type="button" 
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition"
                >
                    ×
                </button>
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
        // setCategories([]);
        setFormData({});
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-purple-800 mb-3">Create FAQ</h2>
                <p className="text-gray-600 text-lg">
                    Add new frequently asked questions to help users
                </p>
            </div>

            {/* FAQ Form */}
            <form onSubmit={uploadFAQ} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="space-y-6">
                    {/* Question Field */}
                    <div>
                        <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                            Question *
                        </label>
                        <input
                            required
                            value={formData?.question || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            onChange={(e) => onHandleChange(e)}
                            id="question"
                            name="question"
                            type="text"
                            placeholder="Enter the FAQ question"
                        />
                    </div>

                    {/* Answer Field */}
                    <div>
                        <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                            Answer *
                        </label>
                        <textarea
                            required
                            value={formData?.answer || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            onChange={(e) => onHandleChange(e)}
                            id="answer"
                            name="answer"
                            rows="6"
                            placeholder="Enter the detailed answer..."
                        />
                    </div>

                    {/* State Selection */}
                    <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                            State
                        </label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            id="state"
                            name="state"
                            value={formData?.state || ''}
                            onChange={(e) => onHandleChange(e)}
                        >
                            <option value="">Select a state</option>
                            {stateList.map((state, idx) => (
                                <option key={idx} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>

                    {/* SEO Tags Section */}
                    <div>
                        <label htmlFor="seo" className="block text-sm font-medium text-gray-700 mb-2">
                            SEO Tags
                        </label>
                        <div className="flex gap-2">
                            <input
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                id="seo"
                                name="seo"
                                type="text"
                                placeholder="Enter SEO tag"
                            />
                            <button
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
                                type="button"
                                onClick={addSeoTag}
                            >
                                Add
                            </button>
                        </div>
                        
                        {/* SEO Tags */}
                        {seoTags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {seoTags.map((seo, idx) => (
                                    <RenderSeo seo={seo} key={idx} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Organization Selection */}
                    <div>
                        <label htmlFor="organizationId" className="block text-sm font-medium text-gray-700 mb-2">
                            Organization
                        </label>
                        <select
                            onChange={(e) => onHandleChange(e)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            value={formData?.organizationId || ''}
                            id="organizationId"
                            name="organizationId"
                        >
                            <option value="">None</option>
                            {organizations.map(org => (
                                <option key={org._id} value={org._id}>{org.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-6 border-t border-gray-200">
                        <button
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
                            type="submit"
                        >
                            Create FAQ
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default FAQCreate