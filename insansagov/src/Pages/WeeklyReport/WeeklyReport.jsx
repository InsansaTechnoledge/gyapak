import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileText, Download, Loader2, AlertCircle, Calendar } from "lucide-react";
import { useApi } from "../../Context/ApiContext";

const WeeklyReport = () => {
  const { apiBaseUrl } = useApi();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const fetchWeeklyReport = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${apiBaseUrl}/api/v1i2/reports/fetch`);
        
        if (response.data && response.data.data) {
          setReportData(response.data.data);
        } else {
          setError("No report data available");
        }
      } catch (err) {
        console.error("Error fetching weekly report:", err);
        setError(err.response?.data?.message || "Failed to load weekly report. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyReport();
  }, [apiBaseUrl]);

  const handleDownload = () => {
    if (reportData?.pdfUrl) {
      const link = document.createElement("a");
      link.href = reportData.pdfUrl;
      link.download = "weekly_events_report.pdf";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen md:mt-40 mt-20 w-full bg-gradient-to-b from-purple-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
          <p className="text-lg text-gray-600">Loading weekly report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen md:mt-40 mt-20 w-full bg-gradient-to-b from-purple-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-red-200 p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Error Loading Report</h2>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-40 w-full bg-gradient-to-b from-purple-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="border-b border-purple-100 bg-gradient-to-r from-purple-50 via-white to-indigo-50">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center justify-between">
            {/* Left side */}
            <div className="flex-1 space-y-4">
              <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-purple-500">
                Weekly Events Report
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-purple-900">
Last Date to Apply for Online & Offline Government Jobs Applications
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-xl">
                Stay updated with the latest{" "}
                <span className="text-purple-700 font-medium">
                  weekly events and important dates
                </span>
                . Download the comprehensive PDF report for detailed information.
              </p>

              {/* <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span>
                    Report Type:{" "}
                    <span className="font-semibold text-purple-700">
                      {reportData?.type || "Weekly Expiry Report"}
                    </span>
                  </span>
                </div>
              </div> */}
            </div>

            {/* Download Card */}
            <div className="w-full max-w-xs rounded-2xl border border-purple-200 bg-white px-6 py-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-purple-800">PDF Report</h3>
                  <p className="text-xs text-gray-500">Ready to download</p>
                </div>
              </div>
              
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
              >
                <Download className="w-5 h-5" />
                <span className="font-semibold">Download Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Preview Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-purple-900 mb-2">
            Report Preview
          </h2>
          <p className="text-sm text-gray-600">
            View the report below or download it for offline access
          </p>
        </div>

        {/* PDF Viewer */}
        <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
          {reportData?.pdfUrl ? (
            <iframe
              src={reportData.pdfUrl}
              className="w-full h-[600px] sm:h-[700px] lg:h-[800px]"
              title="Weekly Report PDF"
              style={{ border: "none" }}
            />
          ) : (
            <div className="flex items-center justify-center h-96 bg-gray-50">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No PDF preview available</p>
              </div>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
          <h3 className="text-lg font-semibold text-purple-900 mb-3">
            About This Report
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">•</span>
              <span>This report contains important weekly events and deadlines</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">•</span>
              <span>Updated regularly to ensure you have the latest information</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">•</span>
              <span>Download the PDF for offline access and easy sharing</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;
