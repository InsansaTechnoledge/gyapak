import axios from "axios";
export const SERVER_URLS = [
  // "https://gyapak-2.onrender.com",
  // "https://gyapak.onrender.com",
  // "https://gyapak-3.onrender.com",
  "http://localhost:5000",
  "http://localhost:5001",
  "http://localhost:5002",
  "http://localhost:3000"
];

// let API_BASE_URL = "https://gyapak-2.onrender.com";
let API_BASE_URL = "http://localhost:3000";

export const setApiBaseUrl = (url) => {
  API_BASE_URL = url;
  console.log("🚀 Using API:", API_BASE_URL);
};

export const CheckServer = async () => {
  for (let url of SERVER_URLS) {
    try {
      const response = await axios.get(`${url}`);
      if (response.data === "Server is running perfectly !!") {
        setApiBaseUrl(url); // ✅ Store working API
        return url; // ✅ Return working API URL
      }
    } catch (err) {
      console.warn(`❌ Failed: ${url}`, err.message);
    }
  }
  return null; 
};

export default API_BASE_URL;
