import React, { useState } from 'react';

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

  const handleAddSubject = () => {
    if (!subjectInput.name || !subjectInput.weightage) return;
    setFormData(prev => ({
      ...prev,
      subjects: [
        ...prev.subjects,
        {
          name: subjectInput.name,
          weightage: Number(subjectInput.weightage),
          syllabus: subjectInput.syllabus?.name || ''
        }
      ]
    }));
    setSubjectInput({ name: '', weightage: '', syllabus: null });
  };

  const handleAddEvent = () => {
    if (!eventInput.name || !eventInput.week) return;
    setFormData(prev => ({
      ...prev,
      events: [
        ...prev.events,
        {
          name: eventInput.name,
          week: eventInput.week,
          subjects: eventInput.subjects
        }
      ]
    }));
    setEventInput({ name: '', week: '', subjects: [] });
  };

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
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">📚 Add Subjects</h3>
          <div className="flex gap-4 mb-4">
            <input
              className="border p-2 w-full"
              placeholder="Subject Name"
              value={subjectInput.name}
              onChange={(e) => setSubjectInput({ ...subjectInput, name: e.target.value })}
            />
            <input
              type="number"
              className="border p-2 w-full"
              placeholder="Weightage (%)"
              value={subjectInput.weightage}
              onChange={(e) => setSubjectInput({ ...subjectInput, weightage: e.target.value })}
            />
            <input
              type="file"
              onChange={(e) => setSubjectInput({ ...subjectInput, syllabus: e.target.files[0] })}
            />
            <button
              type="button"
              onClick={handleAddSubject}
              className="bg-blue-500 text-white px-4 rounded"
            >
              Add
            </button>
          </div>

          <ul className="list-disc ml-5 text-sm text-gray-700 mb-6">
            {formData.subjects.map((s, i) => (
              <li key={i}>
                {s.name} — {s.weightage}% — 📄 {s.syllabus}
              </li>
            ))}
          </ul>
        </div>

        {/* Event Planning */}
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">📆 Add Events</h3>
          <div className="flex gap-4 mb-4">
            <input
              className="border p-2 w-full"
              placeholder="Event Name"
              value={eventInput.name}
              onChange={(e) => setEventInput({ ...eventInput, name: e.target.value })}
            />
            <input
              className="border p-2 w-full"
              placeholder="Week Number"
              value={eventInput.week}
              onChange={(e) => setEventInput({ ...eventInput, week: e.target.value })}
            />
            <select
              multiple
              className="border p-2 w-full"
              value={eventInput.subjects}
              onChange={(e) =>
                setEventInput({
                  ...eventInput,
                  subjects: Array.from(e.target.selectedOptions).map((opt) => opt.value)
                })
              }
            >
              {formData.subjects.map((s, i) => (
                <option key={i} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddEvent}
              className="bg-green-500 text-white px-4 rounded"
            >
              Add
            </button>
          </div>

          <ul className="list-disc ml-5 text-sm text-gray-700 mb-6">
            {formData.events.map((e, i) => (
              <li key={i}>
                {e.name} — Week {e.week} — 📚 [{e.subjects.join(', ')}]
              </li>
            ))}
          </ul>
        </div>

        {/* Submit */}
        <button type="submit" className="mt-6 bg-purple-600 text-white px-6 py-2 rounded">
          ✅ Submit Exam Setup
        </button>
      </form>
    </div>
  );
};

export default ExamSetupForm;
