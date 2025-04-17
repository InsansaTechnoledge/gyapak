import React, { useEffect, useState } from 'react';
// import { getAllExams, getEventsByExam, getSubjectsByEvent, uploadCSVForSubject } from '../../../service/uploadFlow.service';
import { getAllexam } from '../../../../service/exam.service';
import { getEventsByExamId} from '../../../../service/event.service';
import { getSubjectsByEvent } from '../../../../service/subject.service';
import { uploadCSV } from '../../../../service/question.service';

const UploadQuestionsForm = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});

  useEffect(() => {
    const fetchExams = async () => {
      const res = await getAllexam();
      setExams(res.data || []);
    };
    fetchExams();
  }, []);

  const handleExamChange = async (e) => {
    const examId = e.target.value;
    setSelectedExam(examId);
    const res = await getEventsByExamId(examId);
    setEvents(res.data || []);
    setSelectedEvent('');
    setSubjects([]);
  };

  const handleEventChange = async (e) => {
    const eventId = e.target.value;
    setSelectedEvent(eventId);
    const res = await getSubjectsByEvent(eventId);
    setSubjects(res.data || []);
  };

  const handleFileChange = (subjectId, file) => {
    setSelectedFiles((prev) => ({ ...prev, [subjectId]: file }));
  };

  const handleUpload = async (subjectId) => {
    const file = selectedFiles[subjectId];
    if (!file) return alert("Please select a file");
  
    if (!selectedEvent) return alert("Please select an event before uploading");
  
    try {
      const result = await uploadCSV(subjectId, file, selectedEvent); // pass eventId
      alert(`✅ Uploaded and linked to event for subject "${subjectId}"`);
      console.log(result);
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Upload failed. Please check console.");
    }
  };
  

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Upload Questions by Subject</h2>

      <label>Choose Exam</label>
      <select onChange={handleExamChange} value={selectedExam} className="border p-2 mb-4 w-full">
        <option value="">-- Select Exam --</option>
        {exams.map((exam) => (
          <option key={exam.id} value={exam.id}>{exam.title}</option>
        ))}
      </select>

      {events.length > 0 && (
        <>
          <label>Choose Event</label>
          <select onChange={handleEventChange} value={selectedEvent} className="border p-2 mb-4 w-full">
            <option value="">-- Select Event --</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>{event.name}</option>
            ))}
          </select>
        </>
      )}

      {subjects.length > 0 && (
        <>
          <h4 className="font-medium mb-2">Upload for each subject:</h4>
          {subjects.map((subject) => (
            <div key={subject.id} className="mb-4">
              <label>{subject.name}</label>
              <input type="file" accept=".csv" onChange={(e) => handleFileChange(subject.id, e.target.files[0])} className="ml-2" />
              <button
                onClick={() => handleUpload(subject.id)}
                className="ml-4 bg-purple-600 text-white px-4 py-1 rounded"
              >
                Upload
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default UploadQuestionsForm;
