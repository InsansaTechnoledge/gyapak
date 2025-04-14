import React from 'react'
import { BookOpen } from 'lucide-react'

export const ExamBadge = ({ examId }) => {
  return (
    <div className="flex items-center space-x-2">
      <BookOpen className="w-4 h-4 text-indigo-600" />
      <span className="text-xs font-medium text-gray-500">{examId}</span>
    </div>
  )
}