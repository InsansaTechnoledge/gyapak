import axios from 'axios';

// Get base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle authentication errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // If response is successful, just return it
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.error('Authentication failed. Please login again.');
      
      // Clear token from localStorage
      localStorage.removeItem('token');
      
      // Redirect to login page
      // Uncomment and adjust the path based on your routing setup
      // window.location.href = '/login';
    }
    
    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      console.error('Access denied. Insufficient permissions.');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { API_BASE_URL };
