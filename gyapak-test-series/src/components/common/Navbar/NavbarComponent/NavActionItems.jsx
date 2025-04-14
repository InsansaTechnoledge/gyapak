// components/layout/Navbar/components/NavActionItems.js
import React, { useState } from 'react';
import { Search, Bell, User } from 'lucide-react';

import ProfileDropdown from './ProfileDrobdown';
import ThemeToggle from './ ThemeToggle';
import AuthForm from '../../Login/AuthForm';
import { useUser } from '../../../../context/UserContext';

const NavActionItems = ({ darkMode, toggleDarkMode, activeDropdown, toggleDropdown }) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { user } = useUser();

  return (
    <>
    {
      isModalOpen
      ?
      <AuthForm activeTab={activeTab} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      :
      null
    }
    
    <div className="hidden md:flex items-center space-x-4">
      {/* Search */}
      <button className="p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors duration-200">
        <Search size={20} />
      </button>
      
      {/* Dark Mode Toggle */}
      <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Notifications */}
      <button className="p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors duration-200 relative">
        <Bell size={20} />
        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
      </button>
      
      {/* User Profile */}
      <ProfileDropdown 
        activeDropdown={activeDropdown} 
        toggleDropdown={toggleDropdown} 
      />
      
      {/* Sign In Button */}
      {
        !user
        ?
        <button 
        onClick={()=>{setIsModalOpen(true)}}
          className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
        >
          Sign In
        </button>
        :
        null  
    }
    </div>
    </>

  );
};

export default NavActionItems;