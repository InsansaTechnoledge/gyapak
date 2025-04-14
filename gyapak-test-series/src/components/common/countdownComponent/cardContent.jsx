// components/CardContent.jsx
import React from 'react'
import { Clock, List, Calendar } from 'lucide-react'

export const CardContent = ({ examDate, examDuration, totalQuestions }) => {
  // Format the date nicely
  const formattedDate = new Date(examDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  
  const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-center space-x-2">
      {icon}
      <span className="text-xs text-gray-500">{label}:</span>
      <span className="font-medium text-sm text-gray-700">{value}</span>
    </div>
  )
  
  return (
    <div className="px-6 py-4">
      <div className="space-y-2">
        <InfoItem 
          icon={<Calendar className="w-4 h-4 text-indigo-500" />}
          label="Date & Time"
          value={formattedDate}
        />
        
        <InfoItem 
          icon={<Clock className="w-4 h-4 text-indigo-500" />}
          label="Duration"
          value={examDuration}
        />
        
        <InfoItem 
          icon={<List className="w-4 h-4 text-indigo-500" />}
          label="Questions"
          value={totalQuestions}
        />
      </div>
    </div>
  )
}