import { BookOpen } from 'lucide-react'
import React from 'react'

const ErrorComponent = ({heading, info}) => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
          <BookOpen size={48} className="mx-auto text-purple-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">{heading}</h2>
          <p className="text-gray-600">{info}</p>
        </div>
  )
}

export default ErrorComponent
