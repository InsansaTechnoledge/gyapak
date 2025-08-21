import React from 'react'
import { Calendar } from 'lucide-react'
const ImportantDatesSection = ({ data, existingSections }) => {
  if (!data.details.important_dates) return null;
  existingSections.push("important_dates");

  const importantDates = data.details.important_dates;

  const isSingleDate = typeof importantDates === "string" || importantDates instanceof Date;

  return (
    <div className="flex-grow bg-white shadow-lg p-8 rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <Calendar className="w-6 h-6 text-purple-500" />
        Important Dates
      </h2>
      <div className="space-y-4">
        {isSingleDate ? (
          <div className="p-4 bg-purple-50 rounded-lg">
            <p>
              {importantDates instanceof Date
                ? importantDates.toLocaleDateString()
                : importantDates}
            </p>
          </div>
        ) : (
          Object.entries(importantDates || {}).map(([key, value]) => (
            <div key={key} className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-sm text-purple-500 mb-1">{key.replace(/_/g, " ")}</h3>
              <p className="font-medium">{value}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ImportantDatesSection;
