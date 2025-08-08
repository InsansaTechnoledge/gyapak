import React, { useEffect, useState, useCallback, Suspense, lazy } from "react";
import axios from "axios";
import { RingLoader } from "react-spinners";
import { useApi } from "../../Context/ApiContext";
import { useQuery } from "@tanstack/react-query";

// Lazy load the components
const LatestUpdateCard = lazy(() => import("./LatestUpdateCard"));
const ViewMoreButton = lazy(() => import("../Buttons/ViewMoreButton"));

const LatestUpdates = ({ titleHidden }) => {
  const { apiBaseUrl, setApiBaseUrl, setServerError } = useApi();
  const [isExpanded, setIsExpanded] = useState(false);
  // const [latestUpdates, setLatestUpdates] = useState([]);
  const [filteredLatestUpdates, setFilteredLatestUpdates] = useState([]);

  // Toggle View More/View Less
  const handleToggle = () => {
    setFilteredLatestUpdates(
      !isExpanded ? latestUpdates : latestUpdates.slice(0, 2)
    );
    setIsExpanded(!isExpanded);
  };

  const fetchLatestUpdates = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/event/latest`);
      if (response.status === 201) {
        const sortedUpdates = response.data.sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.date_of_notification);
          const dateB = new Date(b.updatedAt || b.date_of_notification);
          return isNaN(dateA) || isNaN(dateB) ? 0 : dateB - dateA; // Sort by date descending
        });
        // setLatestUpdates(sortedUpdates.slice(0, 5));
        // setFilteredLatestUpdates(sortedUpdates.slice(0, 2));
        return sortedUpdates.slice(0, 6);
      }
    } catch (error) {
      console.error("Error fetching latest updates:", error);
      if (error.response) {
        if (error.response.status >= 500 && error.response.status < 600) {
          console.error(
            "🚨 Server Error:",
            error.response.status,
            error.response.statusText
          );
          const url = CheckServer();
          setApiBaseUrl(url), setServerError(error.response.status);
          fetchLatestUpdates();
        } else {
          console.error("Error fetching state count:", error);
        }
      } else {
        console.error("Error fetching state count:", error);
      }
    }
  };
  // Fetch latest updates from API
  // useEffect(() => {

  //   fetchLatestUpdates();
  // }, []);

  const { data: latestUpdates, isLoading } = useQuery({
    queryKey: ["latestUpdates"],
    queryFn: fetchLatestUpdates,
    staleTime: Infinity, // ✅ Data never becomes stale, preventing automatic refetch
    cacheTime: 24 * 60 * 60 * 1000, // ✅ Keeps cache alive for 24 hours in memory
    refetchOnMount: true, // ✅ Prevents refetch when component mounts again
    refetchOnWindowFocus: false, // ✅ Prevents refetch when switching tabs
  });

  useEffect(() => {
    if (latestUpdates) {
      setFilteredLatestUpdates(latestUpdates.slice(0, 2));
    }
  }, [latestUpdates]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="bg-gradient-to-r from-purple-50 to-white rounded-2xl p-6 mb-10 shadow-sm">
        <div className="flex justify-between mb-2">
          <div className="font-bold text-2xl flex items-center">
            Latest Updates for government jobs after 12th
          </div>

          <Suspense
            fallback={
              <div>
                <div className="w-full h-screen flex justify-center">
                  <RingLoader
                    size={60}
                    color={"#5B4BEA"}
                    speedMultiplier={2}
                    className="my-auto"
                  />
                </div>
              </div>
            }
          >
            {latestUpdates && latestUpdates.length > 2 ? (
              <>
                <ViewMoreButton
                  content={isExpanded ? "View Less ▲" : "View More ▼"}
                  onClick={handleToggle}
                />
              </>
            ) : null}
          </Suspense>
        </div>
        <div className=" mb-5  text-gray-500 text-sm max-w-xl mt-2">
          Just passed 12th? Government Jobs are waiting! Explore wide range of
          Government jobs after 12th, track notifications, and apply on time
          with Gyapak’s smart tools and resources. From SSC CHSL to Indian Army,
          Navy, Air Force, Police Constable, and other state-level recruitments,
          there are countless government jobs after Class 12. Gyapak brings you
          the latest updates, eligibility, and exam dates — all in one place
        </div>
      </div>

      {!titleHidden && (
        <div className="space-y-5 mb-10">
          <Suspense fallback={<div>Loading updates...</div>}>
            {filteredLatestUpdates.map((update, index) => (
              <LatestUpdateCard
                key={update._id || index}
                id={update._id}
                name={update.name}
                date={update.updatedAt || update.date_of_notification}
                organization={update.organizationName}
                apply_link={update.apply_link}
              />
            ))}
          </Suspense>
        </div>
      )}
    </>
  );
};

export default LatestUpdates;
