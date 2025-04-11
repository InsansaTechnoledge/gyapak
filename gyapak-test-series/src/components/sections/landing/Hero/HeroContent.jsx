import React from 'react'
import HeroHeading from './HeroHeading'
import HeroButtons from './HeroButtons'

const HeroContent = () => {
  return (
    <>
        <div className='flex flex-col'>
          <HeroHeading />
          <HeroButtons />
        </div>
    </>
  )
}

export default HeroContent