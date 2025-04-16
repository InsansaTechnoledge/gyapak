import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const AnnouncementBanner = () => {
  
  const [isVisible, setIsVisible] = useState(true)
  
  useEffect(() => {
   
    const isDismissed = localStorage.getItem('announcementBannerDismissed') === 'true'
    if (isDismissed) {
      setIsVisible(false)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('announcementBannerDismissed', 'true')
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-2 px-4">
      <div className="container mx-auto relative">
        <div className="flex items-center justify-center">
          <p className="text-white text-center text-sm font-medium pr-6">
            🎉 New feature release: AI-powered result analysis now available! <span className="underline cursor-pointer">Learn more</span>
          </p>
          <button 
            onClick={handleDismiss} 
            className="absolute right-2 text-white hover:text-gray-200 transition-colors"
            aria-label="Close announcement"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnnouncementBanner