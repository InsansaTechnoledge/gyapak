import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, Search, MapPin, AlertTriangle } from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { debounce, update } from 'lodash';
import axios from 'axios';
import { useApi, CheckServer } from '../../Context/ApiContext';
import { useQuery } from '@tanstack/react-query';
import logo from '/logo.png'
import logo2 from '/logo2.png'

const stateImages = {
        "Gujarat": "/states/Gujarat.png",
        "Haryana": "/states/Haryana.png",
        "Bihar": "/states/Bihar.png",
        "Karnataka": "/states/Karnataka.png",
        "Kerala": "/states/Kerala.png",
        "Maharashtra": "/states/Maharashtra.png",
        "Odisha": "/states/Odisha.png",
        "Punjab": "/states/Punjab.png",
        "Rajasthan": "/states/Rajasthan.png",
        "Uttar Pradesh": "/states/Uttar_pradesh.png",
        "Madhya Pradesh": "/states/Madhya Pradesh.png",
        "Tamil Nadu": "/states/Tamil_Nadu.png",
        "Uttarakhand": "/states/Uttarakhand.png",
        "Andhra Pradesh": "/states/Andhra_Pradesh.png",
        "Himachal Pradesh": "/states/Himachal_Pradesh.png",
    }

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

const StateIcon = ({ state, updateVisibleStates, setStateDropdownVisible }) => {
  const navigate = useNavigate();
  return (
    <div
      key={state._id}
      onClick={() => {
        updateVisibleStates(state.name);
        setStateDropdownVisible(false);
        navigate(`/state/government-jobs-in-${state.name}-for-12th-pass`)
      }}
      className="flex items-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300 group cursor-pointer"
    >
      <div className="h-12 w-12 rounded-xl flex items-center justify-center group-hover:from-purple-200 group-hover:to-blue-200 transition-all duration-300">
        <img 
        className='w-full object-cover h-full rounded-lg'
        src={stateImages[state.name]} />
      </div>
      <div className="ml-4">
        <span className=" font-medium text-gray-800 group-hover:text-purple-700 transition-colors">
          {state.name}
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
  const [isScrolled, setIsScrolled] = useState(location.pathname === '/government-jobs-after-12th' ? false : true);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [searchParams] = useSearchParams();
  const [visibleStates, setVisibleStates] = useState();
  const [stateDropdownVisible, setStateDropdownVisible] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState(categories);
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
  // Mobile specific states
  const [mobileStateDropdownVisible, setMobileStateDropdownVisible] = useState(false);
  const [mobileCategoryDropdownVisible, setMobileCategoryDropdownVisible] = useState(false);
  const navRef = useRef(null);


  const isHomePage = location.pathname === '/government-jobs-after-12th';



  const fetchStates = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/state/list`);
      if (response.status === 200) {
        return response.data.map(state => ({
          _id: state.stateId,
          name: state.name
        }))
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
        setMobileStateDropdownVisible(false);
        setMobileCategoryDropdownVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { data: states, isLoading } = useQuery({
    queryKey: ["navbarStates"],
    queryFn: fetchStates,
    staleTime: Infinity,
    cacheTime: 24 * 60 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (states) {
      setVisibleStates(states);
    }
  }, [states]);

  useEffect(() => {
    setIsScrolled(location.pathname === '/government-jobs-after-12th' ? false : true);
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
    if (location.pathname == `/state/government-jobs-in-${state}-for-12th-pass` && states) {
      setVisibleStates(states.filter(st => st !== state));
    }
    else {
      setVisibleStates(states);
    }
  }

  const updateVisibleCategories = (category) => {
    if (location.pathname == '/government-organisations-under-category') {
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

      if (location.pathname === '/government-jobs-after-12th') {
        setIsScrolled(window.scrollY > 20);
      }
    };

    if (location.pathname === '/government-jobs-after-12th') {
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
                setSearchQuery('');
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
        <div className="flex items-center justify-between h-20" >
          {/* Logo */}
          {/* Desktop Component (Visible on sm and larger) */}
          <div onClick={() => navigate('/')} className="group hidden sm:block hover:cursor-pointer">
            <div className="flex-shrink-0 flex items-center">
            <div className={`rounded-xl flex items-center justify-center `}>
              {isScrolled ?
              <img 
                src={logo} 
                alt="Gyapak Logo" 
                className="h-12 w-auto object-contain p-2"
              />
              : 
              <img 
                src={logo2} 
                alt="Gyapak Logo" 
                className="h-12 w-auto object-contain p-2"
              />
              }
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
                    <div className=" rounded-xl flex items-center justify-center">
                    <img 
                      src={logo} 
                      alt="Gyapak Logo" 
                      className="h-28 w-28 object-contain p-2"
                    />                        
                   </div>
                  </div>
                </div>
              </div>
              :
              null
          }

          {/* Desktop Navigation */}
          
          {!isHomePage && (
            <button
              onClick={() => navigate('/government-jobs-after-12th')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-purple-700 hover:bg-purple-50 transition-all duration-300 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Home
            </button>
          )}

          <div className="hidden lg:flex items-center gap-6">
            <a  
              href="/blog"
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${isScrolled
                  ? 'text-gray-700 hover:bg-purple-50'
                  : 'text-white hover:bg-white/10'
                }`}
            >
              Visit Blogs
            </a>

            <a
              href="/current-affair"
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${isScrolled
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${isScrolled
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
                            navigate(`/government-organisations-under-category?name=${encodeURI(category.Nameid)}`);
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${isScrolled
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
                      {(visibleStates || []).map((state) => (
                        <StateIcon
                          key={state._id}
                          state={state}
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
            {
              isHomePage && (
                <>
                    <button
                  onClick={() => {
                    setIsOpen(false);
                    const aboutSection = document.getElementById('about');
                    if (aboutSection) {
                      aboutSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`block px-4 py-3 rounded-lg ${isScrolled ? 'text-gray-700' : 'text-gray-100'}   hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300`}
                >
                  About
                </button>
                
                <button
                  onClick={() => {
                    setIsOpen(false);
                    const aboutSection = document.getElementById('contact');
                    if (aboutSection) {
                      aboutSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`block px-4 py-3 rounded-lg ${isScrolled ? 'text-gray-700' : 'text-gray-100'}   hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300`}
                >
                  Contact Us
                </button>
                </>
              )
            }
            
           

            {/* Search Input */}
            <div className="relative w-64 ">
              <input
                type="text"
                className={`w-72 px-4 py-4 text-[13px]  ${isScrolled ? 'text-gray-600' : 'text-gray-50'}
                  ${isScrolled ? 'placeholder-gray-500' : 'placeholder-gray-100'} 
                  rounded-2xl bg-gray-200/10 border-2 border-gray-300/40 transition-colors duration-300`}
                placeholder="government categories and org.."
                value={searchQuery}
                onChange={(e) => inputChangeHandler(e.target.value)}
                autoComplete="off"
                onFocus={() => searchQuery && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/search?query=${encodeURI(searchQuery.trim())}`);
                    setSearchQuery('');
                  }
                }}
              />
              <button
                type="button"
                className={`absolute right-1 top-1/2 transform -translate-y-1/2  ${isScrolled ? 'text-gray-500' : 'text-gray-100'} hover:text-purple-600 transition-colors`}
              >
                <Search className=" w-6 h-6" />
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
        className={`lg:hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden bg-white/95 backdrop-blur-sm`}>
          {isOpen && (
          <div className="flex justify-center py-4">
            <img
              src={logo} // or logo2 if needed
              alt="Gyapak Logo"
              className="h-12 w-auto"
            />
          </div>
        )}
        <div className="px-6 pt-4 pb-6 space-y-2 custom-scrollbar max-h-[80vh] overflow-y-auto">
          {/* Search Bar for Mobile */}
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/search?query=${encodeURI(searchQuery.trim())}`);
                    setSearchQuery('');
                    setShowDropdown(false);
                  }
                }}
              />
              <button
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

          {/* Mobile Menu Items */}
          {
            !isHomePage && (
              <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/government-jobs-after-12th')
                  }}
                  
                  className="block w-full text-center text-left px-4 py-3 rounded-lg text-white bg-purple-800 transition-all duration-300"
                  >
                    Home
              </button>
            )
          
          }

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
            Current Affairs
          </a>

          {/* Mobile Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMobileCategoryDropdownVisible(!mobileCategoryDropdownVisible)}
              className="flex w-full items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300"
            >
              <span className="text-base font-medium">Categories</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${mobileCategoryDropdownVisible ? 'rotate-180' : ''}`}
              />
            </button>

            {mobileCategoryDropdownVisible && (
              <div className="mt-2 rounded-xl ring-1 ring-black/5 p-4 max-h-64 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 gap-3">
                  {visibleCategories.map((category, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        updateVisibleCategories(category);
                        setMobileCategoryDropdownVisible(false);
                        setIsOpen(false);
                        navigate(`/government-organisations-under-category?name=${encodeURI(category.Nameid)}`);
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 cursor-pointer transition-all duration-300"
                    >
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-purple-200 to-blue-200 text-xl font-semibold text-purple-800 shadow-sm">
                        {category.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-800 group-hover:text-purple-700">
                        {category.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>


          {/* Mobile States Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMobileStateDropdownVisible(!mobileStateDropdownVisible)}
              className="flex w-full items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300"
            >
              <span>States</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileStateDropdownVisible ? 'rotate-180' : ''}`} />
            </button>
            
            {mobileStateDropdownVisible && (
              <div className="mt-2 bg-white/80 rounded-lg p-2 custom-scrollbar max-h-64 overflow-y-auto">
                <div className="grid grid-cols-1 gap-2">
                  {(visibleStates || []).map((state) => (
                    <div
                      key={state._id}
                      onClick={() => {
                        updateVisibleStates(state.name);
                        setMobileStateDropdownVisible(false);
                        setIsOpen(false);
                        navigate(`/state/government-jobs-in-${state.name}-for-12th-pass`);
                      }}
                      className="flex items-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300 group cursor-pointer"
                    >
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center group-hover:from-purple-200 group-hover:to-blue-200 transition-all duration-300">
                        <img 
                          className='w-full object-cover h-full rounded-lg'
                          src={stateImages[state.name]} 
                          alt={state.name}
                        />
                      </div>
                      <div className="ml-4">
                        <span className="text-sm font-medium text-gray-800 group-hover:text-purple-700">
                          {state.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-center gap-3 p-4 bg-purple-700 border border-amber-500/50 rounded-lg hover:border-amber-500 transition-colors duration-300 backdrop-blur-sm">
                  <AlertTriangle className="h-5 w-5 text-purple-50 animate-pulse" />
                  <p className="text-gray-200 text-sm leading-relaxed">
                    Remaining states would be available soon!
                  </p>
                </div>
              </div>
            )}
          </div>

          
          {/* About and Contact Mobile Links */}
          {
             isHomePage && (
              <>
              <button
              onClick={() => {
                setIsOpen(false);
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300"
            >
              About
            </button>

            <button
            onClick={() => {
              setIsOpen(false);
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300"
            >
            Contact Us
            </button>
            </>
             )
          }
         

          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;