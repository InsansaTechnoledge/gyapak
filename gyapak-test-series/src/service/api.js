import axios from 'axios';

// Set your API base URL from environment variable or fallback
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Optional: attach auth token from localStorage if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or from context/store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
