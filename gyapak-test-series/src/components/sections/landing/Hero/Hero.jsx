import React from 'react'
import HeroContent from './HeroContent'
// import HeroImage from './HeroImage'
import TestSeriesCountdownCard from './TestSeriesCountDown'

const Hero = () => {
  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="grid lg:grid-cols-2 gap-x-16 px-4 md:px-16 lg:px-32 pt-20 md:pt-28 pb-20 md:pb-30 space-y-20 lg:space-y-0 relative z-10 max-w-screen-2xl mx-auto">
          <div className="flex items-center">
            <HeroContent />
          </div>

          <div className="flex items-center justify-center lg:justify-end relative">
            <div className="w-full max-w-xl transform transition-all duration-700 hover:scale-102 hover:-rotate-1">
              <TestSeriesCountdownCard />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Hero