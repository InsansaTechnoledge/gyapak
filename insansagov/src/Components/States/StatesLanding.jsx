import React, { useState } from "react";
import StateMonumentCard from "./StateMonumentCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useApi } from "../../Context/ApiContext";
import { formatDate } from "../../Utils/dateFormatter";
import { Calendar, MapPin, ChevronRight } from "lucide-react";

const StatesLanding = () => {
  const [region, setRegion] = useState("North");
  const { apiBaseUrl, setApiBaseUrl, setServerError } = useApi();

  const stateImages = {
    Gujarat: "/states/Gujarat.png",
    Haryana: "/states/Haryana.png",
    Bihar: "/states/Bihar.png",
    Karnataka: "/states/Karnataka.png",
    Kerala: "/states/Kerala.png",
    Maharashtra: "/states/Maharashtra.png",
    Odisha: "/states/Odisha.png",
    Punjab: "/states/Punjab.png",
    Rajasthan: "/states/Rajasthan.png",
    "Uttar Pradesh": "/states/UttarPradesh2.jpg",
    "Madhya Pradesh": "/states/Madhya Pradesh.png",
    "Tamil Nadu": "/states/Tamil_Nadu.png",
    Uttarakhand: "/states/Uttarakhand.png",
    "Andhra Pradesh": "/states/Andhra_Pradesh.png",
    "Himachal Pradesh": "/states/Himachal_Pradesh.png",
  };

  const statesByRegion = {
    North: [
      "Haryana",
      "Himachal Pradesh",
      "Punjab",
      "Uttar Pradesh",
      "Uttarakhand",
    ],
    South: ["Andhra Pradesh", "Karnataka", "Kerala", "Tamil Nadu"],
    East: ["Bihar", "Odisha"],
    West: ["Gujarat", "Rajasthan", "Maharashtra", "Madhya Pradesh"],
  };

  const RegionTab = ({ name, active, onClick }) => (
    <button
      className={`px-6 py-2 rounded-full transition-all duration-300 ${
        active
          ? "bg-purple-600 text-white shadow-md shadow-purple-200"
          : "bg-white text-gray-600 hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      {name}
    </button>
  );

  const fetchLastUpdated = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/event/lastupdated`);
      // setLastUpdated(formatDate(response.data.data));
      return formatDate(response.data.data);
    } catch (error) {
      if (error.response) {
        if (error.response.status >= 500 && error.response.status < 600) {
          console.error(
            "🚨 Server Error:",
            error.response.status,
            error.response.statusText
          );
          const url = CheckServer();
          setApiBaseUrl(url), setServerError(error.response.status);
          fetchLastUpdated();
        } else {
          console.error("Error fetching state count:", error);
        }
      } else {
        console.error("Error fetching state count:", error);
      }
    }
  };

  const { data: lastUpdated, isLoading2 } = useQuery({
    queryKey: ["lastUpdated"],
    queryFn: fetchLastUpdated,
    staleTime: Infinity, // ✅ Data never becomes stale, preventing automatic refetch
    cacheTime: 24 * 60 * 60 * 1000, // ✅ Keeps cache alive for 24 hours in memory
    refetchOnMount: true, // ✅ Prevents refetch when component mounts again
    refetchOnWindowFocus: false, // ✅ Prevents refetch when switching tabs
  });

  if (isLoading2) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-purple-50 to-white rounded-2xl p-6 mb-10 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div>
            <div className="flex justify-between gap-10">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                State Government Opportunities
              </h1>
            </div>

            <p className="text-gray-500 text-sm max-w-xl mt-2 ">
              Explore State-Level upcoming Government Exams 2025 whether you're
              targeting teaching jobs, police recruitment, PSC exams, or
              clerical posts in state government, Gyapak helps you track every
              government job opportunity in your state.
            </p>
          </div>
        </div>
        <div className="flex  lg:justify-end items-center text-gray-500 text-xs text-left mt-4 lg:text-right w-full lg:mt-1">
          <Calendar size={16} className="mr-1 text-purple-500" />
          Last updated:{" "}
          <span className="ml-1 font-medium text-purple-600">
            {lastUpdated}
          </span>
        </div>
      </div>

      <div className="flex overflow-x-auto space-x-2 pb-4 mb-8 scrollbar-hide">
        {Object.keys(statesByRegion).map((r) => (
          <RegionTab
            key={r}
            name={r}
            active={region === r}
            onClick={() => setRegion(r)}
          />
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statesByRegion[region].map((state) => (
          <StateMonumentCard
            key={state}
            state={state}
            region={region}
            img={stateImages[state]}
          />
        ))}
      </div>
    </div>
  );
};

export default StatesLanding;
