// components/admin/AdminHeader.jsx
import React from 'react';
import { Bell, Settings, User, LogOut } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center justify-between">
  {/* Left Side (Logo) */}
  <img src="gyapak-logo.png" alt="Gyapak Logo" className="w-33 h-10" />
  <nav>
    <ul className="flex space-x-6">
      {/* <li><a href="#" className="text-purple-600 font-medium">Dashboard</a></li>
      <li><a href="#" className="text-gray-600 hover:text-purple-600 transition duration-200">Posts</a></li>
      <li><a href="#" className="text-gray-600 hover:text-purple-600 transition duration-200">Categories</a></li>
      <li><a href="#" className="text-gray-600 hover:text-purple-600 transition duration-200">Media</a></li>
      <li><a href="#" className="text-gray-600 hover:text-purple-600 transition duration-200">Users</a></li> */}
    </ul>
  </nav>
</div>


        </div>
      </div>
    </header>
  );
};

export default Navbar;
