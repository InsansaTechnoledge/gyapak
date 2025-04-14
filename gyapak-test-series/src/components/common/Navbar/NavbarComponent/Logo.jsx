import React from 'react';

const Logo = () => {
  return (
    <div className="flex-shrink-0 flex items-center">
      <div className="flex items-center">
        <div className="h-8 w-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">gyapak.in</span>
        </div>
        {/* <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white"></span> */}
      </div>
    </div>
  );
};

export default Logo;