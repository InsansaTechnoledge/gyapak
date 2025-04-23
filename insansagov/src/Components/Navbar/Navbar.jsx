import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, Search, MapPin, AlertTriangle } from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { debounce, update } from 'lodash';
import axios from 'axios';
import { useApi, CheckServer } from '../../Context/ApiContext';
import { useQuery } from '@tanstack/react-query';

const categories = [
  { Nameid: 'Defence', name: 'Defence', icon: '🛡️' },
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

const StateIcon = ({ state, index, updateVisibleStates, setStateDropdownVisible }) => {
  const navigate = useNavigate();
  return (
    <div
      key={index}
      onClick={() => {

        updateVisibleStates(state);
        setStateDropdownVisible(false);
        navigate(`/state?name=${encodeURI(state)}`)

      }}
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
  const { apiBaseUrl, setApiBaseUrl, setServerError } = useApi();
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
  const [searchParams] = useSearchParams();
  const [visibleStates, setVisibleStates] = useState();
  const [stateDropdownVisible, setStateDropdownVisible] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState(categories);
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
  const navRef = useRef(null);

  const fetchStates = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/state/list`);
      if (response.status === 200) {
        return response.data;
      }
    }
    catch (error) {
      if (error.response || error.request) {
        if ((error.response && error.response.status >= 500 && error.response.status < 600) || (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND' || error.code === "ERR_NETWORK")) {
          const url = await CheckServer();
          setApiBaseUrl(url),
            setServerError(error.response.status);
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false); // Call function when clicking outside
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { data: states, isLoading } = useQuery({
    queryKey: ["navbarStates", apiBaseUrl],
    queryFn: fetchStates,
    staleTime: Infinity, // ✅ Data never becomes stale, preventing automatic refetch
    cacheTime: 24 * 60 * 60 * 1000, // ✅ Keeps cache alive for 24 hours in memory
    refetchOnMount: true, // ✅ Prevents refetch when component mounts again
    refetchOnWindowFocus: false, // ✅ Prevents refetch when switching tabs
  })

  useEffect(() => {
    if (states) {
      setVisibleStates(states);
    }
  }, [states]);

  useEffect(() => {
    setIsScrolled(location.pathname === '/' ? false : true);
    if (location.pathname == '/state' && states) {
      const currState = searchParams.get("name");
      setVisibleStates(states.filter(st => st !== currState));
    }
    else {
      setVisibleStates(states);
    }

    if (location.pathname == '/category') {
      const currCategory = searchParams.get("name");
      setVisibleCategories(categories.filter(cat => cat !== currCategory));
    }
    else {
      setVisibleCategories(categories);
    }
  }, [location.pathname]);

  const updateVisibleStates = (state) => {
    if (location.pathname == '/state' && states) {
      setVisibleStates(states.filter(st => st !== state));
    }
    else {
      setVisibleStates(states);
    }
  }

  const updateVisibleCategories = (category) => {
    if (location.pathname == '/category') {
      setVisibleCategories(categories.filter(cat => cat !== category));
    }
    else {
      setVisibleCategories(categories);
    }
  }


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
    const trimmedSuggestion = suggestion.trim();
    navigate(`/search/?query=${encodeURI(trimmedSuggestion)}`);
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
      const response = await axios.get(`${apiBaseUrl}/api/search/`, { params: { q: query.trim() } });
      setSuggestions(response.data.suggestions);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      if (error.response) {
        if (error.response.status >= 500 && error.response.status < 600) {
          console.error("🚨 Server Error:", error.response.status, error.response.statusText);
          const url = CheckServer();
          setApiBaseUrl(url),
            setServerError(error.response.status);
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
              onClick={() => {
                selectSuggestion(item[itemKey])
                setIsOpen(false);
              }}
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

    <nav 
    ref={navRef}
className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
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
          <div className="hidden lg:flex items-center gap-6">
  <a
    href="/blog"
    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
      isScrolled
        ? 'text-gray-700 hover:bg-purple-50'
        : 'text-white hover:bg-white/10'
    }`}
  >
    Visit Blogs
  </a>

  <a
    href="/current-affair"
    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
      isScrolled
        ? 'text-gray-700 hover:bg-purple-50'
        : 'text-white hover:bg-white/10'
    }`}
  >
    Current Affairs
  </a>

  {/* Categories Dropdown */}
  <div
    className="relative"
    onMouseLeave={() => setCategoryDropdownVisible(false)}
  >
    <button
      onMouseEnter={() => setCategoryDropdownVisible(true)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
        isScrolled
          ? 'text-gray-700 hover:bg-purple-50'
          : 'text-white hover:bg-white/10'
      }`}
    >
      <span>Categories</span>
      <ChevronDown className="w-4 h-4" />
    </button>

    {categoryDropdownVisible && (
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[720px] bg-white/95 backdrop-blur-sm rounded-xl shadow-xl ring-1 ring-black/5">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Browse Categories
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {visibleCategories.map((category, index) => (
              <div
                key={index}
                onClick={() => {
                  updateVisibleCategories(category);
                  setCategoryDropdownVisible(false);
                  navigate(`/category?name=${encodeURI(category.Nameid)}`);
                }}
                className="flex items-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300 group cursor-pointer"
              >
                <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 text-xl group-hover:from-purple-200 group-hover:to-blue-200 transition-all duration-300">
                  <span>{category.icon}</span>
                </div>
                <div className="ml-4">
                  <span className="text-sm font-medium text-gray-800 group-hover:text-purple-700">
                    {category.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
  </div>

  {/* States Dropdown */}
  <div
    className="relative"
    onMouseLeave={() => setStateDropdownVisible(false)}
  >
    <button
      onMouseEnter={() => setStateDropdownVisible(true)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
        isScrolled
          ? 'text-gray-700 hover:bg-purple-50'
          : 'text-white hover:bg-white/10'
      }`}
    >
      <span>States</span>
      <ChevronDown className="w-4 h-4" />
    </button>

    {stateDropdownVisible && (
      <div className="absolute top-full left-1/2 transform -translate-x-2/3 w-[900px] bg-white/95 backdrop-blur-sm rounded-xl shadow-xl ring-1 ring-black/5">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Browse States
          </h3>
          <div className="grid grid-cols-4 gap-4">
          {(visibleStates || []).map((state, index) => (
            <StateIcon
              key={index}
              state={state}
              index={index}
              updateVisibleStates={updateVisibleStates}
              setStateDropdownVisible={setStateDropdownVisible}
            />
          ))}

          </div>
          <div className="mt-4 flex items-center justify-center gap-3 p-4 bg-purple-700 border border-amber-500/50 rounded-lg hover:border-amber-500 transition-colors duration-300 backdrop-blur-sm">
            <AlertTriangle className="h-5 w-5 text-purple-50 animate-pulse" />
            <p className="text-gray-200 text-sm leading-relaxed">
              Remaining states would be available soon!
            </p>
          </div>
        </div>
      </div>
    )}
  </div>

  {/* Navigation Links */}
  <a
    href="/#about"
    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
      isScrolled
        ? 'text-gray-700 hover:bg-purple-50'
        : 'text-white hover:bg-white/10'
    }`}
  >
    About
  </a>

  <a
    href="/#contact"
    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
      isScrolled
        ? 'text-gray-700 hover:bg-purple-50'
        : 'text-white hover:bg-white/10'
    }`}
  >
    Contact
  </a>

  {/* Search Input (conditionally rendered) */}
  {location.pathname !== '/' && (
    <div className="relative w-64">
      <input
        type="text"
        className="w-full px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => inputChangeHandler(e.target.value)}
        autoComplete="off"
        onFocus={() => searchQuery && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            navigate(`/search?query=${encodeURI(searchQuery.trim())}`);
          }
        }}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
      >
        <Search className="w-5 h-5" />
      </button>

      {showDropdown && (
        <div className="absolute z-50 mt-2 w-full bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl max-h-72 overflow-auto custom-scrollbar">
          {totalCount > 0 && (
            <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200 text-xs font-medium text-purple-600">
              Found {totalCount} total matches
            </div>
          )}
          <div>
            {suggestions.authorities?.length > 0 && (
              <SuggestionList title="States" items={suggestions.authorities} itemKey="name" />
            )}
            {suggestions.organizations?.length > 0 && (
              <SuggestionList title="Organizations" items={suggestions.organizations} itemKey="abbreviation" />
            )}
            {suggestions.categories?.length > 0 && (
              <SuggestionList title="Categories" items={suggestions.categories} itemKey="category" />
            )}
            {totalCount === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500">No suggestions found</div>
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
      <div
        
        className={`xl:hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden bg-white/95 backdrop-blur-sm`}>
        <div className="px-6 pt-4 pb-6 space-y-2">
          {/* Search Bar for Mobile */}
          {location.pathname !== '/' && (
            <div className="mb-4 relative">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2.5 text-sm rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => inputChangeHandler(e.target.value)}
                  onFocus={() => searchQuery && setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}

                />
                < button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors duration-300"
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>
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
            href="/#landing-result"
            className="block px-4 py-3 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300"
          >
            Important Links
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

          <a
            onClick={() => setIsOpen(false)}
            href="/blog"
            className="block px-4 py-3 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300"
          >
            Visit Blogs
          </a>

          <a
            onClick={() => setIsOpen(false)}
            href="/current-affair"
            className="block px-4 py-3 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300"
          >
            Current Affair
          </a>
        </div>
      </div>
    </nav >
  );
};

export default Navbar;