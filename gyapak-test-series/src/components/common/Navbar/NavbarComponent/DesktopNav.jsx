// components/layout/Navbar/components/DesktopNav.js
import React from 'react';
import { ChevronDown } from 'lucide-react';
import navItems from './NavItems';

const DesktopNav = ({ activeDropdown, toggleDropdown }) => {
  return (
    <div className="hidden md:block">
      <div className="flex items-center space-x-4">
        {navItems.map((item, index) => (
          <div key={index} className="relative">
            <button
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-200 dark:hover:text-indigo-400 flex items-center transition-colors duration-200"
              onClick={() => item.dropdown && toggleDropdown(index)}
            >
              {item.name}
              {item.dropdown && (
                <ChevronDown 
                  size={16} 
                  className={`ml-1 transition-transform duration-200 ${activeDropdown === index ? 'transform rotate-180' : ''}`} 
                />
              )}
            </button>
            
            {/* Dropdown Menu */}
            {item.dropdown && activeDropdown === index && (
              <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-100 dark:border-gray-700">
                {item.dropdown.map((dropdownItem, dropdownIndex) => (
                  <a
                    key={dropdownIndex}
                    href={dropdownItem.link}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-indigo-400"
                  >
                    {dropdownItem.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DesktopNav;