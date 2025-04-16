// components/layout/Navbar/Navbar.js
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

import Logo from './NavbarComponent/Logo';
import DesktopNav from './NavbarComponent/DesktopNav';
import MobileNav from './NavbarComponent/MobileNav';
import NavActionItems from './NavbarComponent/NavActionItems';
import ThemeToggle from './NavbarComponent/ ThemeToggle';
import useScrollPosition from '../../../hooks/usescrollPosition';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const isScrolled = useScrollPosition();

  const toggleDropdown = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
    
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md dark:bg-gray-900' : 'bg-purple-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <DesktopNav 
            activeDropdown={activeDropdown}
            toggleDropdown={toggleDropdown}
          />
          
          {/* Action Items */}
          <NavActionItems 
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            activeDropdown={activeDropdown}
            toggleDropdown={toggleDropdown}
          />
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileNav 
        isOpen={isOpen}
        activeDropdown={activeDropdown}
        toggleDropdown={toggleDropdown}
      />
    </nav>
    </>
    
  );
};

export default Navbar;