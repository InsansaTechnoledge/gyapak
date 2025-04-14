import React, { useEffect, useState } from 'react';
import SubjectForm from './SubjectForm';
import EventForm from './EventForm';

const ExamSetupForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    positive_marks: 1,
    negative_marks: 0.25,
    validity: '',
    subjects: [],
    events: []
  });


  const [subjectInput, setSubjectInput] = useState({ name: '', weightage: '', syllabus: null });
  const [eventInput, setEventInput] = useState({ name: '', week: '', subjects: [] });

  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('🚀 Final Exam Setup:', formData);
    alert('Form submitted! Check console for output.');
    // Submit to backend here if needed
  };



  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-6">📋 Exam Setup</h2>
      <form onSubmit={handleSubmit}>
        {/* Exam Info */}
        <div className="grid gap-4 mb-6">
          <input
            className="border p-2"
            placeholder="Exam Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <textarea
            className="border p-2"
            placeholder="Exam Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="flex gap-4">
            <input
              type="number"
              className="border p-2 w-full"
              placeholder="Positive Marks"
              value={formData.positive_marks}
              onChange={(e) => setFormData({ ...formData, positive_marks: Number(e.target.value) })}
            />
            <input
              type="number"
              className="border p-2 w-full"
              placeholder="Negative Marks"
              value={formData.negative_marks}
              onChange={(e) => setFormData({ ...formData, negative_marks: Number(e.target.value) })}
            />
          </div>
          <input
            className="border p-2"
            placeholder="Validity (e.g. 3 months)"
            value={formData.validity}
            onChange={(e) => setFormData({ ...formData, validity: e.target.value })}
          />
        </div>

        {/* Subjects */}
        
        <SubjectForm formData={formData} setFormData={setFormData}/>

        

        {/* Event Planning */}
        <EventForm formData={formData} setFormData={setFormData} />

        {/* Submit */}
        <button type="submit" className="mt-6 bg-purple-600 text-white px-6 py-2 rounded">
          ✅ Submit Exam Setup
        </button>
      </form>
    </div>
  );
};

export default ExamSetupForm;
