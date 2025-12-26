import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTodaysEvents } from "../../../Service/calendar";
import { useApi } from "../../../Context/ApiContext";
import { generateSlugUrl } from "../../../Utils/urlUtils.utils";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import slugGenerator from "../../../Utils/SlugGenerator";
import { useEventRouting } from "../../../Utils/useEventRouting";
import { GovCalendarBottomLinkText, GovCalendarTitle } from "../../../constants/Constants";

const GovCalendar = () => {
  const { apiBaseUrl } = useApi();
  const navigate = useNavigate();

  // inside GovCalendar component


  // Calculate events per page based on screen size
  const getEventsPerPage = (width) => {
    if (width < 640) return 6; // Mobile
    if (width < 1024) return 8; // Tablet
    return 12; // Desktop
  };

  const { getEventHref, handleEventClick, prefetchEventRoute } = useEventRouting({
    fallback: "old", 
  });
  

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  const [itemsPerPage, setItemsPerPage] = useState(() =>
    getEventsPerPage(typeof window !== "undefined" ? window.innerWidth : 1200)
  );

  // Handle window resize
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
      setItemsPerPage(getEventsPerPage(newWidth));

      if (newWidth < 640) setViewMode("list"); // Always list on mobile
      setCurrentPage(1);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    data: todayEvents = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todaysEvents", apiBaseUrl],
    queryFn: () => fetchTodaysEvents(apiBaseUrl),
    enabled: !!apiBaseUrl,
    staleTime: 5 * 60 * 1000, // 5 min (Infinity can stop updates)
    gcTime: 24 * 60 * 60 * 1000, // react-query v5 (was cacheTime in v4)
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return Array.isArray(todayEvents) ? todayEvents : [];
    return (Array.isArray(todayEvents) ? todayEvents : []).filter((event) =>
      event.name?.toLowerCase().includes(q)
    );
  }, [todayEvents, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / itemsPerPage));

  const indexOfLastEvent = currentPage * itemsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;

  const currentEvents = useMemo(() => {
    return filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  }, [filteredEvents, indexOfFirstEvent, indexOfLastEvent]);

  const goToPage = (pageNumber) => {
    const next = Math.min(Math.max(1, pageNumber), totalPages);
    setCurrentPage(next);
  };

  const handleItemsPerPageChange = (newPerPage) => {
    const firstItemIndex = (currentPage - 1) * itemsPerPage;
    const newPage = Math.floor(firstItemIndex / newPerPage) + 1;
    setItemsPerPage(newPerPage);
    setCurrentPage(newPage);
  };
  
  return (
    <div className="mt-10 ">
      <div className=" mx-auto ">
       
        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search exams, events..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border main-site-border-color-2 rounded-lg "
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 utility-secondary-color-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Only show grid/list toggle on tablet and larger screens */}
          {windowWidth >= 640 && (
            <div className="flex items-center space-x-4">
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "light-site-color-3 main-site-text-color" : "utility-secondary-color"}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "light-site-color-3 main-site-text-color" : "utility-secondary-color"}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main content area */}
        <div className=" rounded-lg shadow-md overflow-hidden border main-site-border-color-2 calendar-results">
          <div className="main-site-color px-4 py-3 flex justify-between items-center">
            <h3 className="text-lg font-bold secondary-site-text-color">{GovCalendarTitle} {today}</h3>
            <span className="text-xs bg-white/20 secondary-site-text-color px-2 py-1 rounded-full">
              {filteredEvents.length} {filteredEvents.length === 1 ? "Event" : "Events"}
            </span>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 main-site-border-color-3 border-t-transparent" />
              <p className="mt-2 main-site-text-color">Loading events...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center main-site-text-error-color">
              <p>Failed to load events. Please try again later.</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <>
              {windowWidth >= 640 && viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                  {currentEvents.map((event) => (
                    <Link
                      key={event._id}
                      to={getEventHref(event)}
                      onClick={(e) => handleEventClick(e, event)}
                      onMouseEnter={() => prefetchEventRoute(event)} 
                      className="block p-4 border main-site-border-color rounded-lg hover:main-site-border-color-3 hover:shadow-md transition-all"
                    >
                      <h4 className="font-medium main-site-text-color mb-2">{event.name}</h4>
                      {event.date && <p className="text-sm utility-secondary-color mb-2">{event.date}</p>}
                      {event.status && (
                        <span className="inline-block px-2 py-1 text-xs rounded-full light-site-color main-site-text-color">
                          {event.status}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-purple-100">
                  {currentEvents.map((event) => (
                    <Link
                      key={event._id}
                      to={getEventHref(event)}
                      onClick={(e) => handleEventClick(e, event)}
                      onMouseEnter={() => prefetchEventRoute(event)} // optional
                      className="block p-4 border main-site-border-color rounded-lg hover:main-site-border-color-3 hover:shadow-md transition-all"
                    >
                      <div>
                        <h4 className="font-medium main-site-text-color">{event.name}</h4>
                        {event.date && <p className="text-sm utility-secondary-color">{event.date}</p>}
                      </div>
                      {event.status && (
                        <span className="px-2 py-1 text-xs rounded-full light-site-color main-site-text-color whitespace-nowrap">
                          {event.status}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <label htmlFor="itemsPerPage" className="mr-2 text-sm utility-secondary-color">
                        Show:
                      </label>
                      <select
                        id="itemsPerPage"
                        className="border border-gray-300 rounded-md text-sm"
                        value={itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value, 10))}
                      >
                        <option value="6">6</option>
                        <option value="12">12</option>
                        <option value="24">24</option>
                        <option value="48">48</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between items-center w-full sm:hidden">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        currentPage === 1 ? "utility-secondary-color-2 cursor-not-allowed" : "main-site-text-color hover:light-site-color-3"
                      }`}
                    >
                      Previous
                    </button>

                    <span className="text-sm utility-secondary-color">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        currentPage === totalPages ? "utility-secondary-color-2 cursor-not-allowed" : "main-site-text-color hover:light-site-color-3"
                      }`}
                    >
                      Next
                    </button>
                  </div>

                  <div className="hidden sm:flex sm:items-center sm:justify-between">
                    <p className="text-sm utility-secondary-color">
                      Showing <span className="font-medium">{indexOfFirstEvent + 1}</span> to{" "}
                      <span className="font-medium">
                        {Math.min(indexOfLastEvent, filteredEvents.length)}
                      </span>{" "}
                      of <span className="font-medium">{filteredEvents.length}</span> results
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-2 rounded-md border text-sm ${
                          currentPage === 1 ? "bg-gray-100 utility-secondary-color-2" : " utility-secondary-color hover:light-site-color-3"
                        }`}
                      >
                        Prev
                      </button>

                      <span className="text-sm utility-secondary-color">
                        {currentPage} / {totalPages}
                      </span>

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-2 rounded-md border text-sm ${
                          currentPage === totalPages ? "bg-gray-100 utility-secondary-color-2" : "bg-white utility-secondary-color hover:bg-gray-50"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center utility-secondary-color">
              <p className="mt-2">No events found</p>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="mt-2 main-site-text-color hover:main-site-text-color"
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {filteredEvents.length > 0 && (
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-center">
              <Link to="/government-calendar" className="text-sm main-site-text-color hover:main-site-text-color font-medium">
                {GovCalendarBottomLinkText}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GovCalendar;
