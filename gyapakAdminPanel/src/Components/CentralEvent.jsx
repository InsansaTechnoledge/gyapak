import React, { useEffect, useState, useRef } from "react";
import { FileText } from "lucide-react";
import QuickApplyButton from "./OpportunityComponents/QuickApplyButton";
import DetailsSection from "./OpportunityComponents/DetailsSection";
import DocumentLinksSection from "./OpportunityComponents/DocumentLinksSection";
import HeroSectionCentral from "./OpportunityComponents/HeroSectionCentral";
import AdditionalDetailsSection from "./OpportunityComponents/AdditionalDetailsSection";
import { API_BASE_URL } from "../config";
import BriefEditableSection from "./OpportunityPageComponents/BriefDetailsSection";
import SearchableDropdown from "./SearchableDropdown";
import axiosInstance from "../api/axiosConfig";
const CentralEvent = () => {
  const [eventData, setEventData] = useState({});
  const startTime = useRef(null);

  useEffect(() => {
    startTime.current = Date.now();
  }, []);

  const handleEventDataChange = (e) => {
    const { name, value } = e.target;

    // console.log(name,value);
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const SUBMIT_SECRET = "Gyapak_Insansa@123";

  const onHandleSubmitCentral = async () => {
    const prompt1 = prompt("Enter secret key");
    if (prompt1 !== SUBMIT_SECRET) {
      alert("Unauthorized access");
      return;
    }
    try {
      // Required fields validation
      const requiredFields = [
        "organization_id",
        "name",
        "date_of_notification",
        "date_of_commencement",
        "end_date",
        "apply_link",
        "event_type",
      ];

      for (const field of requiredFields) {
        if (!eventData[field]) {
          alert(`${field} is required.`);
          return;
        }
      }

      // Validate date range
      const commencementDate = new Date(eventData.date_of_commencement);
      const endDate = new Date(eventData.end_date);

      if (endDate < commencementDate) {
        alert("End date cannot be earlier than the commencement date.");
        return;
      }

      console.log("🔍 Submitting Event Data:", eventData);

      const totalTime = Math.floor((Date.now() - startTime.current) / 1000);
      const response = await axiosInstance.post(
        `/api/v1/upload?time=${totalTime}`,
        eventData
      );

      if (response.status === 200) {
        alert(response.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred.");
    }
  };

  // useEffect(() => {
  //     console.log(eventData);
  // }, [eventData])

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-8 border border-purple-200">
        <h1 className="text-3xl font-bold text-purple-800 text-center mb-2">
          Central Organization Event
        </h1>
        <p className="text-purple-600 text-center">
          Add central government organization events and opportunities
        </p>
      </div>

      {/* Main Form Container */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Event Type Selection */}
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <label className="block text-lg font-semibold text-purple-800 mb-3">
              Select Event Type
            </label>
            <SearchableDropdown
              options={["Exam", "AdmitCard", "Result"].map((type) => ({
                type,
                name: type,
              }))}
              placeholder="Select Event Type"
              onSelect={handleEventDataChange}
              value={eventData?.event_type || ""}
              name="event_type"
              displayKey="name"
              valueKey="type"
              searchKeys={["name"]}
              className="w-full"
            />
          </div>

          {/* Organization and Event Details */}
          <HeroSectionCentral
            handleEventDataChange={handleEventDataChange}
            eventData={eventData}
          />

          {/* Quick Apply Section */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414-1.414L9 5.586 7.707 4.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L9 5.586z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Quick Apply Details
            </h2>
            <QuickApplyButton
              handleEventDataChange={handleEventDataChange}
              eventData={eventData}
            />
          </div>

          {/* Document Links Section */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Document Links
            </h2>
            <DocumentLinksSection setEventData={setEventData} />
          </div>

          {/* Additional Details Section */}
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Additional Details
            </h2>
            <DetailsSection setEventData={setEventData} />
            <AdditionalDetailsSection data={eventData.details} />
          </div>

          {/* Brief Details Section */}
          <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
            <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-yellow-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Brief Details
            </h2>
            <BriefEditableSection
              value={eventData.briefDetails}
              onChange={(value) =>
                setEventData((prev) => ({ ...prev, briefDetails: value }))
              }
            />
          </div>
        </div>
        {/* Submit Button */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <div className="flex justify-center">
            <button
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              onClick={onHandleSubmitCentral}
            >
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414-1.414L9 5.586 7.707 4.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L9 5.586z"
                    clipRule="evenodd"
                  />
                </svg>
                Upload Data
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CentralEvent;
