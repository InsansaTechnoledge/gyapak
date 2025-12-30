import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { RingLoader } from "react-spinners";
import ServerPage from "../Pages/Error/ServerPage";

const ApiContext = createContext();

const SERVER_URLS = import.meta.env.VITE_API_BASE_URL;

export const CheckServer = async () => {
  for (let url of SERVER_URLS) {
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        return url;
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

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center">
        <RingLoader
          size={60}
          color={"#5B4BEA"}
          speedMultiplier={2}
          className="my-auto"
        />
      </div>
    );
  }

  if (error) {
    return (
      <ServerPage
        code={serverError}
        message={"Oops! Something went wrong :("}
        subMessage={"We'll be right back :)"}
      />
    );
  }

  return (
    <ApiContext.Provider value={{ apiBaseUrl, setApiBaseUrl, setServerError }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};
