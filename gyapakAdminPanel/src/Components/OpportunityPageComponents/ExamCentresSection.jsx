import React from 'react'
import { MapPin } from 'lucide-react'

const ExamCentresSection = ({ data, existingSections }) => {
  if (!data.details.exam_centers) {
    return null
  }
  else {
    existingSections.push("exam_centers")
  }
  return (
    <div className="flex-grow bg-white shadow-lg p-8 rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <MapPin className="w-6 h-6 text-purple-500" />
        Exam Centers
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        {
          typeof (data.details.exam_centers) == 'string'
            ?
            <div className="p-4 bg-purple-50 rounded-lg">
              <p>{data.details.exam_centers}</p>
            </div>
            :
            <>
              {data.details.exam_centers.map((center) => (
                <div key={center} className="p-4 bg-purple-50 rounded-lg text-center">
                  <p>{center}</p>
                </div>
              ))}
            </>

        }

      </div>
    </div>
  )
}

export default ExamCentresSection