import React from 'react';
import { AlertCircle } from 'lucide-react';

const PricingHeader = ({ selectedSeries, setSelectedSeries, testSeriesOptions }) => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Choose Your Test Series Plan</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">Select the perfect plan to match your preparation needs and achieve your goals.</p>
      
      <div className="mt-8">
        <div className="flex flex-wrap justify-center gap-2">
          {testSeriesOptions.map((series) => (
            <button
              key={series.id}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedSeries === series.id 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedSeries(series.id)}
            >
              {series.name}
            </button>
          ))}
        </div>
        
        <div className="mt-3 flex items-center justify-center text-xs text-gray-500">
          <AlertCircle size={14} className="mr-1" />
          <span>Prices shown are specific to {testSeriesOptions.find(s => s.id === selectedSeries).name} test series</span>
        </div>
      </div>
    </div>
  );
};

export default PricingHeader;