import React, { useState } from 'react'
import { BookOpen, Award, BarChart, Users, ChevronDown } from 'lucide-react';

// Custom link component using direct paths
const CustomLink = ({ icon, label, href = "#" }) => {
  return (
    <a 
      href={href} 
      className="flex items-center text-gray-700 hover:text-purple-700 transition-colors"
    >
      {icon && <span className="mr-1">{icon}</span>}
      <span>{label}</span>
    </a>
  )
}

const EducatorNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between py-4 px-4 md:px-0">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <div className="bg-purple-600 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-3">
            <BookOpen size={20} />
          </div>
          <div>
            <h1 className="font-bold text-xl text-purple-900">Gyapak</h1>
            <p className="text-xs text-purple-600">Advanced Assessment Platform for Institutes</p>
          </div>
        </a>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <CustomLink icon={<Award size={16} />} label="Features" href="/features" />
          <CustomLink icon={<BarChart size={16} />} label="Solutions" href="/solutions" />
          <CustomLink icon={<Users size={16} />} label="For Students" href="/" />
          <CustomLink label="Pricing" href="/pricing" />
          <CustomLink label="Resources" href="/resources" />
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center text-gray-700"
          >
            Menu <ChevronDown size={16} className={`ml-1 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <a href="/login" className="hidden md:block text-purple-700 hover:text-purple-900 font-medium">
            Log In
          </a>
          <a href="/institute/registration" className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
            Register
          </a>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-2 pb-4 bg-white border-t border-gray-200">
          <div className="flex flex-col space-y-3">
            <CustomLink icon={<Award size={16} />} label="Features" href="/features" />
            <CustomLink icon={<BarChart size={16} />} label="Solutions" href="/solutions" />
            <CustomLink icon={<Users size={16} />} label="For Students" href="/" />
            <CustomLink label="Pricing" href="/pricing" />
            <CustomLink label="Resources" href="/resources" />
            <a href="/login" className="text-purple-700 hover:text-purple-900">Log In</a>
          </div>
        </div>
      )}
    </div>
  )
}
 
export default EducatorNavbar