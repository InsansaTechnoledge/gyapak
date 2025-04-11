import api from './api';

// Upload CSV file of questions for a subject
export const uploadCSV = async (subjectId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.post(`/api/v1i2/question/csv-upload/${subjectId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return res.data;
};

// Create a single question manually
export const createQuestion = async (questionData) => {
  const res = await api.post('/api/v1i2/question/new-question', questionData);
  return res.data;
};

// Fetch questions by subject ID
export const getQuestionsBySubject = async (subjectId) => {
  const res = await api.get(`/api/v1i2/question/get-question-by-subject/${subjectId}`);
  return res.data;
};

// Update a question by ID
export const updateQuestion = async (questionId, updates) => {
  const res = await api.put(`/api/v1i2/question/${questionId}`, updates);
  return res.data;
};

// Delete a question by ID
export const deleteQuestion = async (questionId) => {
  const res = await api.delete(`/api/v1i2/question/${questionId}`);
  return res.data;
};
