import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  Calendar,
  Activity,
} from "lucide-react";

const UserLogsComponent = () => {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [dateFilter, setDateFilter] = useState(""); // "", "today", "yesterday", "last7days", "custom"
  const [customDate, setCustomDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Fetch users list
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/logs/users");
        if (response.data.success) {
          setUsers(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Fetch logs
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page: pagination.page,
          limit: pagination.limit,
        };
        if (selectedUser) {
          params.userId = selectedUser;
        }
        if (dateFilter) {
          params.dateFilter = dateFilter;
          if (dateFilter === "custom" && customDate) {
            params.customDate = customDate;
          }
        }

        const response = await axiosInstance.get("/api/logs/all", { params });

        if (response.data.success) {
          setLogs(response.data.data);
          setPagination((prev) => ({
            ...prev,
            total: response.data.total,
            totalPages: response.data.totalPages,
          }));
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch logs");
        console.error("Error fetching logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [pagination.page, pagination.limit, selectedUser, dateFilter, customDate]);

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleDateFilterChange = (e) => {
    const value = e.target.value;
    setDateFilter(value);
    if (value !== "custom") {
      setCustomDate(""); // Clear custom date if not custom filter
    }
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleCustomDateChange = (e) => {
    setCustomDate(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getActionBadgeColor = (action) => {
    switch (action) {
      case "created":
        return "bg-green-100 text-green-800 border-green-200";
      case "updated":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "deleted":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-8 border border-purple-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-purple-800 mb-2">
              User Activity Logs
            </h1>
            <p className="text-purple-600">
              Track and monitor all user activities across the platform
            </p>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-4 mt-4">
          {/* User Filter Dropdown */}
          <div className="bg-white rounded-lg shadow-md border border-purple-200 p-3 flex-1 min-w-[250px]">
            <label className="block text-sm font-semibold text-purple-800 mb-2">
              Filter by User
            </label>
            <select
              value={selectedUser}
              onChange={handleUserChange}
              className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-700"
            >
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter Dropdown */}
          <div className="bg-white rounded-lg shadow-md border border-purple-200 p-3 flex-1 min-w-[250px]">
            <label className="block text-sm font-semibold text-purple-800 mb-2">
              Filter by Date
            </label>
            <select
              value={dateFilter}
              onChange={handleDateFilterChange}
              className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-700"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 Days</option>
              <option value="custom">Custom Date</option>
            </select>
          </div>

          {/* Custom Date Picker - shown only when custom is selected */}
          {dateFilter === "custom" && (
            <div className="bg-white rounded-lg shadow-md border border-purple-200 p-3 flex-1 min-w-[250px]">
              <label className="block text-sm font-semibold text-purple-800 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={customDate}
                onChange={handleCustomDateChange}
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-700"
              />
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-medium">Error: {error}</p>
        </div>
      )}

      {/* Logs List */}
      {!loading && !error && (
        <>
          {logs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
              <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No activity logs found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log._id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="p-6">
                    {/* Header Row */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {log.userId?.name || "Unknown User"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {log.userId?.email || "No email"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getActionBadgeColor(
                          log.event?.action
                        )}`}
                      >
                        {log.event?.action?.toUpperCase() || "N/A"}
                      </span>
                    </div>

                    {/* Event Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Event Type
                          </p>
                          <p className="text-sm font-semibold text-gray-800">
                            {log.event?.eventType || "N/A"}
                          </p>
                        </div>

                        <div className="relative group max-w-full">
                          <p className="text-xs text-gray-500 mb-1">
                            Event Title
                          </p>

                          <p className="text-sm font-semibold text-gray-800 truncate cursor-pointer">
                            {log.event?.eventStamp?.title ||
                              log.event?.eventId?.name}
                          </p>

                          {/* Tooltip */}
                          <div className="absolute left-0 top-full mt-1 z-50 hidden max-w-xs rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-lg group-hover:block">
                            {log.event?.eventStamp?.title ||
                              log.event?.eventId?.name}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-purple-600" />
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Time Taken
                            </p>
                            <p className="text-sm font-semibold text-gray-800">
                              {formatTime(log.event?.totalTime || 0)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Date & Time
                            </p>
                            <p className="text-sm font-semibold text-gray-800">
                              {formatDate(log.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Event ID */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Event ID:</span>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded border border-gray-200 text-gray-700 font-mono">
                        {log.event?.eventId?._id || log.event?.eventId || "N/A"}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {logs.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mt-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} logs
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1
                    )
                      .filter((page) => {
                        // Show first page, last page, current page, and pages around current
                        return (
                          page === 1 ||
                          page === pagination.totalPages ||
                          Math.abs(page - pagination.page) <= 1
                        );
                      })
                      .map((page, index, array) => {
                        // Add ellipsis if there's a gap
                        const prevPage = array[index - 1];
                        const showEllipsis = prevPage && page - prevPage > 1;

                        return (
                          <React.Fragment key={page}>
                            {showEllipsis && (
                              <span className="px-2 text-gray-500">...</span>
                            )}
                            <button
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${
                                pagination.page === page
                                  ? "bg-purple-600 text-white border-purple-600"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        );
                      })}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserLogsComponent;
