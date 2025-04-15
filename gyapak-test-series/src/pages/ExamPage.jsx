import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ExamListPage from '../components/sections/examOverView/ExamListpage';
import ExamOverview from '../components/sections/examOverView/ExamOverview';
import ExamLayout from '../components/layout/ExamLayout';

const ExamPage = () => {
  return (
    <ExamLayout>
      <Routes>
        <Route index element={<ExamListPage />} />
        <Route path=":examId" element={<ExamOverview />} />
      </Routes>
    </ExamLayout>
  );
};

export default ExamPage;
