// src/service/institute.service.js

import api from './api'; // Your axios instance with base URL and interceptors

export const createInstitute = async (payload) => {
  const res = await api.post('/api/v1i2/institute-register', payload);
  return res.data;
};

export const getAllInstitutes = async () => {
  const res = await api.get('/api/v1i2/institute-register');
  return res.data;
};

export const getInstituteById = async (id) => {
  const res = await api.get(`/api/v1i2/institute-register/${id}`);
  return res.data;
};

export const updateInstitute = async (id, updatePayload) => {
  const res = await api.put(`/api/v1i2/institute-register/${id}`, updatePayload);
  return res.data;
};

export const deleteInstitute = async (id) => {
  const res = await api.delete(`/api/v1i2/institute-register/${id}`);
  return res.data;
};

export const loginInstitue = async (payload) => {
  const res = await api.post('/api/v1i2/institute-register/login', payload);
  return res.data;
};

export const getCurrentLoggedInInstituteService = async () => {
  try {
    const response = await api.get('/api/v1i2/institute-register/institute-fetched');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching logged-in institute:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const logoutInstituteService = async () => {
  try {
    const res = await api.get('/api/v1i2/institute-register/logout');
    return res.data;
  } catch (error) {
    console.error('❌ Error logging out:', error.response?.data?.message || error.message);
    throw error;
  }
};

