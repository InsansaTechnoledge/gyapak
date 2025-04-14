import React from 'react'
import { ArrowRight } from 'lucide-react'

export const ActionButton = ({ isExpired }) => {
  return (
    <button 
      className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium text-sm ${
        isExpired 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : 'bg-indigo-600 text-white hover:bg-indigo-700'
      }`}
      disabled={isExpired}
    >
      <span>{isExpired ? 'Expired' : 'Enroll Now'}</span>
      {!isExpired && <ArrowRight className="w-4 h-4" />}
    </button>
  )
}