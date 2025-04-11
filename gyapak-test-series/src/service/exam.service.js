import api from './api';

// Create a new exam
export const createExam = async (examData) => {
  const res = await api.post('/api/v1i2/exam', examData);
  return res.data;
};

// Add subjects to a specific exam
export const addSubjectsToExam = async (examId, subjects) => {
  // subjects = [{ subject_id, weightage }]
  const res = await api.post(`/api/v1i2/exam/${examId}/subjects`, { subjects });
  return res.data;
};

// Get full exam data with attached subjects
export const getExamById = async (examId) => {
  const res = await api.get(`/api/v1i2/exam/${examId}`);
  return res.data;
};

//  Update exam information
export const updateExam = async (examId, updatedData) => {
  const res = await api.put(`/api/v1i2/exam/${examId}`, updatedData);
  return res.data;
};

// Delete exam
export const deleteExam = async (examId) => {
  const res = await api.delete(`/api/v1i2/exam/${examId}`);
  return res.data;
};
