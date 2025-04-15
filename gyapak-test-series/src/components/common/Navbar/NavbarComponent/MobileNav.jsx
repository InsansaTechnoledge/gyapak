import React, { useState } from 'react';
import { ChevronDown, Bell, User, Home, Settings, Layout, LogOut, CreditCard, HelpCircle } from 'lucide-react';
import navItems from './NavItems';
import AuthForm from '../../Login/AuthForm';
import { logoutUser } from '../../../../service/auth.service';
import { useUser } from '../../../../context/UserContext';
import { Link } from 'react-router-dom';


const MobileNav = ({ isOpen, activeDropdown, toggleDropdown }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { user, setUser } = useUser();

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response.status === 200) {
        setUser(null);
        alert("user logged out");
      }
    }
    catch (err) {
      console.log(err.response.errors[0] || err.message);
    }
  }

  return (
    <>
      {
        isModalOpen
          ?
          <AuthForm activeTab={activeTab} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
          :
          null
      }
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-white dark:bg-gray-900 max-h-screen overflow-auto shadow-xl rounded-b-lg border-t border-gray-100 dark:border-gray-800`}>
        {/* User Profile Summary */}
        {
          user
            ?
            <div className="px-4 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                    <User size={20} />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <div className="text-base font-semibold text-gray-800 dark:text-white">{user.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                </div>
                <button className="p-2 text-gray-600 hover:text-indigo-600 rounded-full bg-white hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200 relative shadow-sm">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800"></span>
                </button>
              </div>
              <div className="mt-2 flex items-center text-xs">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></span>
                  Online
                </span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="font-medium text-indigo-600 dark:text-indigo-400">{user.userRole}</span>
              </div>
            </div>
            :
            null
        }

        {/* Navigation Items */}
        <div className="px-2 pt-3 pb-3 divide-y divide-gray-100 dark:divide-gray-800">
        {navItems.map((item, index) => (
  <div key={index} className="py-1">
    {item.dropdown ? (
      <>
        <button
          className="w-full text-left px-4 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-200 dark:hover:bg-gray-800 flex justify-between items-center transition-all duration-200"
          onClick={() => toggleDropdown(`mobile-${index}`)}
        >
          <span className="flex items-center">
            {item.icon && <item.icon size={18} className="mr-3 text-gray-500 dark:text-gray-400" />}
            {item.name}
          </span>
          <ChevronDown
            size={18}
            className={`text-gray-400 transition-transform duration-200 ${activeDropdown === `mobile-${index}` ? 'rotate-180' : ''}`}
          />
        </button>

        {activeDropdown === `mobile-${index}` && (
          <div className="pl-4 space-y-1 mt-1 bg-gray-50 dark:bg-gray-850 rounded-lg mx-2 mb-2">
            {item.dropdown.map((dropdownItem, dropdownIndex) => (
              <Link
                key={dropdownIndex}
                to={dropdownItem.link}
                className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:text-indigo-600 hover:bg-white dark:text-gray-300 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
              >
                {dropdownItem.icon && <dropdownItem.icon size={16} className="mr-3 text-gray-500 dark:text-gray-400" />}
                {dropdownItem.name}
              </Link>
            ))}
          </div>
        )}
      </>
    ) : (
      <Link
        to={item.link}
        className="block w-full text-left px-4 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-200 dark:hover:bg-gray-800 flex justify-between items-center transition-all duration-200"
      >
        <span className="flex items-center">
          {item.icon && <item.icon size={18} className="mr-3 text-gray-500 dark:text-gray-400" />}
          {item.name}
        </span>
      </Link>
    )}
  </div>
))}

        </div>

        {/* Quick Actions */}
        <div className="px-4 py-4 bg-gray-50 dark:bg-gray-800 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 px-2">
            Quick Access
          </div>


          <div className="grid grid-cols-4 gap-2">
            <a href="/profile" className="flex flex-col items-center p-2 rounded-lg bg-white dark:bg-gray-750 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-200">
              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-gray-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-1">
                <User size={16} />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-300">Profile</span>
            </a>

            <a href="/dashboard" className="flex flex-col items-center p-2 rounded-lg bg-white dark:bg-gray-750 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-200">
              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-gray-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-1">
                <Layout size={16} />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-300">Dashboard</span>
            </a>

            <a href="/settings" className="flex flex-col items-center p-2 rounded-lg bg-white dark:bg-gray-750 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-200">
              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-gray-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-1">
                <Settings size={16} />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-300">Settings</span>
            </a>

            <a href="/help" className="flex flex-col items-center p-2 rounded-lg bg-white dark:bg-gray-750 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-200">
              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-gray-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-1">
                <HelpCircle size={16} />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-300">Help</span>
            </a>
          </div>
        </div>

        {/* Account Actions */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
          {
            !user
              ?
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setActiveTab('login');
                    setIsModalOpen(true);
                  }}
                  className="flex-1 flex justify-center items-center px-4 py-2.5 text-base font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-gray-750 dark:text-indigo-400 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setActiveTab('signup');
                    setIsModalOpen(true);
                  }}
                  className="flex-1 flex justify-center items-center px-4 py-2.5 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg shadow-md transition-all duration-200">
                  Register
                </button>
              </div>
              :
              <div>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 rounded-lg border border-red-200 hover:border-red-600 dark:text-red-400 dark:border-red-900 dark:hover:text-white dark:hover:bg-red-700 transition-colors duration-200">
                  <LogOut size={16} className="mr-2" />
                  <span>Sign out</span>
                </button>
              </div>
          }

        </div>

      </div>
    </>

  );
};

export default MobileNav;