import React, { useState } from "react";
import StateMonumentCard from "./StateMonumentCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useApi, CheckServer } from "../../Context/ApiContext";
import { formatDate } from "../../Utils/dateFormatter";
import { Calendar, MapPin } from "lucide-react";
import {
  StateComponentDescription,
  StateComponentTitle,
} from "../../constants/Constants";

const Surface = ({ className = "", children }) => (
  <div
    className={[
      "bg-white/90 backdrop-blur",
      "border-2 main-site-border-color",
      "rounded-2xl",
      "shadow-[var(--shadow-accertinity)]",
      className,
    ].join(" ")}
  >
    {children}
  </div>
);

const RegionTab = ({ name, active, onClick }) => (
  <button
    onClick={onClick}
    className={[
      "inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold",
      "border transition-all duration-200",
      active
        ? "main-site-color text-white border-transparent shadow-md shadow-purple-200"
        : "bg-white utility-secondary-color-2 border main-site-border-color hover:light-site-color",
    ].join(" ")}
  >
    <MapPin className="h-4 w-4" />
    <span>{name}</span>
  </button>
);

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
  North: ["Haryana", "Himachal Pradesh", "Punjab", "Uttar Pradesh", "Uttarakhand"],
  South: ["Andhra Pradesh", "Karnataka", "Kerala", "Tamil Nadu"],
  East: ["Bihar", "Odisha"],
  West: ["Gujarat", "Rajasthan", "Maharashtra", "Madhya Pradesh"],
};

const fetchLastUpdated = async ({ queryKey }) => {
  const [_key, apiBaseUrl] = queryKey;
  if (!apiBaseUrl) return null;

  try {
    const res = await axios.get(`${apiBaseUrl}/api/event/lastupdated`);
    return formatDate(res?.data?.data);
  } catch (error) {
    console.error("Error fetching last updated:", error);

    if (error.response || error.request) {
      const shouldRetry =
        (error.response &&
          error.response.status >= 500 &&
          error.response.status < 600) ||
        ["ECONNREFUSED", "ETIMEDOUT", "ENOTFOUND", "ERR_NETWORK"].includes(
          error.code
        );

      if (shouldRetry) {
        try {
          const url = await CheckServer();
          if (url) {
            // NOTE: setApiBaseUrl is handled in component via context; here we just return null
            // Component will rerun query when apiBaseUrl changes.
          }
        } catch (e) {
          console.error("CheckServer failed:", e);
        }
      }
    }

    return null;
  }
};

const StatesLanding = () => {
  const [region, setRegion] = useState("North");
  const { apiBaseUrl, setApiBaseUrl, setServerError } = useApi();

  const {
    data: lastUpdated,
    isLoading: isLastUpdatedLoading,
  } = useQuery({
    queryKey: ["lastUpdated", apiBaseUrl],
    queryFn: async (ctx) => {
      try {
        const res = await axios.get(`${apiBaseUrl}/api/event/lastupdated`);
        return formatDate(res?.data?.data);
      } catch (error) {
        console.error("Error fetching last updated:", error);

        if (error.response || error.request) {
          const shouldRetry =
            (error.response &&
              error.response.status >= 500 &&
              error.response.status < 600) ||
            ["ECONNREFUSED", "ETIMEDOUT", "ENOTFOUND", "ERR_NETWORK"].includes(
              error.code
            );

          if (shouldRetry) {
            try {
              const url = await CheckServer();
              if (url) setApiBaseUrl(url);
              if (error.response) setServerError(error.response.status);
            } catch (e) {
              console.error("CheckServer failed:", e);
            }
          }
        }

        return null;
      }
    },
    enabled: !!apiBaseUrl,
    staleTime: 10 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="mx-auto">
      {/* HEADER */}
      <Surface className="p-6 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-black main-site-text-color">
              {StateComponentTitle}
            </h1>
            <p className="utility-secondary-color text-sm mt-2 max-w-xl">
              {StateComponentDescription}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm utility-secondary-color-2">
            <Calendar className="h-4 w-4 main-site-text-color" />
            <span>Last updated:</span>
            <span className="font-semibold main-site-text-color">
              {isLastUpdatedLoading
                ? "Loading..."
                : lastUpdated || "Not available"}
            </span>
          </div>
        </div>
      </Surface>

      {/* REGION TABS */}
      <div className="flex overflow-x-auto space-x-2 pb-3 mb-6 scrollbar-hide">
        {Object.keys(statesByRegion).map((r) => (
          <RegionTab
            key={r}
            name={r}
            active={region === r}
            onClick={() => setRegion(r)}
          />
        ))}
      </div>

      {/* GRID */}
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
