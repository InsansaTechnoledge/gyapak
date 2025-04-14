import React from 'react';
import { ChevronRight } from 'lucide-react';
import { usePricing } from '../../../../hooks/usePricing';
import PlanCard from './PlanCard';
import PricingHeader from './PricingHeader';

const PricingModel = () => {
  const { 
    exams,
    selectedSeriesId,
    setSelectedSeriesId,
    selectedExam,
    loading,
    error
  } = usePricing();

  if (loading) return <p className="text-center py-10">Loading pricing...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      <PricingHeader 
        selectedSeries={selectedSeriesId}
        setSelectedSeries={setSelectedSeriesId}
        testSeriesOptions={exams.map(e => ({ id: e.id, name: e.title }))}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* <PlanCard type="explorer" pricing={{ amount: 0 }} popular={false} /> */}

        <PlanCard 
          type="explorer" 
          pricing={{ 
            amount: 0 ,
            description: selectedExam?.description,
            title: selectedExam?.title,
            validity: selectedExam?.validity,
            testsCount: 0,
            examId: selectedExam?.selectedSeriesId
          }} 
          popular={false} 
        />

        <PlanCard 
          type="learner" 
          pricing={{
            amount: selectedExam?.price_learner ?? 0,
            description: selectedExam?.description,
            title: selectedExam?.title,
            validity: selectedExam?.validity,
            testsCount: 0,
            examId: selectedExam?.selectedSeriesId
          }}
          popular={true}
        />

        <PlanCard 
          type="achiever" 
          pricing={{
            amount: selectedExam?.price_achiever ?? 0,
            description: selectedExam?.description,
            title: selectedExam?.title,
            validity: selectedExam?.validity,
            testsCount: 0,
            examId: selectedExam?.selectedSeriesId
          }}
          popular={false}
        />
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-gray-600 text-sm">Gyapak is there to help you ❤️</p>
        <a href="https://gyapak.in" className="text-purple-600 font-medium inline-flex items-center hover:text-purple-700 mt-2">
          gyapak.in <ChevronRight size={16} className="ml-1" />
        </a>
      </div>
    </div>
  );
};

export default PricingModel;
