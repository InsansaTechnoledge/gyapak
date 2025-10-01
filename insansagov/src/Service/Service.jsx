// services/mainBlog.service.js
import axios from 'axios';

// import { API_BASE_URL } from '../../../gyapakAdminPanel/src/config';
//Prod URL
const API_BASE_URL="https://admin.harshvaidya.tech" || "https://gyapak-admin2.onrender.com";
// DEV URL
// const API_BASE_URL="http://localhost:3000";

// export const getAllBlogs = async (tag = null) => {
//   const url = tag ? `${API_BASE_URL}/api/v1i2/blog/?tag=${tag}` : `${API_BASE_URL}`;
//   const response = await axios.get(url);
//   return response.data;
// };

export const getAllBlogs = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/v1i2/blog`);
    return response.data.data || response.data;
  };
  
export const getBlogBySlug = async (slug) => {
  const response = await axios.get(`${API_BASE_URL}/api/v1i2/blog/slug/${slug}`);
  return response.data;
};

export const getFeaturedBlogs = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/v1i2/blog/featured`);
  return response.data;
};

export const searchBlogs = async (keyword) => {
  const response = await axios.get(`${API_BASE_URL}/api/v1i2/blog/search?keyword=${encodeURIComponent(keyword)}`);
  return response.data;
};

export const getRelatedBlogs = async (slug) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1i2/blog/related/${slug}`);
      return response.data.data || []; 
    } catch (error) {
      console.error('❌ Error fetching related blogs:', error);
      return []; 
    }
  };