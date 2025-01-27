import React from 'react'
import { BookOpen } from 'lucide-react'

const EducationSection = ({data,existingSections}) => {
    if(!data.details.eligibility || !data.details.eligibility.education){
      return null
    }
    else{
      existingSections.push("eligibility");
    }

    return (
        <div className="flex-grow lg:col-span-2 bg-white shadow-lg p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-purple-500" />
            Educational Qualifications
          </h2>
          {
            typeof(data.details.eligibility.education) == 'string'
            ?
            <div className='space-y-4'>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p>{data.details.eligibility.education}</p>
              </div>
              </div>
            :
          <div className="space-y-4">
            {Object.entries(data.details.eligibility.education).map(([key, value]) => (
              <div key={key} className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-medium text-purple-500 mb-1">{key.replace(/_/g, " ")}</h3>
                <p>{value}</p>
              </div>
            ))}
          </div>
          }
        </div>
      )
}

export default EducationSection