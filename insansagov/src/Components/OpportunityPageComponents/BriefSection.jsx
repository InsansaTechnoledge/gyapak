import React from 'react';

const BriefSection = ({ data }) => {
  if (!data || !data.briefDetails) return null;

  return (
    <div className="flex justify-center w-full px-4 py-8">
      <div className="py-10 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 rounded-2xl  max-w-4xl w-full">
        <p className="text-lg sm:text-xl md:text-2xl text-purple-900 font-semibold leading-relaxed text-center">
          {data.briefDetails}
        </p>
      </div>
    </div>
  );
};

export default BriefSection;
