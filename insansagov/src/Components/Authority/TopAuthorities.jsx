import React, { lazy, Suspense, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { RingLoader } from "react-spinners";
import { useQuery } from "@tanstack/react-query";
import { useApi, CheckServer } from "../../Context/ApiContext";

const TopAuthoritiesCarousel = lazy(() => import("./TopAuthoritiesCarousel"));

const TopAuthorities = (props) => {
  const { apiBaseUrl, setApiBaseUrl, setServerError } = useApi();
  const [page, setPage] = useState(1);
  const [allOrganizations, setAllOrganizations] = useState([]);

  // 1. Initialize limit based on current screen width
  const [limit, setLimit] = useState(window.innerWidth < 768 ? 6 : 14);

  // 2. Listen for resize to adjust limit dynamically
  useEffect(() => {
    const handleResize = () => {
      const newLimit = window.innerWidth < 768 ? 6 : 14;
      setLimit((prev) => {
        // Only update and reset if the breakpoint category actually changes
        if (prev !== newLimit) {
          setPage(1); // Reset to page 1 to avoid data gaps
          setAllOrganizations([]); // Clear existing list to prevent duplicates/mismatches
          return newLimit;
        }
        return prev;
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchLogos = async ({ queryKey }) => {
    const [_key, apiBaseUrl, page, currentLimit] = queryKey; // Receive limit from key

    try {
      const response = await axios.get(`${apiBaseUrl}/api/organization/logo`, {
        params: {
          page,
          limit: currentLimit,
        },
      });

      if (response.status === 200) {
        return response.data;
      }
      return { data: [], total: 0, page, limit: currentLimit };
    } catch (error) {
      console.error("Error fetching organizations:", error);
      if (error.response || error.request) {
        if (
          (error.response &&
            error.response.status >= 500 &&
            error.response.status < 600) ||
          ["ECONNREFUSED", "ETIMEDOUT", "ENOTFOUND", "ERR_NETWORK"].includes(
            error.code
          )
        ) {
          const url = await CheckServer();
          setApiBaseUrl(url);
          if (error.response) setServerError(error.response.status);
        }
      }
      return { data: [], total: 0, page, limit: currentLimit };
    }
  };

  // 3. Include 'limit' in the query key so it refetches when screen size category changes
  const { data, isLoading } = useQuery({
    queryKey: ["fetchLogos", apiBaseUrl, page, limit],
    queryFn: fetchLogos,
    keepPreviousData: true,
    staleTime: Infinity,
    cacheTime: 24 * 60 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const organizations = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    if (organizations.length > 0) {
      setAllOrganizations((prev) => {
        const existingIds = new Set(prev.map((org) => org._id));
        const newOrgs = organizations.filter(
          (org) => !existingIds.has(org._id)
        );
        return [...prev, ...newOrgs];
      });
    }
  }, [organizations]);

  const carouselOrganizations = useMemo(() => {
    return allOrganizations.length > 0 ? allOrganizations : organizations;
  }, [allOrganizations, organizations]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const isInitialLoading =
    isLoading && page === 1 && allOrganizations.length === 0;

  if (isInitialLoading) {
    return (
      <div className="w-full flex flex-col justify-center mb-10 overflow-hidden">
        <h1 className="flex text-center text-2xl justify-center mb-5 font-bold">
          {`Central authorities hosting upcoming government exams ${new Date().getFullYear()}`}
        </h1>
        <div className="flex justify-center">
          <RingLoader
            size={60}
            color={"#5B4BEA"}
            speedMultiplier={2}
            className="my-auto"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[95vw] overflow-hidden">
      {/* Wrapper to contain overflow */}
      {props.titleHidden ? null : (
        <h1 className="flex text-center text-lg md:text-2xl justify-center mb-5 font-bold px-4">
          {`Central authorities hosting upcoming government exams ${new Date().getFullYear()}`}
        </h1>
      )}
      <Suspense
        fallback={
          <div className="w-full flex justify-center py-10">
            <RingLoader
              size={60}
              color={"#5B4BEA"}
              speedMultiplier={2}
              className="my-auto"
            />
          </div>
        }
      >
        {carouselOrganizations.length > 0 && (
          <TopAuthoritiesCarousel
            organizations={carouselOrganizations}
            onLoadMore={handleLoadMore}
            hasMore={page < totalPages}
            isFetchingMore={isLoading} // Fixed prop name to match logic
          />
        )}
      </Suspense>
    </div>
  );
};

export default TopAuthorities;
