import axios from 'axios';

// import { API_BASE_URL } from '../../../gyapakAdminPanel/src/config';

export const fetchCurrentAffairs = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/v1i2/affair/all`, { withCredentials: true });
    return res.data;
  };
  

const API_BASE_URL="https://gyapak-admin2.onrender.com";
// const API_BASE_URL="http://localhost:3000";


export const fetchTodaysAffairs = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/v1i2/affair/today`, { withCredentials: true });
    return res.data;
  };
  
  // 📆 Month+Year
  export const fetchMonthlyAffairs = async (month, year) => {
    const res = await axios.get(`${API_BASE_URL}/api/v1i2/affair/month?month=${month}&year=${year}`, {
      withCredentials: true
    });
    return res.data;
  };
  
  // 📅 Year
  export const fetchYearlyAffairs = async (year) => {
    const res = await axios.get(`${API_BASE_URL}/api/v1i2/affair/year?year=${year}`, {
      withCredentials: true
    });
    return res.data;
  };