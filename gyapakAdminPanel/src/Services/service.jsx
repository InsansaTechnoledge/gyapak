// services/adminBlog.service.js
import axios from 'axios';


import { API_BASE_URL } from '../config';

export const createBlog = async (blogData) => {
  const response = await axios.post(`${API_BASE_URL}/api/v1i2/blog`, blogData, {
    withCredentials: true, // If admin panel uses cookies/token
  });
  return response.data;
};

export const updateBlog = async (id, blogData) => {
  const response = await axios.put(`${API_BASE_URL}/api/v1i2/blog/${id}`, blogData, {
    withCredentials: true,
  });
  return response.data;
};

export const deleteBlog = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/api/v1i2/blog/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export const getAllBlogsForAdmin = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/v1i2/blog`, {
    withCredentials: true,
  });
  return response.data;
};


// export const uploadCurrentAffair = async ({ date, affairs }) => {
//   const payload = {
//     date,
//     affairs: affairs.map((a) => ({
//       ...a,
//       tags: Array.isArray(a.tags)
//         ? a.tags
//         : a.tags.split(',').map(tag => tag.trim()).filter(Boolean)
//     }))
//   };

//   const res = await axios.post(`${API_BASE_URL}/api/v1i2/affair/upload`, payload, {
//     withCredentials: true,
//   });
//   return res.data;
// };

export const uploadCurrentAffair = async ({ date, affairs }) => {
  const formattedAffairs = affairs.map((a) => ({
    ...a,
    tags: Array.isArray(a.tags)
      ? a.tags
      : a.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    questions: a.questions || [] // ensure questions array is passed
  }));

  const payload = {
    date,
    month: new Date(date).getMonth() + 1,
    year: new Date(date).getFullYear(),
    affairs: formattedAffairs
  };

  const res = await axios.post(`${API_BASE_URL}/api/v1i2/affair/upload`, payload, {
    withCredentials: true,
  });
  return res.data;
};


export const updateCurrentAffairById = async (id, payload) => {
  const res = await axios.put(`${API_BASE_URL}/api/v1i2/affair/update/${id}`, payload, {
    withCredentials: true,
  });
  return res.data;
};

export const fetchCurrentAffairs = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/v1i2/affair/all`, {
    withCredentials: true
  });
  return res.data;
};

export const deleteCurrentAffairById = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/api/v1i2/affair/delete/${id}`, {
    withCredentials: true
  });
  return res.data;
};

// Event Management Services
export const fetchAllEvents = async () => {
  try {
    console.log('Making request to:', `${API_BASE_URL}/api/v1i2/event`);
    const res = await axios.get(`${API_BASE_URL}/api/v1i2/event`, {
      withCredentials: true
    });
    console.log('Response received:', res.data);
    return res.data;
  } catch (error) {
    console.error('Service error:', error);
    throw error;
  }
};

export const getEventById = async (eventId) => {
  const res = await axios.get(`${API_BASE_URL}/api/v1i2/event/${eventId}`, {
    withCredentials: true
  });
  return res.data;
};

export const updateEventById = async (id, eventData) => {
  const res = await axios.post(`${API_BASE_URL}/api/v1i2/event/${id}`, eventData, {
    withCredentials: true
  });
  return res.data;
};

export const deleteEventById = async (organizationId, eventId) => {
  const res = await axios.delete(`${API_BASE_URL}/api/v1i2/event`, {
    data: { organizationId, eventId },
    withCredentials: true
  });
  return res.data;
};

