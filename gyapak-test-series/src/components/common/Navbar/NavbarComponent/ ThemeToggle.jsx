// components/layout/Navbar/components/ThemeToggle.js
import React from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <button 
      className="p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors duration-200"
      onClick={toggleDarkMode}
    >
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;