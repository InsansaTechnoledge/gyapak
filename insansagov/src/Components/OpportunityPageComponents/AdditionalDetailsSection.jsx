import React, { useState } from "react";
import { PlusCircleIcon } from "lucide-react";

const AdditionalDetailsSection = ({ data, existingSections }) => {

  // Function to check if data contains at least one key not in existingSections
  const hasNonExistingSection = (data) => {
    if (typeof data === "object" && data !== null) {
      return Object.keys(data).some((key) => !existingSections.includes(key));
    }
    return false;
  };

  // Recursive function to render nested JSON objects
  const renderContent = (data) => {
    if (typeof data === "string" || typeof data === "number") {
      return (
        <div className="p-2 md:p-4 bg-purple-50 border border-purple-200 rounded-lg shadow-sm flex flex-grow flex-wrap">
          <p className="text-gray-700">{data}</p>
        </div>
      );
    }

    if (typeof data === 'boolean') {
      return (<div className="p-2 md:p-4 bg-purple-50 border border-purple-200 rounded-lg shadow-sm flex flex-grow flex-wrap">
        {data
          ?
          <p className="text-gray-700">Yes</p>
          :
        < p className="text-gray-700">No</p>
        }
          </div >)
        
    }

if (Array.isArray(data)) {
  return (
    <ul className="list-inside space-y-2 flex flex-col flex-grow flex-wrap">
      {data.map((item, index) => (
        <li key={index} className="">
          {renderContent(item)}
        </li>
      ))}
    </ul>
  );
}

if (typeof data === "object" && data !== null) {

  return (
    <div className="gap-4 flex flex-wrap flex-grow">
      {Object.entries(data).map(([key, value]) => {
        if (!existingSections.includes(key)) {
          return (
            <div
              key={key}
              className="p-3 bg-white border border-purple-300 rounded-lg shadow-md flex flex-col flex-wrap flex-grow"
            >
              <h3 className="font-medium text-purple-600 mb-2 capitalize">
                {key.replace(/_/g, " ")}
              </h3>
              {/* Recursively render nested data */}
              {
                value
                  ?
                  <div className="space-y-2 flex flex-grow flex-wrap">
                    {renderContent(value)}
                  </div>
                  :
                  null
              }
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

// Fallback for unexpected data types
return (
  <div className="p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
    <p className="text-red-700">Unsupported Data Type</p>
  </div>
);
  };


// Check if the section should be displayed
if (!hasNonExistingSection(data)) {
  return null; // Do not render the section
}

return (
  <div className="flex flex-col w-full lg:col-span-2 bg-white shadow-lg p-4 md:p-8 rounded-2xl mb-5">
    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
      <PlusCircleIcon className="w-6 h-6 text-purple-500" />
      Additional Details
    </h2>
    <div className="space-y-6 flex">{renderContent(data)}</div>
  </div>
);
};

export default AdditionalDetailsSection;
