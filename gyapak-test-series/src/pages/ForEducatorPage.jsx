import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ForEducatorLayout from '../components/layout/ForEducatorLayout';
import InstituteRegistrationPage from '../components/common/InstituteAuth/registrationForm';
import BrandingHeader from '../components/sections/ForEducatorsLanding/InstitutesBranding/InstituteBranding';

const InstitutePage = () => {
  return (
    <ForEducatorLayout>
      <Routes>
        <Route index element={<BrandingHeader />} />
        <Route path="/registration" element={<InstituteRegistrationPage />} />
      </Routes>
    </ForEducatorLayout>
  );
};

export default InstitutePage;
