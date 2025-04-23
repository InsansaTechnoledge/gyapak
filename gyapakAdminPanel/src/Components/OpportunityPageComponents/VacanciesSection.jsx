import React from "react";
import { Users } from "lucide-react";

const VacanciesSection = ({ data, existingSections }) => {
  if (!data?.details?.vacancies) {
    return null; // Return early if there are no vacancies
  }

  // Safely update existingSections without mutating the original array
  if (!existingSections.includes("vacancies")) {
    existingSections = [...existingSections, "vacancies"];  
  }

  const { total, breakdown } = data.details.vacancies;

  return (
    <div className="flex-grow mb-20 bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-3xl shadow-md">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Users className="w-8 h-8 text-purple-500" />
        Vacancies
      </h2>

      {/* Render breakdown if available */}
      {breakdown ? (
        <div className="grid grid-cols-2 xl:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {Object.entries(breakdown).map(([key, value]) => {
            if (typeof value !== "number") return null; // Skip invalid values

            return (
              <div key={key} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-white p-4 rounded-xl shadow-lg">
                  <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    {value}
                  </p>
                  <p className="text-sm opacity-80">{key.replace(/_/g, " ")}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Fallback if no breakdown is available
        <div className="relative bg-white p-4 rounded-xl shadow-lg">
          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            {total || "No vacancies available"}
          </p>
        </div>
      )}

      {/* Render total vacancies if available */}
      {total && (
        <div className="text-center text-2xl font-bold text-purple-500 mt-5">
          Total Vacancies: {total}
        </div>
      )}
    </div>
  );
};

export default VacanciesSection;
