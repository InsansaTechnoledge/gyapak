import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';

const DeleteFAQ = () => {
    const [faqs, setFaqs] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [selectedFaq, setSelectedFaq] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        question: '',
        answer: '',
        categories: '',
        seoTags: '',
        state: 'All'
    });

    useEffect(() => {
        fetchFaqs();
        fetchStateOptions();
    }, []);

    const fetchStateOptions = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/v1i2/faq/states/enum`);
            if (response.data.status === 200) {
                setStateOptions(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching state options:', err);
        }
    };

    const fetchFaqs = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/v1i2/faq`);
            if (response.data.status === 200) {
                setFaqs(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching FAQs:', err);
        }
    };

    const handleEdit = (faq) => {
        setEditFormData({
            question: faq.question || '',
            answer: faq.answer || '',
            // Convert arrays to strings for easier editing
            categories: Array.isArray(faq.categories) ? faq.categories.join(', ') : '',
            seoTags: Array.isArray(faq.seoTags) ? faq.seoTags.join(', ') : '',
            state: faq.state || stateOptions[0] // Set default state if empty
        });
        setSelectedFaq(faq);
        setIsEditModalOpen(true);
    };

    const handleUpdate = async () => {
        try {
            // Convert strings back to arrays before sending to API
            const updatedData = {
                ...editFormData,
                categories: editFormData.categories ? editFormData.categories.split(',').map(item => item.trim()) : [],
                seoTags: editFormData.seoTags ? editFormData.seoTags.split(',').map(item => item.trim()) : [],
                state: editFormData.state || stateOptions[0] // Ensure state is never empty
            };

            const response = await axios.put(
                `${API_BASE_URL}/api/v1i2/faq/${selectedFaq._id}`,
                updatedData
            );
            if (response.data.status === 200) {
                alert('FAQ updated successfully');
                setIsEditModalOpen(false);
                fetchFaqs();
            }
        } catch (err) {
            console.error('Update error:', err);
            alert(err?.response?.data?.message || 'Error updating FAQ');
        }
    };

    const handleDelete = async (faqId) => {
        if (window.confirm('Are you sure you want to delete this FAQ?')) {
            try {
                const response = await axios.delete(`${API_BASE_URL}/api/v1i2/faq/${faqId}`);
                if (response.data.status === 200) {
                    alert('FAQ deleted successfully');
                    fetchFaqs();
                }
            } catch (err) {
                alert(err?.response?.data?.message || err.message);
            }
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-purple-800 mb-3">FAQ Management</h2>
                <p className="text-gray-600 text-lg">
                    Manage your frequently asked questions
                </p>
            </div>

            {/* FAQ Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {faqs.map((faq) => (
                            <tr key={faq._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{faq.question}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{faq.state}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {faq.categories?.join(', ')}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(faq)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(faq._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Professional Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col border border-gray-200">
                        {/* Modal Header with gradient */}
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 rounded-t-2xl flex-shrink-0">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">
                                        Edit FAQ
                                    </h3>
                                    <p className="text-purple-100 mt-1">
                                        Update your frequently asked question
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200"
                                    aria-label="Close"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        {/* Scrollable Content Area */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-8 space-y-8 bg-gray-50/50">
                                <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="space-y-8">
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                                            <h4 className="font-semibold text-gray-800 flex items-center">
                                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                                FAQ Content
                                            </h4>
                                        </div>
                                        
                                        <div className="p-6 space-y-6">
                                            {/* Question Field */}
                                            <div>
                                                <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                                                    <svg className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Question
                                                    <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={editFormData.question}
                                                    onChange={(e) => setEditFormData({ ...editFormData, question: e.target.value })}
                                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                                    required
                                                    placeholder="Enter your frequently asked question..."
                                                />
                                            </div>
                
                                            {/* Answer Field */}
                                            <div>
                                                <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                                                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    Answer
                                                    <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <textarea
                                                    value={editFormData.answer}
                                                    onChange={(e) => setEditFormData({ ...editFormData, answer: e.target.value })}
                                                    rows="5"
                                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                                                    required
                                                    placeholder="Provide a comprehensive answer to the question..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                
                                    {/* Classification Section */}
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
                                            <h4 className="font-semibold text-gray-800 flex items-center">
                                                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                                                Classification & Metadata
                                            </h4>
                                        </div>
                                        
                                        <div className="p-6 space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* State Field */}
                                                <div>
                                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                                        <svg className="h-4 w-4 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        State
                                                        <span className="text-red-500 ml-1">*</span>
                                                    </label>
                                                    <select
                                                        value={editFormData.state}
                                                        onChange={(e) => setEditFormData({
                                                            ...editFormData,
                                                            state: e.target.value
                                                        })}
                                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
                                                        required
                                                    >
                                                        {stateOptions.map((state) => (
                                                            <option key={state} value={state}>
                                                                {state}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                
                                                {/* Categories Field */}
                                                <div>
                                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                                        <svg className="h-4 w-4 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                        </svg>
                                                        Categories
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={editFormData.categories}
                                                        onChange={(e) => setEditFormData({
                                                            ...editFormData,
                                                            categories: e.target.value
                                                        })}
                                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
                                                        placeholder="e.g., General, Technical, Policy"
                                                    />
                                                </div>
                                            </div>
                
                                            {/* SEO Tags Field */}
                                            <div>
                                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                                    <svg className="h-4 w-4 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                                    </svg>
                                                    SEO Tags
                                                </label>
                                                <input
                                                    type="text"
                                                    value={editFormData.seoTags}
                                                    onChange={(e) => setEditFormData({
                                                        ...editFormData,
                                                        seoTags: e.target.value
                                                    })}
                                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
                                                    placeholder="e.g., faq, help, support, guide"
                                                />
                                                <p className="text-xs text-gray-500 mt-2 flex items-center">
                                                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                                                    Separate multiple tags with commas for better SEO
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </form>

                            </div>
                        </div>
                        
                        {/* Professional Modal Footer */}
                        <div className="bg-gradient-to-r from-gray-50 to-purple-50 px-8 py-6 border-t border-gray-200 flex justify-end gap-4 sticky bottom-0 z-10">
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 font-medium transition-all duration-200 flex items-center"
                            >
                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel
                            </button>
                            <button
                                type="submit"
                                onClick={handleUpdate}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                            >
                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteFAQ;