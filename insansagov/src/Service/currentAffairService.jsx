import axios from 'axios';
const API_BASE_URL="https://35.175.38.246/" || "https://gyapak-admin2.onrender.com";
// const API_BASE_URL="http://localhost:3000";


export const fetchCurrentAffairs = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/v1i2/affair/all`, { withCredentials: true });
    return res.data;
  };
  




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

  export const fetchAffairDetail = async (date, slug) => {
    const res = await axios.get(`${API_BASE_URL}/api/v1i2/affair/single/${date}/${slug}`);
    return res.data;
  };