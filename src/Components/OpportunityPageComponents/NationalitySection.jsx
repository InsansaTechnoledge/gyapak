import React from 'react'
import { Users } from 'lucide-react'

const NationalitySection = ({ data, existingSections }) => {
  if (!data.details.eligibility || !data.details.eligibility.nationality) {
    return null
  }
  else {
    existingSections.push("eligibility")
  }

  return (
    <div className="flex-grow bg-white shadow-lg p-8 rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <Users className="w-6 h-6 text-purple-500" />
        Nationality
      </h2>
      <ul className="space-y-4">
        {
          typeof(data.details.eligibility.nationality) == 'string'
            ?
            <>
              <li className="flex items-center gap-3 bg-purple-50 p-3 rounded-lg">
                <span>{data.details.eligibility.nationality}</span>
              </li>
            </>
            :
            data.details.eligibility.nationality.map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span>{item}</span>
              </li>
            ))
        }
      </ul>
    </div>
  )
}

export default NationalitySection