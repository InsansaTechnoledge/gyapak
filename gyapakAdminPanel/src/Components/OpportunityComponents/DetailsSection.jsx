import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DetailsSection = ({setEventData}) => {
    const [entries, setEntries] = useState([]);
    
    // Function to add a new entry
    const addEntry = () => {
        setEntries([...entries, { id: uuidv4(), left: '', right: [], type: 'string' }]);
    };

    // Function to delete an entry
    const deleteEntry = (id) => {
        setEntries(entries.filter((entry) => entry.id !== id));
    };

    // Function to handle input changes
    const handleChange = (id, field, value) => {
        setEntries(entries.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)));
    };

    // Function to add an item to the array
    const addArrayItem = (id) => {
        setEntries(entries.map((entry) => (entry.id === id ? { ...entry, right: [...entry.right, ''] } : entry)));
    };

    // Function to update an array item
    const updateArrayItem = (id, index, value) => {
        setEntries(entries.map((entry) => {
            if (entry.id === id) {
                const updatedArray = [...entry.right];
                updatedArray[index] = value;
                return { ...entry, right: updatedArray };
            }
            return entry;
        }));
    };

    // Function to remove an array item
    const removeArrayItem = (id, index) => {
        setEntries(entries.map((entry) => {
            if (entry.id === id) {
                const updatedArray = entry.right.filter((_, i) => i !== index);
                return { ...entry, right: updatedArray };
            }
            return entry;
        }));
    };

    // Convert entries to the desired object format
    const entriesObject = entries.reduce((acc, { left, right }) => {
        if (left) acc[left] = right.length === 1 ? right[0] : right;
        return acc;
    }, {});

    useEffect(()=>{
        setEventData(prev => ({
            ...prev,
            details: entries.reduce((acc, { left, right }) => {
                if (left) acc[left] = right.length === 1 ? right[0] : right;
                return acc;
            }, {})
        }));
    },[entries])

    return (
        <div>
            {entries.map(({ id, left, right, type }) => (
                <div key={id} className='grid grid-cols-5 gap-5 mt-5'>
                    <input
                        type='text'
                        placeholder='Key (Left)'
                        value={left}
                        onChange={(e) => handleChange(id, 'left', e.target.value)}
                        className='col-span-1 border-2 border-purple-700 rounded-md p-1'
                    />
                    {type === 'string' ? (
                        <input
                            type='text'
                            placeholder='Value (Right)'
                            value={right[0] || ''}
                            onChange={(e) => updateArrayItem(id, 0, e.target.value)}
                            className='col-span-2 border-2 border-purple-700 rounded-md p-1'
                        />
                    ) : type === 'date' ? (
                        <input
                            type='date'
                            value={right[0] || ''}
                            onChange={(e) => updateArrayItem(id, 0, e.target.value)}
                            className='col-span-2 border-2 border-purple-700 rounded-md p-1'
                        />
                    ) : type === 'boolean' ? (
                        <select
                            value={right[0] || 'false'}
                            onChange={(e) => updateArrayItem(id, 0, e.target.value === 'true')}
                            className='col-span-2 border-2 border-purple-700 rounded-md p-1'
                        >
                            <option value='true'>True</option>
                            <option value='false'>False</option>
                        </select>
                    ) : (
                        <div className='col-span-2'>
                            {right.map((item, index) => (
                                <div key={index} className='flex items-center gap-2 mb-2'>
                                    <input
                                        type='text'
                                        value={item}
                                        onChange={(e) => updateArrayItem(id, index, e.target.value)}
                                        className='border-2 border-purple-700 rounded-md p-1 w-full'
                                    />
                                    <button
                                        onClick={() => removeArrayItem(id, index)}
                                        className='bg-red-500 text-white px-3 py-1 rounded-md'
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => addArrayItem(id)}
                                className='bg-green-500 text-white px-3 py-1 rounded-md'
                            >
                                Add Item
                            </button>
                        </div>
                    )}
                    <select
                        value={type}
                        onChange={(e) => handleChange(id, 'type', e.target.value)}
                        className='border-2 border-purple-700 rounded-md p-1'
                    >
                        <option value='string'>String</option>
                        <option value='date'>Date</option>
                        <option value='boolean'>Boolean</option>
                        <option value='array'>Array</option>
                    </select>
                    <button
                        onClick={() => deleteEntry(id)}
                        className='bg-purple-600 text-white text-lg px-5 py-2 rounded-md'
                    >
                        Delete Entry
                    </button>
                </div>
            ))}

            <button
                onClick={addEntry}
                className='bg-purple-600 text-white text-lg px-5 py-2 rounded-md mt-5'
            >
                Add Entry
            </button>

            {/* <div className='text-2xl font-bold mt-10'>
                <h1 className='text-center'>Final Details JSON</h1>
                <div className='w-fit mx-auto'>
                <pre className='mt-5'>{JSON.stringify(entriesObject, null, 2)}</pre>
                </div>
            </div> */}
        </div>
    );
};

export default DetailsSection;
