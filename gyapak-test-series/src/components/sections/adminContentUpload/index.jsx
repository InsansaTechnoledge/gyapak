import React, { useEffect, useState } from 'react';
import SubjectForm from './SubjectForm';
import EventForm from './EventForm';
import { createExam } from '../../../service/exam.service';
import { createSubject } from '../../../service/subject.service';
import { createFullExamSetup } from '../../../service/admin.service';

const ExamSetupForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    positive_marks: null,
    negative_marks: null,
    validity: '',
    subjects: [],
    events: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalWeightage = formData.subjects.reduce((acc, sub) => {
      return acc + Number.parseInt(sub.weightage);
    }, 0);

    console.log(totalWeightage);
    if (totalWeightage !== 100) {
      alert("Total subject weightage is not 100%");
      return;
    }

    const eventsWithoutSubject = formData.events.filter(event => event.subjects.length === 0);
    if (eventsWithoutSubject.length > 0) {
      alert("Add at least one subject for each event");
      return;
    }

    try {
      const exam = {
        title: formData.title,
        description: formData.description,
        validity: formData.validity + 'months',
        positive_marks: formData.positive_marks,
        negative_marks: formData.negative_marks
      };

      const subjects = formData.subjects.map(sub => ({
        frontend_id: sub.id,
        name: sub.name,
        weightage: parseInt(sub.weightage),
        syllabus_id: null
      }));

      const events = formData.events.map(eve => {
        const mappedSubjects = eve.subjects.map(sub => {
          const matched = formData.subjects.find(s => s.name === sub || s.name === sub.name);
          return matched?.id || null;
        });

        
      
        return {
          name: eve.name,
          status: 'planned',
          weeks: Number.parseInt(eve.week),
          event_date: "2025-06-01",
          duration: '01:00:00',
          subjects: mappedSubjects.filter(Boolean) 
        };
      });
      
      const organizationId = '67fe4e3e4fa325703448cd96';
      const fullData = {
        exam,
        subjects,
        events,
        organizationId
      };

      console.log(fullData);
      const response = await createFullExamSetup(fullData);
      if (response.status === 200) {
        console.log('Final Exam Setup:', formData);
        alert('Form submitted! Check console for output.');
      }
    } catch (err) {
      console.log(err.response?.data?.errors?.[0] || err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-6">📋 Exam Setup</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 mb-6">
          <label htmlFor='title'>Exam title</label>
          <input
            id='title'
            className="border p-2"
            placeholder="Exam Title"
            value={formData.title}
            required
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <label htmlFor='description'>Exam description</label>
          <textarea
            id='description'
            className="border p-2"
            placeholder="Exam Description"
            value={formData.description}
            required
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex gap-4">
            <div className='flex flex-col w-full'>
              <label htmlFor='positive'>Positive marks</label>
              <input
                id='positive'
                type="number"
                className="border p-2 w-full"
                placeholder="Positive Marks"
                required
                value={formData.positive_marks}
                onChange={(e) => setFormData({ ...formData, positive_marks: Number(e.target.value) })}
              />
            </div>
            <div className='flex flex-col w-full'>
              <label htmlFor='negative'>Negative marks (if applicable)</label>
              <input
                id='negative'
                type="number"
                className="border p-2 w-full"
                placeholder="Negative Marks"
                value={formData.negative_marks}
                onChange={(e) => setFormData({ ...formData, negative_marks: Number(e.target.value) })}
              />
            </div>
          </div>

          <label htmlFor='validity'>Validity</label>
          <input
            id='validity'
            required
            className="border p-2"
            placeholder="Validity (e.g. 3 months)"
            value={formData.validity}
            onChange={(e) => setFormData({ ...formData, validity: e.target.value })}
          />
        </div>

        <SubjectForm formData={formData} setFormData={setFormData} />
        <EventForm formData={formData} setFormData={setFormData} />

        <button type="submit" className="mt-6 bg-purple-600 text-white px-6 py-2 rounded">
          ✅ Submit Exam Setup
        </button>
      </form>
    </div>
  );
};

export default ExamSetupForm;