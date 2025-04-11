import React from 'react'
import Feature from './Feature'
import WorkProcess from '../WorkProcess/WorkProcess'

const FeatureMain = () => {
    return (
        <>
            <h1 className='text-5xl font-bold text-purple-700 mt-10 text-center'>Our Features</h1>
            <Feature textOrientation={'left'} />
            <Feature textOrientation={'right'} />
        </>
    )
}

export default FeatureMain