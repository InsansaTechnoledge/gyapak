import React from 'react'
import HeroContent from './HeroContent'
import HeroImage from './HeroImage'

const Hero = () => {
  return (
    <>
      <div className='grid lg:grid-cols-2 gap-x-16 px-32 pt-28 pb-30 space-y-20 lg:space-y-0'>
        <HeroContent />
        <HeroImage />  
      </div>
    </>
  )
}

export default Hero