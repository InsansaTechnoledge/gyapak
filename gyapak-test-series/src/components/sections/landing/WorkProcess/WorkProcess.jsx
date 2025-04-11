import React from 'react'
import Step from './Step'
import ProcessLine from './ProcessLine'

const WorkProcess = () => {
    return (
        <>
            <div className='mb-10'>
                <h1 className='text-5xl font-bold text-purple-700 mt-10 text-center mb-20'>Our Work Process</h1>
                <div className='grid lg:grid-cols-15 mx-auto'>
                    <div className='lg:col-span-3'>
                        <Step step={1} />
                    </div>
                    <div className='flex'>
                        <ProcessLine />
                    </div>
                    <div className='lg:col-span-3'>
                        <Step step={2} />
                    </div>
                    <div className='flex'>
                        <ProcessLine />
                    </div>
                    <div className='lg:col-span-3'>
                        <Step step={3} />
                    </div>
                    <div className='flex'>
                        <ProcessLine />
                    </div>
                    <div className='lg:col-span-3'>
                        <Step step={4} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default WorkProcess