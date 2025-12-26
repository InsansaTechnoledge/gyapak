import React, { useEffect, useMemo, useState, Suspense, lazy } from "react";
import axios from "axios";
import { RingLoader } from "react-spinners";
import { useApi } from "../../Context/ApiContext";
import { useQuery } from "@tanstack/react-query";
import { LatestUpdatesDescription, LatestUpdatesTitle } from "../../constants/Constants";

// Lazy load the components
const LatestUpdateCard = lazy(() => import("./LatestUpdateCard"));

const LatestUpdates = ({ titleHidden }) => {
  const { apiBaseUrl, setApiBaseUrl, setServerError } = useApi();

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10; // same as your previous "collapsed" view

  const fetchLatestUpdates = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/event/latest`, {
        withCredentials: true,
      });

      // NOTE: Usually GET returns 200. If your API returns 201, keep it.
      if (response.status === 201 || response.status === 200) {
        const sortedUpdates = (response.data || []).sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.date_of_notification);
          const dateB = new Date(b.updatedAt || b.date_of_notification);
          if (isNaN(dateA) || isNaN(dateB)) return 0;
          return dateB - dateA;
        });

        return sortedUpdates.slice(0, 100);
      }

      return [];
    } catch (error) {
      console.error("Error fetching latest updates:", error);

      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        // If you have CheckServer() in your context, keep it.
        // Otherwise remove these lines.
        try {
          const url = CheckServer();
          setApiBaseUrl(url);
          setServerError(error.response.status);
          return await fetchLatestUpdates();
        } catch (e) {
          return [];
        }
      }

      return [];
    }
  };

  const { data: latestUpdates = [], isLoading } = useQuery({
    queryKey: ["latestUpdates", apiBaseUrl],
    queryFn: fetchLatestUpdates,
    enabled: !!apiBaseUrl,
    staleTime: 5 * 60 * 1000, // 5 min is safer than Infinity for "latest"
    gcTime: 24 * 60 * 60 * 1000, // react-query v5 (was cacheTime in v4)
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [latestUpdates?.length]);

  const totalPages = Math.max(1, Math.ceil(latestUpdates.length / ITEMS_PER_PAGE));

  const pagedUpdates = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return latestUpdates.slice(start, start + ITEMS_PER_PAGE);
  }, [latestUpdates, currentPage]);

  const goToPage = (page) => {
    const next = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(next);
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex justify-center items-center">
        <RingLoader />
      </div>
    );
  }

  return (
    <>
      <div className="light-site-color-3 rounded-2xl p-6 mb-10 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <div className="font-bold main-site-text-color text-2xl flex items-center">
            {LatestUpdatesTitle}
          </div>

          {/* Pagination mini info in header */}
          {latestUpdates.length > 0 && (
            <div className="text-sm utility-secondary-color">
              Page <span className="font-semibold">{currentPage}</span> /{" "}
              <span className="font-semibold">{totalPages}</span>
            </div>
          )}
        </div>

        <div className="mb-5 utility-secondary-color text-sm max-w-xl mt-2">
          {LatestUpdatesDescription}
        </div>
      </div>

      {!titleHidden && (
        <div className="space-y-5 mb-6">
          <Suspense fallback={<div>Loading updates...</div>}>
            {pagedUpdates.map((update, index) => (
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

      {/* Pagination Controls */}
      {!titleHidden && latestUpdates.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between gap-3 border main-site-border-color rounded-xl px-4 py-3">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-md border text-sm ${
              currentPage === 1
                ? "light-site-color utility-scondary-color-3 cursor-not-allowed"
                : " bg-white main-site-text-color hover:light-site-color-3"
            }`}
          >
            Prev
          </button>

          {/* Page numbers (compact) */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => {
              const page = i + 1;
              const active = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`h-9 w-9 rounded-md text-sm border ${
                    active
                      ? "main-site-color text-white main-site-border-color-4"
                      : "bg-white utility-secondary-color hover:ght-site-color-3  main-site-border-color-2"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {totalPages > 7 && (
              <>
                <span className="text-gray-400 px-1">…</span>
                <button
                  onClick={() => goToPage(totalPages)}
                  className={`h-9 w-9 rounded-md text-sm border ${
                    currentPage === totalPages
                      ? "main-site-color text-white main-site-border-color-4"
                      : "bg-white utility-secondary-color hover:ght-site-color-3  main-site-border-color-2"
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-md border text-sm ${
              currentPage === totalPages
                ? "light-site-color utility-scondary-color-3 cursor-not-allowed"
                : "bg-white main-site-text-color hover:light-site-color-3"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default LatestUpdates;
