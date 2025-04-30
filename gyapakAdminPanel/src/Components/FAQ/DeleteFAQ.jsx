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
    <>
        <h1 className='text-2xl font-bold text-center text-purple-600'>Delete FAQ</h1>
        <div className='flex justify-center mt-10 w-full space-x-2'>
            <h2 className='my-auto text-lg text-center font-semibold text-purple-600'>Enter FAQ Question to delete : </h2>
            <input 
            value={faqName || ''}
            onChange={(e)=>setFaqName(e.target.value)}
            type='text' 
            className='border p-2 rounded-md w-3/12 border-purple-600'/>
            <button
            onClick={showEvent} 
            disabled={!faqName}
            className={`${faqName ? 'bg-purple-600' : 'bg-gray-400'} text-white px-8 py-2 rounded-md hover:cursor-pointer`}>show FAQ</button>
        </div>
        <div>
            {
                faq 
                ?
                <>
                <div className='flex justify-between mt-10'>
                    <button 
                    onClick={deleteFaq}
                    className='px-4 py-2 text-white bg-red-700 rounded-md mx-auto'>
                        Delete FAQ
                    </button>

                </div>
                <FAQItem 
                question={faq.question}
                answer={faq.answer}
                categories={faq.categories || []}
                state={faq.state}
                seoTags={faq.seoTags || []}
                />
                </>
                :
                null
            }
        </div>
    </>
  )
}

export default DeleteFAQ;