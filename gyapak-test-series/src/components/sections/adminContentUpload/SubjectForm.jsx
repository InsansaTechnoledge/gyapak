import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

const SubjectForm = ({setFormData}) => {
    const [entries, setEntries] = useState([]);

    const addEntry = () => {
        setEntries([...entries, { id: uuidv4(), name: '', weightage: 0, syllabus: null }]);
    }

    const handleChange = (id, field, value) => {
        setEntries(entries.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)));
    };

    const deleteEntry = (id) => {
        setEntries(entries.filter(entry => entry.id != id));
    }

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            subjects: entries
        }));
    },[entries])

    return (
        <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">📚 Add Subjects</h3>

            {
                entries.map(({id, name, weightage, file}) => (
                    <div key={id} className="flex gap-4 mb-4">
                        <div className='flex flex-col'>
                        <label htmlFor={id+'subName'}>Name</label>
                        <input
                            id={id+'subName'}
                            className="border p-2 w-full"
                            placeholder="Subject Name"
                            value={name}
                            required
                            onChange={(e) => (handleChange(id, 'name', e.target.value))}
                        />
                        </div>
                        <div className='flex flex-col'>
                        <label htmlFor={id+'subWeight'}>Weightage</label>
                        <input
                            id={id+'subWeight'}
                            type='number'
                            className="border p-2 w-full"
                            placeholder="Weightage (%)"
                            value={weightage}
                            required
                            onChange={(e) => (handleChange(id, 'weightage', e.target.value))}
                        />
                        </div>
                        <div className='flex flex-col'>
                        <label htmlFor={id+'subSyllabus'}>Syllabus</label>
                        <input
                            id={id+'subSyllabus'}
                            type="file"
                            onChange={(e) => (handleChange(id, 'syllabus', e.target.files[0]))}
                            required
                            className='border h-full'
                        />
                        </div>
                        <button 
                        type='button'
                        onClick={()=>deleteEntry(id)}>
                            remove
                        </button>
                    </div>
                ))
            }
            <button
                type="button"
                onClick={addEntry}
                className="bg-blue-500 text-white px-4 rounded"
            >
                Add
            </button>

            <ul className="list-disc ml-5 text-sm text-gray-700 mb-6">
                {entries.map((s, i) => (
                    <li key={i}>
                        {s.name} — {s.weightage}% — 📄 {s.syllabus?.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SubjectForm