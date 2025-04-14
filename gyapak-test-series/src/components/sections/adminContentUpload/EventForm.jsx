import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

const EventForm = ({ formData, setFormData }) => {
    const [entries, setEntries] = useState([]);

    const addEntry = () => {
        setEntries([...entries, { id: uuidv4(), name: '', week: '', subjects: [] }]);
    }

    const handleChange = (id, field, value) => {
        setEntries(entries.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)));
    };

    const handleCheckboxChange = (id, field, value) => {
        console.log(value);
        setEntries(entries.map((entry) => {
            if (entry.id === id) {
                const currentValues = entry[field] || [];
                const newValues = currentValues.includes(value)
                    ? currentValues.filter((v) => v !== value) // Remove if already present (unchecked)
                    : [...currentValues, value]; // Add if not present (checked)
                
                return { ...entry, [field]: newValues };
            }
            return entry;
        }));
    }


    const deleteEntry = (id) => {
        setEntries(entries.filter(entry => entry.id != id));
    }

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            events: entries
        }))
    }, [entries])

    return (
        <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">📆 Add Events</h3>
            {
                entries.map(({ id, name, week, subjects }) => (
                    <div className="flex gap-4 mb-4">
                        <input
                            className="border p-2 w-full"
                            placeholder="Event Name"
                            value={name}
                            onChange={(e) => handleChange(id, 'name', e.target.value)}
                        />
                        <input
                            className="border p-2 w-full"
                            placeholder="Week Number"
                            value={week}
                            onChange={(e) => handleChange(id, 'week', e.target.value)}
                        />
                        <div
                            multiple
                            className="border p-2 w-full flex space-x-2"
                            value={subjects}
                        >
                            {formData.subjects.map((s, i) => (
                                <div key={s.id}>
                                    <input
                                        key={id+s.id}
                                        id={id+s.id}
                                        name={'check'}
                                        type='checkbox'
                                        value={s.name}
                                        onChange={(e)=>handleCheckboxChange(id, 'subjects', e.target.value)}
                                        
                                    />
                                    <label htmlFor={id+s.id}>{s.name}</label>
                                    </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => deleteEntry(id)}
                        >
                            delete
                        </button>
                    </div>
                ))
            }

            <button
                type='button'
                onClick={addEntry}
                className="bg-blue-500 text-white px-4 rounded"
            >
                Add
            </button>

            <ul className="list-disc ml-5 text-sm text-gray-700 mb-6">
                {entries.map((e, i) => (
                    <li key={i}>
                        {e.name} — Week {e.week} — 📚 {e.subjects}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default EventForm