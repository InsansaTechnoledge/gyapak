import React, { useEffect, useState } from 'react';

const DocumentLinksSection = ({setEventData, eventData}) => {
    const [links, setLinks] = useState(eventData?.document_links || ['']);

    // Handle input change
    const handleInputChange = (index, value) => {
        const newLinks = [...links];
        newLinks[index] = value;
        setLinks(newLinks);
    };
    
    useEffect(()=>{
        setEventData(perv => ({
            ...perv,
            document_links: links
        }))
    },[links])

    // Add a new input field
    const addInputField = () => {
        setLinks([...links, '']);
    };

    // Delete an input field
    const deleteInputField = (index) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    return (
        <div className='mb-10'>
            {links.map((link, index) => (
                <div key={index} className="mb-3 grid gap-5 grid-cols-5">
                    <input
                        type="text"
                        className="col-span-4 border-2 border-purple-700 rounded-md w-full p-2"
                        placeholder="Document link"
                        value={link}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                    <button 
                        className='bg-purple-600 text-white text-lg px-5 py-2 rounded-md'
                        onClick={() => deleteInputField(index)}
                    >
                        Delete
                    </button>
                </div>
            ))}

            <button
                className="bg-purple-600 text-white text-lg px-5 py-2 rounded-md mt-5"
                onClick={addInputField}
            >
                Add Entry
            </button>

            <div className='text-2xl font-bold mt-10'>
                <h1 className='text-center'>Final Document Links JSON</h1>
                <div className='overflow-auto mx-auto'>
                    <pre className='mt-5'>{JSON.stringify(links, null, 2)}</pre>
                </div>
            </div>
        </div>
    );
};

export default DocumentLinksSection;
