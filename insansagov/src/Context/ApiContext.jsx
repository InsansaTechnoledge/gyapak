import React,{createContext, useContext, useEffect, useState} from 'react';
import axios from 'axios';


const ApiContext = createContext();


export const SERVER_URLS = [
    // "https://gyapak-2.onrender.com",
    // "https://gyapak.onrender.com",
    // "https://gyapak-3.onrender.com",
    "http://localhost:5000",
    "http://localhost:5001",
    "http://localhost:5002",
    "http://localhost:3000"
  ];
  
export const ApiProvider=({children})=>{
    const [apiBaseUrl,setApiBaseUrl]=useState(null);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(null);

    useEffect(()=>{
        async function CheckServer(){
            for(let url of SERVER_URLS){
                try{
                    const response=await axios.get(`${url}`);
                    if(response.data==="Server is running perfectly !!"){
                        setApiBaseUrl(url);
                        setLoading(false);
                        console.log("🚀 Using API:",url);
                        return;
                    }
                }
                catch(error){
                    console.warn(`❌ Failed: ${url}`, error.message);
                }
            }
            setError("🚨 No API servers are available!");
            setLoading(false);
        }
        CheckServer();
    },[]);

    return(
        <ApiContext.Provider value={{apiBaseUrl}}>
            {loading
            ?(
            <h2>Checking API Availability...</h2>)
            :error 
            ?(
            <h2>{error}</h2>)
            :(
            children)}
        </ApiContext.Provider>
    );

    
}

export const useApi = () => {
    const context = useContext(ApiContext);
    if (!context) {
      throw new Error("useApi must be used within an ApiProvider");
    }
    return context;
  };
