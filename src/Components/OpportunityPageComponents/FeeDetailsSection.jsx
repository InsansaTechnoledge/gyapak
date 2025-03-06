import React from 'react'
import { Coins } from 'lucide-react'

const FeeDetailsSection = ({data,existingSections}) => {
    if(!data.details.fee_details){
      return null;
    }
    else{
      existingSections.push("fee_details");
    }

    return (
        <div className="flex-grow bg-gradient-to-br from-purple-100 to-blue-100 p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Coins className="w-6 h-6 text-purple-500" />
            Fee Details
          </h2>
          {
            data.details.fee_details.amount
            ?
            <div className="text-center mb-6">
            <p className="text-5xl font-bold text-purple-500 mb-4">{data.details.fee_details.amount}</p>
            <p className="text-lg">Examination Fee</p>
          </div>
          :
          null}
          {
            data.details.fee_details.exempted_categories
            ?
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-sm mb-2">Exempted Categories:</p>
              <p className="font-medium">{data.details.fee_details.exempted_categories.join(", ")}</p>
            </div>
            :
            null
          }
        </div>
      )
}

export default FeeDetailsSection