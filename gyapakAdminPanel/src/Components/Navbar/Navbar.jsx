// components/admin/AdminHeader.jsx
import React from 'react';
import { Bell, Settings, User, LogOut } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-purple-800 mr-8">Blog Admin</h1>
            <nav>
              <ul className="flex space-x-6">
                <li><a href="#" className="text-purple-600 font-medium">Dashboard</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-600 transition duration-200">Posts</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-600 transition duration-200">Categories</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-600 transition duration-200">Media</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-600 transition duration-200">Users</a></li>
              </ul>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700 transition duration-200">
              <Bell className="h-5 w-5" />
            </button>
            <button className="text-gray-500 hover:text-gray-700 transition duration-200">
              <Settings className="h-5 w-5" />
            </button>
            <div className="flex items-center">
              <img 
                src="/api/placeholder/32/32" 
                alt="Admin User" 
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Admin User</span>
            </div>
            <button className="text-gray-500 hover:text-gray-700 ml-2 transition duration-200">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
