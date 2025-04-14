import React from 'react';
import { ChevronRight } from 'lucide-react';
import { usePricing } from '../../../../hooks/usePricing';
import PlanCard from './PlanCard';
import PricingHeader from './PricingHeader';

const PricingModel = () => {
  const { 
    selectedSeries, 
    setSelectedSeries, 
    testSeriesOptions, 
    pricing 
  } = usePricing();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      <PricingHeader 
        selectedSeries={selectedSeries}
        setSelectedSeries={setSelectedSeries}
        testSeriesOptions={testSeriesOptions}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <PlanCard 
          type="explorer" 
          pricing={pricing.explorer}
          popular={false}
        />
        
        <PlanCard 
          type="learner" 
          pricing={pricing.learner}
          popular={true}
        />
        
        <PlanCard 
          type="achiever" 
          pricing={pricing.achiever}
          popular={false}
        />
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-gray-600 text-sm">Gyapak is there to help you ❤️</p>
        <a href="https://gyapak.in" className="text-purple-600 font-medium inline-flex items-center hover:text-purple-700 mt-2">
          gyapak.in<ChevronRight size={16} className="ml-1" />
        </a>
      </div>
    </div>
  );
};

export default PricingModel;
