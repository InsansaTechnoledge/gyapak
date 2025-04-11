import api from './api';

export const getFeaturedExams = async () => {
  const response = await api.get('/exams/featured');
  return response.data;
};

export const getExamById = async (examId) => {
  const response = await api.get(`/exams/${examId}`);
  return response.data;
};
