import React from 'react'
import { CoinsIcon } from 'lucide-react'

const SalarySection = ({data,existingSections}) => {
    if(!data.details.salary){
      return null
    }
    else{
        existingSections.push("salary");
    }

    return (
        <div className="flex-grow lg:col-span-2 bg-white shadow-lg p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <CoinsIcon className="w-6 h-6 text-purple-500" />
            Salary
          </h2>
          {
            typeof(data.details.salary) == 'string'
            ?
            <div className='space-y-4'>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p>{data.details.salary}</p>
              </div>
              </div>
            :
          <div className="space-y-4">
            {Object.entries(data.details.salary).map(([key, value]) => (
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

export default SalarySection