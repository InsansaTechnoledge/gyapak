// components/CardHeader.jsx
import React from 'react'
import { Tag } from 'lucide-react'

export const CardHeader = ({ examName, examCategory, examLevel }) => {
  return (
    <div className="px-6 pt-6 pb-2">
      <div className="flex justify-between mb-1">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
          {examCategory}
        </span>
        
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {examLevel}
        </span>
      </div>
      
      <h2 className="text-xl font-bold text-gray-800 mt-2">{examName}</h2>
    </div>
  )
}