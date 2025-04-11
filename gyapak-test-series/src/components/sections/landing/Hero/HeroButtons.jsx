import React from 'react'

const HeroButtons = () => {
    return (
        <div className='mt-36 grid sm:grid-cols-2 w-full lg:w-2/3 gap-5'>
            <button className='rounded-md border-purple-700 border-2 py-3 px-10 text-lg font-bold text-purple-700 w-full'>Get Started</button>
            <button className='rounded-md py-3 px-10 text-lg font-bold bg-purple-700 text-white w-full'>View Test Series</button>
        </div>
    )
}

export default HeroButtons