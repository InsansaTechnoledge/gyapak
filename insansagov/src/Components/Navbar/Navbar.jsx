import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Search, MapPin, AlertTriangle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import axios from 'axios';
import { useApi } from '../../Context/ApiContext';
import { useQuery } from '@tanstack/react-query';

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
  { Nameid: 'Agriculture', name: 'Agriculture', icon: '🌾' },
];

const StateIcon = ({ state, index }) => {
  const navigate = useNavigate();
  return (
    <div
      key={index}
      onClick={() => navigate(`/state?name=${encodeURI(state)}`)}
      className="flex items-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300 group cursor-pointer"
    >
      <div className="h-12 w-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:from-purple-200 group-hover:to-blue-200 transition-all duration-300">
        <MapPin className="w-6 h-6 text-purple-600 group-hover:text-purple-700" />
      </div>
      <div className="ml-4">
        <span className="text-sm font-medium text-gray-800 group-hover:text-purple-700 transition-colors">
          {state}
        </span>
      </div>
    </div>
  );
};

const Navbar = () => {
  const { apiBaseUrl, setApiBaseUrl } = useApi();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(location.pathname === '/' ? false : true);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  // const [states, setStates] = useState();
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);

  const fetchStates = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/state/list`);
      if (response.status === 200) {
        return response.data;
      }
    }
    catch (error) {
      if (error.response) {
        if (error.response.status >= 500 && error.response.status < 600) {
          console.error("🚨 Server Error:", error.response.status, error.response.statusText);
          const url = CheckServer();
          setApiBaseUrl(url);
          fetchStates();
        }
        else {
          console.error('Error fetching state count:', error);
        }
      }
      else {
        console.error('Error fetching state count:', error);
      }
    }
  }

  // Existing useEffects remain the same
  // useEffect(() => {
  //   fetchStates();
  // }, []);

  const { data: states, isLoading } = useQuery({
    queryKey: ["navbarStates"],
    queryFn: fetchStates,
    staleTime: Infinity, // ✅ Data never becomes stale, preventing automatic refetch
    cacheTime: 24 * 60 * 60 * 1000, // ✅ Keeps cache alive for 24 hours in memory
    refetchOnMount: true, // ✅ Prevents refetch when component mounts again
    refetchOnWindowFocus: false, // ✅ Prevents refetch when switching tabs
  })

  useEffect(() => {
    setIsScrolled(location.pathname === '/' ? false : true);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setLogoVisible(true);
      }
      else {
        setLogoVisible(false);
      }

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
    // preventDefault();
    navigate(`/search/?query=${encodeURI(suggestion)}`);
    setSearchQuery("");
  };

  const inputChangeHandler = (val) => {
    setSearchQuery(val);
    fetchSuggestions(val);
  };

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
      console.log('Fetching suggestions for:', apiBaseUrl);
      const response = await axios.get(`${apiBaseUrl}/api/search/`, { params: { q: query } });
      setSuggestions(response.data.suggestions);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      if (error.response) {
        if (error.response.status >= 500 && error.response.status < 600) {
          console.error("🚨 Server Error:", error.response.status, error.response.statusText);
          const url = CheckServer();
          setApiBaseUrl(url);
          fetchSuggestions();
        }
        else {
          console.error('Error fetching state count:', error);
        }
      }
      else {
        console.error('Error fetching state count:', error);
      }
    }
  }, 600);

  const SuggestionList = ({ title, items, itemKey }) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="mb-2">
        <div className="flex items-center justify-between text-sm font-semibold text-gray-600 px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50">
          <span>{title}</span>
          <span className="bg-white text-purple-600 px-2 py-0.5 rounded-full text-xs font-bold">
            {items.length}
          </span>
        </div>
        <div className="custom-scrollbar">
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => selectSuggestion(item[itemKey])}
              className="px-4 py-2.5 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 cursor-pointer text-gray-700 text-sm transition-all duration-300"
            >
              {item[itemKey]}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (

    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #9333ea;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #7e22ce;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          {/* Desktop Component (Visible on sm and larger) */}
          <div onClick={() => navigate('/')} className="group hidden sm:block hover:cursor-pointer">
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center group-hover:from-purple-700 group-hover:to-blue-700 transition-all duration-300 shadow-md group-hover:shadow-lg">
                <span className="text-white text-xl pt-3 pb-4 px-4 font-bold">gyapak.in</span>
              </div>
            </div>
          </div>

          {/* Mobile Component (Visible only on small screens) */}
          {
            logoVisible
              ?
              <div>
                <div onClick={() => navigate('/')} className="group block sm:hidden">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center group-hover:from-purple-700 group-hover:to-blue-700 transition-all duration-300 shadow-md group-hover:shadow-lg">
                      <span className="text-white text-xl pt-3 pb-4 px-4 font-bold">gyapak.in</span>
                    </div>
                  </div>
                </div>
              </div>
              :
              null
          }



          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Categories Dropdown */}
            <div className="relative group">
              <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${isScrolled ? 'text-gray-700 hover:bg-purple-50' : 'text-white hover:bg-white/10'} transition-all duration-300`}>
                <span>Categories</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full -left-28 mt-2 w-[480px] rounded-xl shadow-xl bg-white/95 backdrop-blur-sm ring-1 ring-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse Categories</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((category, index) => (
                      <div
                        key={index}
                        onClick={() => navigate(`/category?name=${encodeURI(category.Nameid)}`)}
                        className="flex items-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300 group cursor-pointer"
                      >
                        <div className="h-12 w-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center text-xl group-hover:from-purple-200 group-hover:to-blue-200 transition-all duration-300">
                          <span>{category.icon}</span>
                        </div>
                        <div className="ml-4">
                          <span className="text-sm font-medium text-gray-800 group-hover:text-purple-700 transition-colors">
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
            <div className="relative group">
              <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${isScrolled ? 'text-gray-700 hover:bg-purple-50' : 'text-white hover:bg-white/10'} transition-all duration-300`}>
                <span>States</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-1/2 transform -translate-x-[60%] mt-2 w-[700px] rounded-xl shadow-xl bg-white/95 backdrop-blur-sm ring-1 ring-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Browse States</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {states && states.map((state, index) => (
                      <StateIcon key={index} state={state} index={index} />
                    ))}
                  </div>
                  <div className="mt-4 flex items-start justify-center space-x-3 bg-purple-700 p-4 rounded-lg border border-amber-500/50 hover:border-amber-500 transition-colors duration-300 backdrop-blur-sm">
                    <AlertTriangle className="h-5 w-5 text-purple-50 flex-shrink-0 mt-1 animate-pulse" />
                    <p className="text-gray-200 text-sm leading-relaxed">
                      Remaining states would be available soon!
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Navigation Links */}
            <a href="/#about" className={`px-4 py-2 rounded-lg ${isScrolled ? 'text-gray-700 hover:bg-purple-50' : 'text-white hover:bg-white/10'} transition-all duration-300`}>
              About
            </a>
            <a href="/#contact" className={`px-4 py-2 rounded-lg ${isScrolled ? 'text-gray-700 hover:bg-purple-50' : 'text-white hover:bg-white/10'} transition-all duration-300`}>
              Contact
            </a>

            {/* Search Bar */}
            {location.pathname !== '/' && (
              <div className="relative">
                <div className="relative">
                  <input
                    type="text"
                    className="w-64 px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => inputChangeHandler(e.target.value)}
                    autoComplete="off"
                    onFocus={() => searchQuery && setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        navigate(`/search?query=${encodeURI(searchQuery)}`)
                      }
                      console.log(e)
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors duration-300"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>

                {showDropdown && (
                  <div className="custom-scrollbar max-h-72 overflow-auto absolute top-full mt-2 w-full bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl z-50">
                    {totalCount > 0 && (
                      <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200 text-xs font-medium text-purple-600">
                        Found {totalCount} total matches
                      </div>
                    )}
                    <div>
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
                      {totalCount === 0 && (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          No suggestions found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg ${isScrolled ? 'text-gray-700 hover:bg-purple-50' : 'text-white hover:bg-white/10'} transition-all duration-300`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`xl:hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden bg-white/95 backdrop-blur-sm`}>
        <div className="px-6 pt-4 pb-6 space-y-2">
          {/* Search Bar for Mobile */}
          {location.pathname !== '/' && (
            <div className="mb-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2.5 text-sm rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => inputChangeHandler(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors duration-300"
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}

          {/* Mobile Menu Items */}
          <a
            onClick={() => setIsOpen(false)}
            href="/#landing-state"
            className="block px-4 py-3 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300"
          >
            State Government Authorities
          </a>
          <a
            onClick={() => setIsOpen(false)}
            href="/#landing-authorities"
            className="block px-4 py-3 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300"
          >
            Central Government Authorities
          </a>
          <a
            onClick={() => setIsOpen(false)}
            href="/#landing-categories"
            className="block px-4 py-3 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300"
          >
            Top Categories
          </a>
          <a
            onClick={() => setIsOpen(false)}
            href="/#landing-admit"
            className="block px-4 py-3 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300"
          >
            Latest Admit Cards
          </a>
          <a
            onClick={() => setIsOpen(false)}
            href="/#landing-result"
            className="block px-4 py-3 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300"
          >
            Latest Results
          </a>
          <a
            onClick={() => setIsOpen(false)}
            href="/#about"
            className="block px-4 py-3 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300"
          >
            About
          </a>
          <a
            onClick={() => setIsOpen(false)}
            href="/#contact"
            className="block px-4 py-3 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300"
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;