import api from './api';

// ✅ Create a new subject
export const createSubject = async (payload) => {
  // payload: { name, description }
  const res = await api.post('/api/v1i2/subject/new-subject', payload);
  return res.data;
};

// ✅ Get all subjects
export const getAllSubjects = async () => {
  const res = await api.get('/api/v1i2/subject/all-subjects');
  return res.data;
};

// ✅ Update subject by ID — FIXED method
export const updateSubject = async (id, payload) => {
  // payload: { name, description }
  const res = await api.patch(`/api/v1i2/subject/update-subject/${id}`, payload); // changed PUT ➜ PATCH
  return res.data;
};

// ✅ Delete subject by ID
export const deleteSubject = async (id) => {
  const res = await api.delete(`/api/v1i2/subject/delete-subject/${id}`);
  return res.data;
};

// ✅ Get subjects by event
export const getSubjectsByEvent = async (id) => {
  const res = await api.get(`/api/v1i2/subject/by-event/${id}`);
  return res.data;
};
