import React from 'react';
import HeroSection from './components/HeroSection';
import BenefitsSection from './components/BenefitsSection';
import RegistrationForm from './components/RegistrationSection';
import RegistrationHeader from './components/HeadingSection';

const InstituteRegistrationPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <BenefitsSection />
      <RegistrationHeader/>
      <RegistrationForm />
    </div>
  );
};

export default InstituteRegistrationPage;