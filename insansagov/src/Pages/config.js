import axios from "axios";

export const SERVER_URLS = [
  // "https://gyapak-2.onrender.com",
  // "https://gyapak.onrender.com",
  // "https://gyapak-3.onrender.com",
  "http://localhost:5000",
  "http://localhost:5001",
  "http://localhost:5002",
  "http://localhost:8000"
];

let API_BASE_URL = SERVER_URLS[0];

export const setApiBaseUrl = (url) => {
  API_BASE_URL = url;
  console.log("🚀 Using API:", API_BASE_URL);
};

export const CheckServer = async () => {
  for (let url of SERVER_URLS) {
    try {
      console.log(`Checking server: ${url}`);
      const response = await axios.get(`${url}`, { timeout: 5000 });
      
      // Add more detailed logging
      console.log(`Response from ${url}:`, response.data);
      
      if (response.data === "Server is running perfectly !!") {
        console.log(`✅ Server ${url} is working`);
        setApiBaseUrl(url);
        return url;
      }
    } catch (err) {
      console.warn(`❌ Failed: ${url}`, err.message);
    }
  }
  return null;
};

export const getApiBaseUrl = () => API_BASE_URL;

export default API_BASE_URL;