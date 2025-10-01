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

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-gray-600/75 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
                    <div className="relative top-10 mx-auto p-6 border w-[600px] shadow-lg rounded-md bg-white">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-4 pb-2 border-b">
                            <h3 className="text-xl font-semibold text-gray-800">Edit FAQ</h3>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-gray-500 hover:text-gray-600 transition-colors"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Form Content */}
                        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="space-y-4">
                            {/* Question Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Question <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={editFormData.question}
                                    onChange={(e) => setEditFormData({ ...editFormData, question: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                    required
                                    placeholder="Enter the question"
                                />
                            </div>

                            {/* Answer Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Answer <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={editFormData.answer}
                                    onChange={(e) => setEditFormData({ ...editFormData, answer: e.target.value })}
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                    required
                                    placeholder="Enter the answer"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* State Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        State <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={editFormData.state}
                                        onChange={(e) => setEditFormData({
                                            ...editFormData,
                                            state: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
                                    <input
                                        type="text"
                                        value={editFormData.categories}
                                        onChange={(e) => setEditFormData({
                                            ...editFormData,
                                            categories: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Comma-separated categories"
                                    />
                                </div>
                            </div>

                            {/* SEO Tags Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Tags</label>
                                <input
                                    type="text"
                                    value={editFormData.seoTags}
                                    onChange={(e) => setEditFormData({
                                        ...editFormData,
                                        seoTags: e.target.value
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="Comma-separated SEO tags"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-4 mt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteFAQ;