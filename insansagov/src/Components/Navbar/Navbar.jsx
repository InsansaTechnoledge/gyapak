import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Search, MapPin } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import axios from 'axios';
import API_BASE_URL from '../../Pages/config';

const categories = [
  { Nameid: 'Defense', name: 'Defense', icon: '🛡️' },
  { Nameid: 'Engineering', name: 'Engineering', icon: '⚙️' },
  { Nameid: 'Banking Finance', name: 'Banking & Finance', icon: '💰' },
  { Nameid: 'Civil Services', name: 'Civil Services', icon: '🏛️' },
  { Nameid: 'Medical', name: 'Medical', icon: '⚕️' },
  { Nameid: 'Statistical Economics Services', name: 'Statistical & Economics Services', icon: '📊' },
  { Nameid: 'Academics Research', name: 'Academics & Research', icon: '🎓' },
  { Nameid: 'Railways', name: 'Railways', icon: '🚂' },
  { Nameid: 'Public Services', name: 'Public Services', icon: '🏢' },
  { Nameid: 'Technical', name: 'Technical', icon: '💻' },
  { Nameid: 'Higher Education Specialized Exams', name: 'Higher Education & Specialized Exams', icon: '📚' },
  { Nameid: 'Agriculture', name: 'Agrculture', icon: '🌾' },
];



// const states = [
//   { id: 'Haryana', name: 'Haryana' },
//   { id: 'Himachal_Pradesh', name: 'Himachal Pradesh' },
//   { id: 'Punjab', name: 'Punjab' },
//   { id: 'Uttar_Pradesh', name: 'Uttar Pradesh' },
//   { id: 'Uttarakhand', name: 'Uttarakhand' },
//   { id: 'Andhra_Pradesh', name: 'Andhra Pradesh' },
//   { id: 'Karnataka', name: 'Karnataka' },
//   { id: 'Kerala', name: 'Kerala' },
//   { id: 'Tamil_Nadu', name: 'Tamil Nadu' },
//   { id: 'Madhya_Pradesh', name: 'Madhya Pradesh' },
//   { id: 'Maharashtra', name: 'Maharashtra' },
//   { id: 'Bihar', name: 'Bihar' },
//   { id: 'Odisha', name: 'Odisha' },
//   { id: 'Gujarat', name: 'Gujarat' },
//   { id: 'Rajasthan', name: 'Rajasthan' },
// ];

