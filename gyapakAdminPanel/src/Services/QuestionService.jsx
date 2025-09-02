import axios from 'axios';


import { API_BASE_URL } from '../config';

export const createQuestionService = async (questionData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1i2/question`, questionData);
    return response;
  } catch (error) {
    console.error('Error creating question:', error);
    throw error;
  }
};

export const updateQuestionService = async (questionId, questionData) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/api/v1i2/question/${questionId}`, questionData);
    return response.data;
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
};

export const deleteQuestionService = async (questionId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/v1i2/question/${questionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};

export const reuseQuestionService = async (questionId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1i2/question/${questionId}/reuse`);
    return response.data;
  } catch (error) {
    console.error('Error reusing question:', error);
    throw error;
  }
};
export const fetchQuestionsService = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1i2/question`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};
