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
