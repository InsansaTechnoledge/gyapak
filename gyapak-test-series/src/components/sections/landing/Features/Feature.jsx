import React from 'react'
import FeatureContent from './FeatureContent'
import FeatureImage from './FeatureImage'

const Feature = ({textOrientation}) => {
  return (
    <>
        <div className='grid md:grid-cols-2 gap-20 lg:gap-10 mt-20 mb-30'>
            {
                textOrientation=='left'
                ?
                <>
                    <FeatureContent />
                    <FeatureImage />
                </>
                :
                <>
                    <FeatureImage />
                    <FeatureContent />
                </>

            }
        </div>
    </>
  )
}

export default Feature