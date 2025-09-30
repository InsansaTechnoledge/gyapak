import axios from 'axios';
import React, { useState } from 'react'
import { API_BASE_URL } from '../../config';
import FAQItem from './FAQItem';

const DeleteFAQ = () => {
    const [faqName, setFaqName] = useState();
    const [faq, setFaq] = useState();

    const showEvent = async () => {
        try{

            const response = await axios.get(`${API_BASE_URL}/api/v1i2/faq/${encodeURIComponent(faqName.trim())}`);
            if(response.data.status===200){
                setFaq(response.data.data);
                console.log(response.data.data);
            }
        }
        catch(err){
            alert(err?.response?.data?.message || err.message);
        }
    }

    const deleteFaq = async () => {
        const response = await axios.delete(`${API_BASE_URL}/api/v1i2/faq/${faq._id}`)
        if(response.data.status==200){
            alert("FAQ deleted");
            setFaqName('');
            setFaq(null);
        }
    }

  return (
    <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-purple-800 mb-3">Delete FAQ</h2>
            <p className="text-gray-600 text-lg">
                Search and remove frequently asked questions
            </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        FAQ Question
                    </label>
                    <div className="flex gap-3">
                        <input 
                            value={faqName || ''}
                            onChange={(e) => setFaqName(e.target.value)}
                            type="text" 
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter FAQ question to search..."
                        />
                        <button
                            onClick={showEvent} 
                            disabled={!faqName}
                            className={`px-6 py-2 rounded-lg font-medium transition ${
                                faqName 
                                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Search FAQ
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* FAQ Preview and Delete Section */}
        {faq && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {/* Delete Button */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">FAQ Preview</h3>
                    <button 
                        onClick={deleteFaq}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete FAQ
                    </button>
                </div>

                {/* FAQ Content */}
                <FAQItem 
                    question={faq.question}
                    answer={faq.answer}
                    categories={faq.categories || []}
                    state={faq.state}
                    seoTags={faq.seoTags || []}
                />
            </div>
        )}

        {/* Empty State */}
        {!faq && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">No FAQ Selected</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    Enter a FAQ question in the search box above to find and preview the FAQ before deletion.
                </p>
            </div>
        )}
    </div>
  )
}

export default DeleteFAQ;