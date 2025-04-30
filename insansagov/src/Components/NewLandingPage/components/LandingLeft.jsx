// components/LandingLeft.js

import ExamHighlightSection from "./HighlightSection";

export default function LandingLeft() {
    return (
      <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
        {/* <div className="pt-10 bg-white sm:pt-16 lg:pt-8 lg:pb-14">
          <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8">
            <div className="text-center lg:text-left">
              <h1 className="tracking-tight font-extrabold text-gray-900">
                <span className="block text-3xl sm:text-4xl md:text-5xl">upcoming government exams 2025</span>
                <span className="block text-indigo-600 text-xl sm:text-2xl mt-3">Learn smarter, not harder</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto lg:mx-0">
                Gyapak helps you organize, discover, and share knowledge in a way that matches your unique learning style. Break complex topics into digestible pieces.
              </p>
            </div>
          </div>
        </div> */}
        <ExamHighlightSection/>
      </div>
    );
  }
  