const StateIcon = ({ state, index }) => {
  const navigate = useNavigate();
  return (
    <div
      key={index}
      onClick={() => navigate(`/state?name=${encodeURI(state)}`)}
      className="flex items-center p-3 rounded-lg hover:bg-purple-50 transition-all duration-150 group cursor-pointer"
    >
      <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl group-hover:bg-purple-200 transition-colors">
        <MapPin className="w-5 h-5 text-purple-500 group-hover:text-purple-700" />
      </div>
      <div className="ml-3">
        <span className="text-sm font-medium text-gray-900 group-hover:text-purple-700">
          {state}
        </span>
      </div>
    </div>
  )
}

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(location.pathname === '/' ? false : true);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [states, setStates] = useState();


  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {

    const fetchStates = async () => {
      const response = await axios.get(`${API_BASE_URL}/api/state/list`);
      if (response.status === 200) {
        setStates(response.data);
      }
    }

    fetchStates();
  }, []);

  useEffect(() => {
    setIsScrolled(location.pathname === '/' ? false : true);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === '/') {
        setIsScrolled(window.scrollY > 20);
      }
    };

    if (location.pathname === '/') {
      window.addEventListener('scroll', handleScroll);
    } else {
      setIsScrolled(true);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (suggestions.organizations || suggestions.authorities || suggestions.categories) {
      const total =
        (suggestions.organizations?.length || 0) +
        (suggestions.authorities?.length || 0) +
        (suggestions.categories?.length || 0);
      setTotalCount(total);
    }
  }, [suggestions]);

  const handleSearch = (suggestion) => {
    // e.preventDefault();
    navigate(`/search/?query=${encodeURI(suggestion)}`);
    setSearchQuery("");
  };

  const inputChangeHandler = (val) => {
    setSearchQuery(val);
    fetchSuggestions(val);
  }

  // Handle suggestion selection
  const selectSuggestion = (suggestion) => {
    handleSearch(suggestion);
    setSearchQuery(suggestion);
    setShowDropdown(false);
  };

  const fetchSuggestions = debounce(async (query) => {
    if (!query) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/search/`, { params: { q: query } });
      setSuggestions(response.data.suggestions);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }, 600); // 1000ms debounce delay



  const SuggestionList = ({ title, items, itemKey }) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="mb-2">
        <div className="flex items-center justify-between text-sm font-semibold text-gray-500 px-3 py-2 bg-gray-50 sticky top-0">
          <span>{title}</span>
          <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
            {items.length}
          </span>
        </div>
        <div className="custom-scrollbar">
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => selectSuggestion(item[itemKey])}
              className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-gray-700 text-sm transition-colors duration-150"
            >
              {item[itemKey]}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px; /* Width of the scrollbar */
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #888; /* Scrollbar thumb color */
            border-radius: 4px; /* Rounded corners */
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #555; /* Thumb color on hover */
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent; /* Scrollbar track background */
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <a href='/'>
            <div className="flex-shrink-0 flex items-center hover:cursor-pointer">
              <div className="h-10 w-32 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">gyapak.com</span>
              </div>
              {/* <span className={`ml-3 text-xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
               gyapak
              </span> */}
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-8">
            {/* Categories Dropdown */}
            <div className="relative group">
              <button className={`flex items-center space-x-1 ${isScrolled ? 'text-gray-900' : 'text-white'} ${!isScrolled ? 'hover:text-gray-300' : 'hover:text-purple-800'} transition-colors`}>
                <span>Categories</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full -left-28 mt-2 w-[480px] rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Browse Categories</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category, index) => (
                      <div
                        key={index}
                        onClick={() => navigate(`/category?name=${encodeURI(category.Nameid)}`)}
                        className="flex items-center p-3 rounded-lg hover:bg-purple-50 transition-all duration-150 group cursor-pointer"
                      >
                        <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl group-hover:bg-purple-200 transition-colors">
                          <span>{category.icon}</span>
                        </div>
                        <div className="ml-3">
                          <span className="text-sm font-medium text-gray-900 group-hover:text-purple-700">
                            {category.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* States Dropdown */}
            <div
              className="relative group"
            >
              <button
                className={`flex items-center space-x-1 ${isScrolled ? 'text-gray-900' : 'text-white'} ${!isScrolled ? 'hover:text-gray-300' : 'hover:text-purple-800'} transition-colors`}
              >
                <span>States</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              
              <div className="absolute top-full -left-28 mt-2 w-[480px] rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Browse States</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {states && states.map((state, index) => (
                     <StateIcon key={index} state={state} index={index} />
                    ))}
                  </div>
                </div>
              </div>
              
            </div>


            <a href="/#about" className={`${isScrolled ? 'text-gray-900' : 'text-white'} ${!isScrolled ? 'hover:text-gray-300' : 'hover:text-purple-800'} transition-colors`}>About</a>
            <a href="/#contact" className={`${isScrolled ? 'text-gray-900' : 'text-white'} ${!isScrolled ? 'hover:text-gray-300' : 'hover:text-purple-800'} transition-colors`}>Contact</a>

            {/* Search Bar */}
            {location.pathname !== '/' && (
              <div>
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    className={`px-3 py-2 text-sm rounded-md ${isScrolled ? 'bg-gray-100 text-gray-900' : 'bg-white text-black'} focus:outline-none focus:ring-2 focus:ring-purple-600`}
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => {
                      inputChangeHandler(e.target.value);
                    }}
                    autoComplete="off"
                    onFocus={() => searchQuery && setShowDropdown(true)} // Show dropdown if input exists
                    onBlur={() => setTimeout(() => setShowDropdown(false), 1000)} // Delay to allow click selectio
                  />

                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </form>
                {showDropdown && (
                  <div className="custom-scrollbar max-h-72 overflow-auto absolute top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-50">
                    {totalCount > 0 && (
                      <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 text-xs text-gray-500">
                        Found {totalCount} total matches
                      </div>
                    )}

                    <div className="">

                      {suggestions.authorities?.length > 0 && (
                        <SuggestionList
                          title="States"
                          items={suggestions.authorities}
                          itemKey="name"
                        />
                      )}

                      {suggestions.organizations?.length > 0 && (
                        <SuggestionList
                          title="Organizations"
                          items={suggestions.organizations}
                          itemKey="abbreviation"
                        />
                      )}

                      {suggestions.categories?.length > 0 && (
                        <SuggestionList
                          title="Categories"
                          items={suggestions.categories}
                          itemKey="category"
                        />
                      )}

                      {totalCount === 0
                        ?
                        (
                          <div className="px-4 py-3 text-sm text-gray-500">
                            No suggestions found
                          </div>
                        )
                        :
                        null}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Mobile menu button */}
          <div className="xl:hidden">
            <button
              onBlur={() => (setIsOpen(false))}
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${isScrolled ? 'text-gray-900' : 'text-white'}`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
      
      className={`xl:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden bg-white`}>
        <div className="px-4 pt-2 pb-3 space-y-1">
          <a onClick={() => (setIsOpen(false))} href="/#landing-state" className="block px-3 py-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors">
            State Government Authorities
          </a>
          <a onClick={() => (setIsOpen(false))} href="/#landing-authorities" className="block px-3 py-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors">
            Central government Authorities
          </a>
          <a onClick={() => (setIsOpen(false))} href="/#landing-categories" className="block px-3 py-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors">
            Top Categories
          </a>
          <a onClick={() => (setIsOpen(false))} href="/#landing-admit" className="block px-3 py-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors">
            Latest Admit Cards
          </a>
          <a onClick={() => (setIsOpen(false))} href="/#landing-result" className="block px-3 py-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors">
            Latest Results
          </a>
          <a onClick={() => (setIsOpen(false))} href="/#about" className="block px-3 py-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors">
            About
          </a>
          <a onClick={() => (setIsOpen(false))} href="/#contact" className="block px-3 py-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors">
            Contact
          </a>
          {/* <button className="w-full mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            SignIn
          </button> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
