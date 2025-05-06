import React from 'react';

const BriefSection = ({ data }) => {
  if (!data || !data.briefDetails) return null;

  return (
    <div className="w-full py-4 sm:py-6 md:py-8">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6">
        <div className="bg-purple-50/20 rounded-lg sm:rounded-xl py-5 sm:py-6 md:py-8 px-4 sm:px-5 md:px-10 shadow-sm">
          <p className="text-base sm:text-lg md:text-xl text-purple-900 font-medium leading-relaxed sm:leading-relaxed md:leading-relaxed text-justify hyphens-auto">
            {data.briefDetails}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BriefSection;