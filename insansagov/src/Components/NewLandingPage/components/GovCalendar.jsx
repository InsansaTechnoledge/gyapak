import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTodaysEvents } from "../../../Service/calendar";
import { useApi } from "../../../Context/ApiContext";
import slugGenerator from "../../../Utils/SlugGenerator";

const GovCalendar = () => {
  const { apiBaseUrl } = useApi();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("list"); // Default to 'list' for all devices
  const [currentPage, setCurrentPage] = useState(1);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [itemsPerPage, setItemsPerPage] = useState(
    getEventsPerPage(windowWidth)
  );

  // Calculate events per page based on screen size
  function getEventsPerPage(width) {
    if (width < 640) {
      // Mobile
      return 6;
    } else if (width < 1024) {
      // Tablet
      return 8;
    } else {
      // Desktop
      return 12;
    }
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
      setItemsPerPage(getEventsPerPage(newWidth));

      // Set viewMode based on screen size
      if (newWidth < 640) {
        // Mobile
        setViewMode("list"); // Always list view on mobile
      }

      // Reset to first page when screen size changes to prevent empty pages
      setCurrentPage(1);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      // Initial call to set correct width and viewMode
      handleResize();
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  const {
    data: todayEvents = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todaysEvents"],
    queryFn: () => fetchTodaysEvents(apiBaseUrl),
    staleTime: Infinity,
    cacheTime: 24 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const filteredEvents = todayEvents.filter((event) =>
    event.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const indexOfLastEvent = currentPage * itemsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  // Handle page changes
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of results when changing pages
    // document.querySelector('.calendar-results')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newPerPage) => {
    const firstItemIndex = (currentPage - 1) * itemsPerPage;
    const newPage = Math.floor(firstItemIndex / newPerPage) + 1;
    setItemsPerPage(newPerPage);
    setCurrentPage(newPage);
  };

  return (
    <div className="bg-white mt-16 mb-16">
      <div className=" mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-50 to-white rounded-2xl p-6 mb-10 shadow-sm">
          <div className="lg:flex lg:items-center lg:justify-between mb-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-purple-800 sm:text-4xl">
              <span className="block capitalize">
                upcoming government exams
              </span>
              <span className="block text-purple-600 text-2xl mt-2 capitalize ">{`Latest for ${new Date().getFullYear()} at Gyapak with government calendar`}</span>
            </h2>
            <div className="mt-6 lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <a
                  href="/government-calendar"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                >
                  Full Calendar View
                </a>
              </div>
            </div>
          </div>
          <div className="   text-gray-500 text-sm max-w-xl mt-2">
            Stay ahead with Gyapak’s Government Exam Calendar 2025. Explore
            upcoming state and central government exam dates, notification
            alerts, and key deadlines for UPSC, SSC, Banking, Railway, Defence,
            and State-level government exams — all curated and updated daily for
            serious aspirants.
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search exams, events..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on new search
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Only show grid/list toggle on tablet and larger screens */}
          {windowWidth >= 640 && (
            <div className="flex items-center space-x-4">
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-purple-100 text-purple-600"
                      : "text-gray-500"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-purple-100 text-purple-600"
                      : "text-gray-500"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main content area */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-purple-200 calendar-results">
          <div className="bg-purple-600 px-4 py-3 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">
              Active government postings {today}
            </h3>
            <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
              {filteredEvents.length}{" "}
              {filteredEvents.length === 1 ? "Event" : "Events"}
            </span>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
              <p className="mt-2 text-purple-600">Loading events...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              <p>Failed to load events. Please try again later.</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <>
              {windowWidth >= 640 && viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                  {currentEvents.map((event) => (
                    <a
                      key={event._id}
                      href={`/top-exams-for-government-jobs-in-india/${slugGenerator(
                        event.name
                      )}?id=${event._id}`}
                      className="block p-4 bg-white border border-purple-100 rounded-lg hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <h4 className="font-medium text-purple-800 mb-2">
                        {event.name}
                      </h4>
                      {event.date && (
                        <p className="text-sm text-gray-600 mb-2">
                          {event.date}
                        </p>
                      )}
                      {event.status && (
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                          {event.status}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-purple-100">
                  {currentEvents.map((event) => (
                    <a
                      key={event._id}
                      href={`/top-exams-for-government-jobs-in-india/${slugGenerator(
                        event.name
                      )}?id=${event._id}`}
                      className="px-4 py-3 flex justify-between items-center hover:bg-purple-50 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium text-purple-800">
                          {event.name}
                        </h4>
                        {event.date && (
                          <p className="text-sm text-gray-600">{event.date}</p>
                        )}
                      </div>
                      {event.status && (
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 whitespace-nowrap">
                          {event.status}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <label
                        htmlFor="itemsPerPage"
                        className="mr-2 text-sm text-gray-700"
                      >
                        Show:
                      </label>
                      <select
                        id="itemsPerPage"
                        className="border border-gray-300 rounded-md text-sm"
                        value={itemsPerPage}
                        onChange={(e) =>
                          handleItemsPerPageChange(parseInt(e.target.value))
                        }
                      >
                        <option value="6">6</option>
                        <option value="12">12</option>
                        <option value="24">24</option>
                        <option value="48">48</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing{" "}
                          <span className="font-medium">
                            {indexOfFirstEvent + 1}
                          </span>{" "}
                          to{" "}
                          <span className="font-medium">
                            {indexOfLastEvent > filteredEvents.length
                              ? filteredEvents.length
                              : indexOfLastEvent}
                          </span>{" "}
                          of{" "}
                          <span className="font-medium">
                            {filteredEvents.length}
                          </span>{" "}
                          results
                        </p>
                      </div>
                      <div>
                        <nav
                          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                          aria-label="Pagination"
                        >
                          <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium ${
                              currentPage === 1
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            <span className="sr-only">Previous</span>
                            <svg
                              className="h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>

                          {/* Page Numbers - Desktop */}
                          <div className="hidden md:flex">
                            {[...Array(totalPages)].map((_, i) => (
                              <button
                                key={i}
                                onClick={() => goToPage(i + 1)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  currentPage === i + 1
                                    ? "z-10 bg-purple-50 border-purple-500 text-purple-600"
                                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                }`}
                              >
                                {i + 1}
                              </button>
                            ))}
                          </div>

                          {/* Simplified Page Indicator - Mobile */}
                          <span className="relative md:hidden inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            Page {currentPage} of {totalPages}
                          </span>

                          <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium ${
                              currentPage === totalPages
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            <span className="sr-only">Next</span>
                            <svg
                              className="h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </nav>
                      </div>
                    </div>

                    {/* Mobile Pagination Controls */}
                    <div className="flex justify-between items-center w-full sm:hidden">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                          currentPage === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-purple-700 hover:bg-purple-50"
                        }`}
                      >
                        Previous
                      </button>

                      <span className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                          currentPage === totalPages
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-purple-700 hover:bg-purple-50"
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
            <div className="p-8 text-center text-gray-500">
              <svg
                className="w-12 h-12 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M19 21a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="mt-2">No events found</p>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="mt-2 text-purple-600 hover:text-purple-800"
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {filteredEvents.length > 0 && (
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-center">
              <a
                href="/government-calendar"
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                View all upcoming exams and events →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GovCalendar;
