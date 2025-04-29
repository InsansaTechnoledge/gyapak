import React, { useState, useEffect } from 'react';
import { BookOpen, Award, BarChart, Users, ChevronDown, LogOut, User, Building, Mail, Phone, Globe } from 'lucide-react';
import InstituteLogin from '../InstituteAuth/Auth/InstituteLogin';
import { useInstituteAuth } from '../../../context/InstitiuteContext';
import { logoutInstituteService } from '../../../service/Institute.service';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Use context
  const { isLoggedIn, instituteInfo, handleLoginSuccess, handleLogOut, loading } = useInstituteAuth();

  // Handle login success
  const onLoginSuccess = (data) => {
    // Close modal immediately after successful login
    setIsModalOpen(false);
    // Pass data to context handler
    handleLoginSuccess(data);
  };

  // Handle dropdown toggle
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.institute-dropdown')) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogoutClick = async () => {
    try {
      await logoutInstituteService();
      handleLogOut();
      setDropdownOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Format address for display
  const formatAddress = () => {
    if (!instituteInfo?.data.address) return "No address provided";
    
    const addr = instituteInfo.data.address;
    return `${addr.line1}, ${addr.city}, ${addr.state}`;
  };

  return (
    <>
      {isModalOpen && (
        <InstituteLogin 
          setIsModalOpen={setIsModalOpen} 
          isModalOpen={isModalOpen}
          onLoginSuccess={onLoginSuccess}
        />
      )}
      
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
            {isLoggedIn && instituteInfo ? (
              <div className="relative institute-dropdown">
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                >
                  {instituteInfo.data.logoUrl ? (
                    <img 
                      src={instituteInfo.data.logoUrl} 
                      alt={instituteInfo.data.name} 
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <Building size={16} className="text-purple-700" />
                  )}
                  <span className="max-w-32 truncate">{instituteInfo.data.name}</span>
                  <ChevronDown 
                    size={16} 
                    className={`text-purple-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {/* Enhanced user dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-20">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-start">
                        {instituteInfo.data.logoUrl ? (
                          <img 
                            src={instituteInfo.data.logoUrl} 
                            alt={instituteInfo.data.name} 
                            className="w-12 h-12 rounded-full object-cover mr-3"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                            <Building size={24} className="text-purple-700" />
                          </div>
                        )}
                        <div>
                          <p className="text-base font-semibold text-gray-900">{instituteInfo.data.name}</p>
                          <div className="mt-1 flex items-center">
                            <span className="inline-block text-xs font-medium bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                              {instituteInfo.subscription?.plan === 'free' ? 'Free Plan' : 'Premium Plan'}
                            </span>
                            <span className="mx-1 text-xs text-gray-400">•</span>
                            <span className="inline-block text-xs font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              {instituteInfo.data.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail size={14} className="mr-2 text-gray-400" />
                          <span>{instituteInfo.data.email}</span>
                        </div>
                        {instituteInfo.data.phone && (
                          <div className="flex items-center">
                            <Phone size={14} className="mr-2 text-gray-400" />
                            <span>{instituteInfo.data.phone}</span>
                          </div>
                        )}
                        {instituteInfo.data.website && (
                          <div className="flex items-center">
                            <Globe size={14} className="mr-2 text-gray-400" />
                            <a href={instituteInfo.data.website} target="_blank" rel="noopener noreferrer" 
                               className="text-blue-600 hover:underline truncate max-w-52">
                              {instituteInfo.data.website}
                            </a>
                          </div>
                        )}
                        <div className="flex items-start">
                          <Building size={14} className="mr-2 mt-1 text-gray-400" />
                          <span className="text-xs">{formatAddress()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <a href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">Dashboard</a>
                      <a href="/institute/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">Institute Settings</a>
                      <a href="/manage-students" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">Manage Students</a>
                      <a href="/exams" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">Exams & Assessments</a>
                      <button 
                        onClick={handleLogoutClick}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <LogOut size={14} className="mr-2" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600">Loading...</span>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="hidden md:block text-purple-700 hover:text-purple-900 font-medium"
                >
                  Log In
                </button>
                <a href="/institute/registration" className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                  Register
                </a>
              </>
            )}
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
              
              {/* Mobile auth options */}
              {isLoggedIn && instituteInfo ? (
                <>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="py-2">
                      <div className="flex items-center">
                        {instituteInfo.data.logoUrl ? (
                          <img 
                            src={instituteInfo.data.logoUrl} 
                            alt={instituteInfo.data.name} 
                            className="w-8 h-8 rounded-full object-cover mr-2"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                            <Building size={16} className="text-purple-700" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{instituteInfo.data.name}</p>
                          <p className="text-xs text-gray-600">{instituteInfo.data.email}</p>
                        </div>
                      </div>
                    </div>
                    <CustomLink icon={<User size={16} />} label="Dashboard" href="/dashboard" />
                    <CustomLink label="Institute Settings" href="/institute/settings" />
                    <CustomLink label="Manage Students" href="/manage-students" />
                    <CustomLink label="Exams & Assessments" href="/exams" />
                    <button 
                      onClick={handleLogoutClick}
                      className="flex items-center text-red-600 hover:text-red-700 mt-2"
                    >
                      <LogOut size={16} className="mr-1" />
                      Log out
                    </button>
                  </div>
                </>
              ) : loading ? (
                <div className="flex items-center space-x-2 py-2">
                  <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600">Loading...</span>
                </div>
              ) : (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-purple-700 hover:text-purple-900"
                >
                  Log In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EducatorNavbar;