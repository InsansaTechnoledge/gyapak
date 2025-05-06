import React from "react";
import img1 from '/ggg.jpg'
import img2 from '/collage.jpg';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useApi } from "../../../Context/ApiContext";


export default function FullScreenLanding() {
  const {apiBaseUrl}=useApi();
  const fetchStateCount = async () => {
    try {
        const response = await axios.get(`${apiBaseUrl}/api/state/count`);
        return response.data;

    } catch (error) {
        if (error.response) {
            if (error.response.status >= 500 && error.response.status < 600) {
                console.error("🚨 Server Error:", error.response.status, error.response.statusText);
                const url = CheckServer();
                setApiBaseUrl(url),
                    setServerError(error.response.status);
                fetchStateCount();
            }
            else {
                console.error('Error fetching state count:', error);
            }
        }
        else {
            console.error('Error fetching state count:', error);
        }

    }
};
   const { data: stateCount, isLoading1 } = useQuery({
          queryKey: ["stateCount"],
          queryFn: fetchStateCount,
          staleTime: Infinity, // ✅ Data never becomes stale, preventing automatic refetch
          cacheTime: 24 * 60 * 60 * 1000, // ✅ Keeps cache alive for 24 hours in memory
          refetchOnMount: true, // ✅ Prevents refetch when component mounts again
          refetchOnWindowFocus: false, // ✅ Prevents refetch when switching tabs
      });
  return (
    <div className="w-full h-screen flex flex-col lg:flex-row overflow-hidden">
      <div className="relative h-full w-full flex items-center justify-center">
        <>
          <img
            src={img2}
            alt="Mobile Background"
            className="absolute inset-0 w-full h-full object-cover z-0 sm:hidden"
          />
          <img
            src={img1}
            alt="Desktop Background"
            className="absolute inset-0 w-full h-full object-cover z-0 hidden sm:block"
          />
        </>

        {/* ✅ Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-blue-800/50 to-purple-700/60" />
        <div className="absolute inset-0 bg-black/30" />

        {/* ✅ Foreground Content */}
        <div className="relative z-20 w-full max-w-4xl px-4 sm:px-6 py-10 sm:py-16 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-center leading-tight">
            Upcoming
            <span className="text-purple-300"> Government Exams</span>
            <span className="block mt-2 text-white">{`${new Date().getFullYear()} Latest Information`}</span>
          </h1>

          <p className="text-gray-200 text-center mb-8 max-w-xl text-lg sm:text-xl">
            Your Ultimate Resource for <span className="text-purple-300">Government Jobs After 12th</span>
          </p>
{/* 
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-2xl px-4"> */}
          <div className="mt-6 flex justify-center w-full px-4">

            <div className="flex flex-col items-center p-4 sm:p-5 bg-purple-500/30 backdrop-blur-md border border-purple-400/40 rounded-2xl shadow-lg transition-all duration-300 hover:bg-purple-500/40">
              <span className="text-3xl font-bold text-white mb-1">{stateCount?.exams}</span>
              <span className="text-sm text-gray-200 font-medium">Active Exams</span>
            </div>
            {/* <div className="flex flex-col items-center p-4 sm:p-5 bg-blue-500/30 backdrop-blur-md border border-blue-400/40 rounded-2xl shadow-lg transition-all duration-300 hover:bg-blue-500/40">
              <span className="text-3xl font-bold text-white mb-1">10K+</span>
              <span className="text-sm text-gray-200 font-medium">Vacancies</span>
            </div>
            <div className="flex flex-col items-center p-4 sm:p-5 bg-indigo-500/30 backdrop-blur-md border border-indigo-400/40 rounded-2xl shadow-lg transition-all duration-300 hover:bg-indigo-500/40">
              <span className="text-3xl font-bold text-white mb-1">50+</span>
              <span className="text-sm text-gray-200 font-medium">Sectors</span>
            </div> */}
          </div>

          <div className="mt-10 flex flex-col items-center w-full">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center bg-white/15 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 shadow-lg">
                <svg className="w-6 h-6 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-white font-medium">Verified Info</span>
              </div>
              <div className="flex items-center bg-white/15 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 shadow-lg">
              <div className="relative mr-2">
                {/* Outer Dark Green Circle */}
                <div className="w-6 h-6 rounded-full bg-green-700 flex items-center justify-center">
                  {/* Inner Light Green Circle */}
                  <div className="w-4 h-4 rounded-full bg-green-400 flex items-center justify-center">
                    {/* Checkmark Icon */}
                    {/* <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg> */}
                  </div>
                </div>
              </div>

              <span className="text-sm text-white font-medium">Updated Daily</span>
            </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
