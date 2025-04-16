import React from 'react';
import AnnouncementBanner from '../../../common/AnnouncementBanner/AnnouncementBanner';

const BrandingHeader = () => {
  return (
    <div className="bg-white border-purple-100">
  
      <div className="container mx-auto py-16 md:py-24 px-4 md:px-0">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-purple-100 text-purple-700 font-medium text-sm px-4 py-1 rounded-full mb-6">
              Designed for educational institutions
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Transform how you <span className="text-purple-600">assess</span> and <span className="text-purple-600">engage</span> students
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Our comprehensive assessment platform helps educational institutions create, administer, and analyze assessments with powerful tools and actionable insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-3 font-medium text-lg transition-colors">
                Register now
              </button>
              <button className="border border-purple-200 text-purple-700 hover:bg-purple-50 rounded-lg px-6 py-3 font-medium text-lg transition-colors">
                Schedule Demo
              </button>
            </div>
            
            {/* <div className="mt-10">
              <p className="text-sm text-gray-500 mb-4">Trusted by leading institutions</p>
              <div className="flex flex-wrap gap-8 items-center opacity-70">
                <UniversityLogo name="Stanford" />
                <UniversityLogo name="Harvard" />
                <UniversityLogo name="MIT" />
                <UniversityLogo name="Oxford" />
              </div>
            </div> */}
          </div>
          
          <div className="relative">
            <div className="bg-purple-100 rounded-2xl p-6 md:p-8 relative z-10">
              <img 
                src="/api/placeholder/600/400" 
                alt="EduAssess Platform Dashboard" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-yellow-100 rounded-2xl p-4 w-40 shadow-lg z-20 border border-yellow-200">
              <div className="text-4xl font-bold text-yellow-600 mb-1">95%</div>
              <div className="text-sm text-yellow-800">Improvement in assessment efficiency</div>
            </div>
            <div className="absolute -top-6 -left-6 bg-indigo-600 rounded-full h-24 w-24 z-0 opacity-20"></div>
            <div className="absolute -bottom-10 right-20 bg-purple-600 rounded-full h-16 w-16 z-0 opacity-10"></div>
          </div>
        </div>
      </div>
      
    </div>
  );
};


const UniversityLogo = ({ name }) => (
  <div className="font-bold text-gray-400 text-lg">{name}</div>
);


export default BrandingHeader;