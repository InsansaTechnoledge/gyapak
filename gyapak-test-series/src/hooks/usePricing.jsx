import { useState } from 'react';
import { testSeriesOptions , pricingByTestSeries } from '../constants/data';

export const usePricing = () => {
  const [selectedSeries, setSelectedSeries] = useState('upsc'); // Default test series selection
  
  // Get pricing data for selected test series
  const pricing = pricingByTestSeries[selectedSeries];
  
  return {
    selectedSeries,
    setSelectedSeries,
    testSeriesOptions,
    pricing
  };
};