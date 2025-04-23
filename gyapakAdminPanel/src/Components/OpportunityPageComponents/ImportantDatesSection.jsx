import React from 'react'
import { Calendar } from 'lucide-react'
const ImportantDatesSection = ({ data, existingSections }) => {
  if (!data.details.important_dates) {
    return null;
  }
  else {
    existingSections.push("important_dates");
  }
  return (
    <div className="flex-grow bg-white shadow-lg p-8 rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <Calendar className="w-6 h-6 text-purple-500" />
        Important Dates
      </h2>
      <div className="space-y-4">
        {
          typeof (data.details.important_dates) == 'string' || typeof(data.details.important_dates) == 'date'
            ?
            <div className="p-4 bg-purple-50 rounded-lg">
              <p>{data.details.important_dates}</p>
            </div>
            :
            Object.entries(data.details.important_dates).map(([key, value]) => (
              <div key={key} className="p-4 bg-purple-50 rounded-lg">
                <h3 className="text-sm text-purple-500 mb-1">{key.replace(/_/g, " ")}</h3>
                <p className="font-medium">{value}</p>
              </div>
            ))
        }
      </div>
    </div>
  )
}

export default ImportantDatesSection