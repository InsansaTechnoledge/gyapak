import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gyapak-test-server.onrender.com/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true // Important for cookies / sessions
});

// Optional: request interceptor (can be omitted)
api.interceptors.request.use(
  (config) => config,
  (error) => {
    console.error('[Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a status outside 2xx
      const { status, data } = error.response;

      console.error(`[API Error ${status}]`, data?.message || error.message);

      // Optional: Customize for specific error codes
      switch (status) {
        case 400:
          console.warn('Bad Request:', data?.message);
          break;
        case 403:
          console.warn('Forbidden:', data?.message);
          break;
        case 404:
          console.warn('Not Found:', data?.message);
          break;
        case 500:
          console.error('Server Error:', data?.message);
          break;
        default:
          console.warn('Unhandled Error:', data?.message);
      }

    } else if (error.request) {
      // Request made but no response received
      console.error('No response received from server:', error.message);
    } else {
      // Something else went wrong
      console.error('API Setup Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
