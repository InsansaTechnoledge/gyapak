import React from 'react';
import { Check, X, Compass, GraduationCap, Award, ChevronRight } from 'lucide-react';
import { features } from '../../../../constants/data';

const PlanCard = ({ type, pricing, popular }) => {
  const isFree = pricing.amount === 0;
  
  // Get icon based on plan type
  const getIcon = () => {
    switch(type) {
      case 'explorer': return <Compass size={20} />;
      case 'learner': return <GraduationCap size={20} />;
      case 'achiever': return <Award size={20} />;
      default: return <Compass size={20} />;
    }
  };

  // Get name based on plan type
  const getName = () => {
    switch(type) {
      case 'explorer': return 'Explorer';
      case 'learner': return 'Learner';
      case 'achiever': return 'Achiever';
      default: return 'Plan';
    }
  };
  
  return (
    <div className={`relative flex flex-col rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl ${popular ? 'border-2 border-purple-500 shadow-lg transform hover:-translate-y-1' : isFree ? 'border-2 border-green-500 transform hover:-translate-y-0.5' : 'border border-gray-200 hover:-translate-y-0.5'}`}>
      {popular && (
        <div className="absolute top-0 right-0 bg-purple-500 text-white py-1 px-3 rounded-bl-lg text-xs font-bold">
          MOST POPULAR
        </div>
      )}
      
      {isFree && (
        <div className="absolute top-0 right-0 bg-green-500 text-white py-1 px-3 rounded-bl-lg text-xs font-bold">
          FREE
        </div>
      )}
      
      <div className={`p-6 ${popular ? 'bg-purple-50' : isFree ? 'bg-green-50' : 'bg-white'}`}>
        <div className="flex items-center mb-4">
          <div className={`p-2 rounded-full ${popular ? 'bg-purple-500 text-white' : isFree ? 'bg-green-500 text-white' : 'bg-purple-100 text-purple-600'}`}>
            {getIcon()}
          </div>
          <h3 className="ml-3 text-xl font-bold text-gray-800">{getName()}</h3>
        </div>
        
        <div className="mb-6">
          <div className="flex items-baseline">
            {isFree ? (
              <span className="text-3xl sm:text-4xl font-bold text-green-600">Free</span>
            ) : (
              <>
                <span className="text-gray-500">₹</span>
                <span className="text-3xl sm:text-4xl font-bold text-gray-800">{pricing.amount}</span>
                <span className="ml-1 text-gray-500 text-sm">one-time</span>
              </>
            )}
          </div>
          <div className="mt-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium inline-block rounded">
            Valid for {pricing.validity}
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <span className="text-gray-700 font-medium">{pricing.testsCount}</span>
            <span className="ml-1 text-gray-500 text-sm">total tests</span>
          </div>
          <p className="text-gray-600 text-sm">{pricing.description}</p>
        </div>

        <button 
          onClick = {() => console.log(pricing.examId)}
          className={`w-full py-3 rounded-lg text-center font-medium transition-all ${
            isFree ? 'bg-green-600 hover:bg-green-700 text-white' : 
            popular ? 'bg-purple-600 hover:bg-purple-700 text-white' : 
            'bg-purple-100 hover:bg-purple-200 text-purple-700'
          }`}>
            {isFree ? 'Start Free' : 'Buy Now'} <ChevronRight className="inline ml-1" size={16} />
        </button>
      </div>
      
      <div className="bg-gray-50 p-6">
        <h4 className="font-medium text-gray-700 mb-3">Plan includes:</h4>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              {feature[type] ? (
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              ) : (
                <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
              )}
              <span className={`text-sm ${feature[type] ? 'text-gray-700' : 'text-gray-400'}`}>
                {feature.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlanCard;
