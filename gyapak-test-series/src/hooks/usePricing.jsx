import { useEffect, useState } from 'react';
// import { testSeriesOptions , pricingByTestSeries } from '../constants/data';
import { getAllexam } from '../service/exam.service';

export const usePricing = () => {
  // const [selectedSeries, setSelectedSeries] = useState('upsc'); // Default test series selection
  const [exams, setExam ] = useState([]);
  const [selectedSeriesId , setSelectedSeriesId] = useState(null);
  const [selectedExam , setSelectedExam] = useState(null)
  const [loading , setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const res = await getAllexam();
        const examList = res?.data || [];

        setExam(examList);
        console.log("📦 Exams fetched from API:", examList);

        if(examList.length > 0) {
          setSelectedSeriesId(examList[0].id);
        }

        setError(null);

      } catch (e) {
        console.error('failed to fetch exams', e);
        setError('enable to fetch exams');
      } finally {
        setLoading(false);
      }
    }

    fetchExams();
  }, [])

  useEffect(() => {
    if (!selectedSeriesId || exams.length === 0) return;
    const selected = exams.find((e) => e.id === selectedSeriesId);
    setSelectedExam(selected || null);
  }, [selectedSeriesId, exams]);
  
  return {
    exams,                 // list of all exams for dropdown
    selectedSeriesId,      // selected exam ID
    setSelectedSeriesId,   // setter for dropdown
    selectedExam,          // full exam object incl. pricing
    loading,
    error
  };
};