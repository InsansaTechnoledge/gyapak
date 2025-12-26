import React from "react";
import { FeatureComponentTitle, features } from "../../constants/Constants";

const FeaturePage = () => {
 

  return (
    <div className="">
      <div className=" mx-auto mt-10 mb-10">
        {/* Hero Section */}
        <div className="text-center ">
          <h1 className="text-5xl py-4 font-bold text-gray-900 mb-16 bg-clip-text text-transparent main-site-color">
            {FeatureComponentTitle}
          </h1>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            // const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* <div
                  className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-8 h-8 ${feature?.iconColor}`} />
                </div> */}
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:main-site-color-hover transition-all duration-300 rounded-b-2xl"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeaturePage;
