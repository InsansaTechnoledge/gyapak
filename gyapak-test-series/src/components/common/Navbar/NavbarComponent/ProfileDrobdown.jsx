import React from 'react';
import { User, Settings, Layout, LogOut, ChevronDown } from 'lucide-react';
import { useUser } from '../../../../context/UserContext';
import { logoutUser } from '../../../../service/auth.service';

const ProfileDropdown = ({ activeDropdown, toggleDropdown}) => {
  const { user, setUser } = useUser();
  console.log(user);
  const logout = async () => {
    try{
      const response = await logoutUser();
      if (response.status === 200) {
        // console.log(response.data.message);
        setUser(null);
        alert("user Logged out!");
    }
    }
    catch(err){
      alert(err.response.errors[0] || err.response.message);
    }

  }

  if(!user){
    return null
  }

  return (
    <div className="relative">
      <button 
        className="flex items-center space-x-3 p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
        onClick={() => toggleDropdown('profile')}
        aria-expanded={activeDropdown === 'profile'}
        aria-haspopup="true"
      >
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
          <User size={18} />
        </div>
        
        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{user.name}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{user.userRole}</span>
        </div>
        
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform duration-200 ${activeDropdown === 'profile' ? 'rotate-180' : ''}`}
        />
      </button>
      
      {/* Enhanced Profile Dropdown */}
      {activeDropdown === 'profile' && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 z-20 border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* User info section */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                <User size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-800 dark:text-gray-200">{user.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
              </div>
            </div>
          </div>
          
          {/* Menu items */}
          <div className="py-1">
            <a href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-indigo-400">
              <User size={16} className="mr-3 text-gray-500 dark:text-gray-400" />
              <span>Your Profile</span>
            </a>
            
            <a href="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-indigo-400">
              <Layout size={16} className="mr-3 text-gray-500 dark:text-gray-400" />
              <span>Dashboard</span>
            </a>
            
            <a href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-indigo-400">
              <Settings size={16} className="mr-3 text-gray-500 dark:text-gray-400" />
              <span>Settings</span>
            </a>
          </div>
          
          {/* Status and theme toggles */}
          <div className="px-4 py-2 border-t border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Status</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                Online
              </span>
            </div>
          </div>
          
          {/* Sign out button */}
          <div className="px-4 py-2">
            <button 
            onClick={()=>{logout()}}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors">
              <LogOut size={16} className="mr-2" />
              <span>Sign out</span>
            </button>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;