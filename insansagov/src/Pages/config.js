// import axios from "axios";
// export const SERVER_URLS = [
//   // "https://gyapak-2.onrender.com",
//   // "https://gyapak.onrender.com",
//   // "https://gyapak-3.onrender.com",
//   "http://localhost:5000",
//   "http://localhost:5001",
//   "http://localhost:5002",
//   "http://localhost:3000"
// ];

// // let apiBaseUrl = "https://gyapak-2.onrender.com";
// let apiBaseUrl = SERVER_URLS[0];

// export const setApiBaseUrl = (url) => {
//   apiBaseUrl = url;
//   console.log("🚀 Using API:", apiBaseUrl);
// };

// export const CheckServer = async () => {
//   for (let url of SERVER_URLS) {
//     try {
//       const response = await axios.get(`${url}`);
//       if (response.data === "Server is running perfectly !!") {
//         setApiBaseUrl(url); // ✅ Store working API
//         return url; // ✅ Return working API URL
//       }
//     } catch (err) {
//       console.warn(`❌ Failed: ${url}`, err.message);
//     }
//   }
//   return null;
// };

// export default apiBaseUrl;
