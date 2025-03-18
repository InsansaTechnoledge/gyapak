import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { RingLoader } from 'react-spinners';
import ServerPage from '../Pages/Error/ServerPage';


const ApiContext = createContext();


export const SERVER_URLS = [
    // "https://gyapak-2.onrender.com",
    // "https://gyapak.onrender.com",
    // "https://gyapak-3.onrender.com",
    // "https://gyapak-4.onrender.com"
    // "http://localhost:5000",
    // "http://localhost:3000",
    "http://89.116.33.66"
  ];

  export const CheckServer = async () => {
    for (let url of SERVER_URLS) {
      try {
        const response = await axios.get(`${url}`);
        if (response.data === "Server is running perfectly !!") {
          // console.log("🚀 Using API:", url);
          return url; // ✅ Return working API URL
        }
      } catch (err) {
        console.warn(`❌ Failed: ${url}`, err.message);
      }
    }
    return null;
  };
  
  export const ApiProvider = ({ children }) => {
    const [apiBaseUrl, setApiBaseUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [serverError, setServerError] = useState(503);
  
    useEffect(() => {
      const Check = async () => {
        try {
          const url = await CheckServer();
          if (url) {
            setApiBaseUrl(url);
            setLoading(false);
            // console.log("✅ API Set:", url);
          } else {
            setError("🚨 No API servers are available!");
            setLoading(false);
          }
        } catch (err) {
          console.error("❌ API check failed:", err.message);
          setError("🚨 No API servers are available!");
          setLoading(false);
        }
      };
  
      Check();
    }, []);

    useEffect(() => {
      if (!apiBaseUrl) {
        setError("🚨 No API servers are available!");
      }
      else{
        setError(null);
      }

    }, [apiBaseUrl]);
  
    if (loading) {
      return (
        <div className="w-full h-screen flex justify-center">
          <RingLoader size={60} color={"#5B4BEA"} speedMultiplier={2} className="my-auto" />
        </div>
      );
    }
  
    if (error) {
      return <ServerPage code={serverError} message={"Oops! Something went wrong :("} subMessage={"We'll be right back :)"} />;
    }
  
    return <ApiContext.Provider value={{ apiBaseUrl, setApiBaseUrl ,setServerError}}>{children}</ApiContext.Provider>;
  };
  
  export const useApi = () => {
    const context = useContext(ApiContext);
    // console.log("🚀 Using API:", context.apiBaseUrl);

    if (!context) {
      throw new Error("useApi must be used within an ApiProvider");
    }
    return context;
  };