import React from 'react'
import MainLayout from '../components/layout/MainLayout'
import Hero from '../components/sections/landing/Hero/Hero'
import ExamMarquee from '../components/sections/landing/Marquee/ExamMarquee'
import FeatureMain from '../components/sections/landing/Features/FeatureMain'
import WorkProcess from '../components/sections/landing/WorkProcess/WorkProcess'
import PricingModel from '../components/sections/landing/Pricing/PricingModel'

const Landing = () => {
    return (
        <>
            <MainLayout>
                <>
                    <div>
                        <Hero />
                        <ExamMarquee />
                    </div>
̀
                    <div className='px-12 md:px-32'>
                        <FeatureMain />
                        <PricingModel/>
                        <WorkProcess />
                    </div>
                   
                </>
            </MainLayout>
        </>
    )
}

export default Landing
