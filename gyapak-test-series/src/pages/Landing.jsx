import React from 'react'
import MainLayout from '../components/layout/MainLayout'
import Hero from '../components/sections/landing/Hero/Hero'
import ExamMarquee from '../components/sections/landing/Marquee/ExamMarquee'
import FeatureMain from '../components/sections/landing/Features/FeatureMain'
import WorkProcess from '../components/sections/landing/WorkProcess/WorkProcess'

const Landing = () => {
    return (
        <>
            <MainLayout>
                <>
                    <div className='bg-gradient-to-br from-purple-50 to-purple-300'>
                        <Hero />
                        <ExamMarquee />
                    </div>
                    <div className='px-12 md:px-32 lg:px-64'>
                        <FeatureMain />
                        <WorkProcess />
                    </div>
                </>
            </MainLayout>
        </>
    )
}

export default Landing