import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Search,
  MapPin,
  AlertTriangle,
  Newspaper,
  FileText,
} from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useApi, CheckServer } from "../../Context/ApiContext";
import { useQuery } from "@tanstack/react-query";
import logo3 from "/logo3.png";
import logo4 from "/logo4.png";
import {
  MdKeyboardArrowUp,
  MdOutlineTranslate,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { debounce } from "../../Utils/debounce";

const stateImages = {
  Gujarat: "/states/Gujarat.png",
  Haryana: "/states/Haryana.png",
  Bihar: "/states/Bihar.png",
  Karnataka: "/states/Karnataka.png",
  Kerala: "/states/Kerala.png",
  Maharashtra: "/states/Maharashtra.png",
  Odisha: "/states/Odisha.png",
  Punjab: "/states/Punjab.png",
  Rajasthan: "/states/Rajasthan.png",
  "Uttar Pradesh": "/states/UttarPradesh2.jpg",
  "Madhya Pradesh": "/states/Madhya Pradesh.png",
  "Tamil Nadu": "/states/Tamil_Nadu.png",
  Uttarakhand: "/states/Uttarakhand.png",
  "Andhra Pradesh": "/states/Andhra_Pradesh.png",
  "Himachal Pradesh": "/states/Himachal_Pradesh.png",
  "West Bengal": "/states/westBengal.jpeg",
  Delhi: "/states/delhi.webp",
};

const categories = [
  { Nameid: "Defence", name: "Defence", icon: "🛡️" },
  { Nameid: "Engineering", name: "Engineering", icon: "⚙️" },
  { Nameid: "Banking Finance", name: "Banking & Finance", icon: "💰" },
  { Nameid: "Civil Services", name: "Civil Services", icon: "🏛️" },
  { Nameid: "Medical", name: "Medical", icon: "⚕️" },
  {
    Nameid: "Statistical Economics Services",
    name: "Statistical & Economics Services",
    icon: "📊",
  },
  { Nameid: "Academics Research", name: "Academics & Research", icon: "🎓" },
  { Nameid: "Railways", name: "Railways", icon: "🚂" },
  { Nameid: "Public Services", name: "Public Services", icon: "🏢" },
  { Nameid: "Technical", name: "Technical", icon: "💻" },
  {
    Nameid: "Higher Education Specialized Exams",
    name: "Higher Education & Specialized Exams",
    icon: "📚",
  },
  { Nameid: "Agriculture", name: "Agriculture", icon: "🌾" },
];

/** Compact, single-line tile with truncation for better laptop alignment */
const StateIcon = ({ state, updateVisibleStates, setStateDropdownVisible }) => {
  const navigate = useNavigate();
  return (
    <div
      key={state._id}
      onClick={() => {
        updateVisibleStates(state.name);
        setStateDropdownVisible(false);
        navigate(`/state/government-jobs-in-${state.name}-for-12th-pass`);
      }}
      className="flex items-center p-2 lg:p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300 group cursor-pointer min-w-0"
    >
      <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl flex-shrink-0 overflow-hidden">
        <img
          className="w-full h-full object-cover rounded-lg"
          src={stateImages[state.name]}
          alt={state.name}
        />
      </div>
      <div className="ml-3 lg:ml-4 min-w-0">
        <span className="block text-sm lg:text-[15px] font-medium text-gray-800 group-hover:text-purple-700 whitespace-nowrap truncate max-w-[140px]">
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
  const [isScrolled, setIsScrolled] = useState(
    location.pathname === "/government-jobs-after-12th" ? false : true
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [suggestions, setSuggestions] = useState({
    organizations: [],
    authorities: [],
    categories: [],
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [searchParams] = useSearchParams();
  const [visibleStates, setVisibleStates] = useState();
  const [stateDropdownVisible, setStateDropdownVisible] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState(categories);
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
  const [mobileStateDropdownVisible, setMobileStateDropdownVisible] =
    useState(false);
  const [mobileCategoryDropdownVisible, setMobileCategoryDropdownVisible] =
    useState(false);
  const [isSearched, setIsSearched] = useState(false);

  // new one
  const [activeMenu, setActiveMenu] = useState(null);

  const [showTop, setShowTop] = useState(true);
  const [mobileSub, setMobileSub] = useState(null); // 'govJob' | 'exam' | null

  // toggle dropdown
  const handleMenuClick = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const navRef = useRef(null);
  const desktopSearchInputRef = useRef(null);

  const isHomePage = location.pathname === "/government-jobs-after-12th";
  const dailyaffairsPage = location.pathname === "/daily-updates";

  const goDailyUpdates = () => {
    setIsOpen(false);
    navigate("/daily-updates");
  };

  const fetchStates = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/state/list`);
      if (response.status === 200) {
        return response.data.map((state) => ({
          _id: state.stateId,
          name: state.name,
        }));
      }
    } catch (error) {
      if (error.response || error.request) {
        if (
          (error.response &&
            error.response.status >= 500 &&
            error.response.status < 600) ||
          error.code === "ECONNREFUSED" ||
          error.code === "ETIMEDOUT" ||
          error.code === "ENOTFOUND" ||
          error.code === "ERR_NETWORK"
        ) {
          const url = await CheckServer();
          setApiBaseUrl(url), setServerError(error.response?.status);
        } else {
          console.error("Error fetching state count:", error);
        }
      } else {
        console.error("Error fetching state count:", error);
      }
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
        setMobileStateDropdownVisible(false);
        setMobileCategoryDropdownVisible(false);
        setActiveMenu(null);
        setIsSearched(false); // close desktop search on outside click
        setShowDropdown(false); // hide suggestions
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { data: states } = useQuery({
    queryKey: ["navbarStates"],
    queryFn: fetchStates,
    staleTime: Infinity,
    cacheTime: 24 * 60 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (states) setVisibleStates(states);
  }, [states]);

  useEffect(() => {
    setIsScrolled(
      location.pathname === "/government-jobs-after-12th" ? false : true
    );
    if (location.pathname == "/state" && states) {
      const currState = searchParams.get("name");
      setVisibleStates(states.filter((st) => st !== currState));
    } else {
      setVisibleStates(states);
    }

    if (location.pathname == "/category") {
      const currCategory = searchParams.get("name");
      setVisibleCategories(categories.filter((cat) => cat !== currCategory));
    } else {
      setVisibleCategories(categories);
    }
  }, [location.pathname]);

  const updateVisibleStates = (state) => {
    if (
      location.pathname == `/state/government-jobs-in-${state}-for-12th-pass` &&
      states
    ) {
      setVisibleStates(states.filter((st) => st !== state));
    } else {
      setVisibleStates(states);
    }
  };

  const updateVisibleCategories = (category) => {
    if (
      location.pathname.startsWith("/government-organisations-under-category/")
    ) {
      setVisibleCategories(categories.filter((cat) => cat !== category));
    } else {
      setVisibleCategories(categories);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) setLogoVisible(true);
      else setLogoVisible(false);

      if (location.pathname === "/") {
        setIsScrolled(window.scrollY > 20);
      }
    };

    if (location.pathname === "/") {
      window.addEventListener("scroll", handleScroll);
    } else {
      setIsScrolled(true);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (
      suggestions.organizations ||
      suggestions.authorities ||
      suggestions.categories
    ) {
      const total =
        (suggestions.organizations?.length || 0) +
        (suggestions.authorities?.length || 0) +
        (suggestions.categories?.length || 0);
      setTotalCount(total);
    }
  }, [suggestions]);

  const handleSearch = (suggestion) => {
    const trimmedSuggestion = suggestion.trim();
    navigate(`/search?query=${encodeURI(trimmedSuggestion)}`);
    setSearchQuery("");
  };

  const inputChangeHandler = (val) => {
    setSearchQuery(val);
    fetchSuggestionsDebounced.current?.(val);
  };

  const selectSuggestion = (suggestion) => {
    handleSearch(suggestion);
    setSearchQuery(suggestion);
    setShowDropdown(false);
  };

  const fetchSuggestionsDebounced = useRef(null);

  useEffect(() => {
    fetchSuggestionsDebounced.current = debounce(async (query) => {
      if (!query) {
        setSuggestions({
          organizations: [],
          authorities: [],
          categories: [],
        });
        setShowDropdown(false);
        return;
      }

      try {
        const response = await axios.get(`${apiBaseUrl}/api/search/`, {
          params: { q: query.trim() },
        });

        setSuggestions(response.data.suggestions);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        if (
          error.response &&
          error.response.status >= 500 &&
          error.response.status < 600
        ) {
          const url = await CheckServer();
          setApiBaseUrl(url);
          setServerError(error.response.status);
        }
      }
    }, 600);

    return () => {
      fetchSuggestionsDebounced.current?.cancel?.();
    };
  }, [apiBaseUrl, setApiBaseUrl, setServerError]);

  const SuggestionList = ({ title, items, itemKey }) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-2 ">
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
                selectSuggestion(item[itemKey]);
                setIsOpen(false);
                setSearchQuery("");
              }}
              className="px-4 py-2.5 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 cursor-pointer text-gray-700 text-sm transition-all duration-300 whitespace-nowrap truncate"
            >
              {item[itemKey]}
            </div>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    let lastY = window.scrollY;

    const controlNavbar = () => {
      //this function will call on each scroll
      const currentY = window.scrollY;
      const diff = currentY - lastY;

      if (diff > 40 && currentY > 80) {
        //going down then hide only show the second strip
        setShowTop(false);
        lastY = currentY;
      } else if (diff < -40) {
        //goes up then show the both
        setShowTop(true);
        lastY = currentY;
      }
    };

    window.addEventListener("scroll", controlNavbar);

    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className={`w-full flex flex-col fixed top-0 left-0 z-50`}
    >
      {/* --- Top Strip --- */}
      <div
        className={`bg-gradient-to-r from-violet-950 to-purple-900  flex items-center justify-between h-20  px-6 gap-2 md:px-36 transition-transform duration-500 fixed top-0 left-0 w-full md:w-full z-50
            ${
              showTop
                ? "translate-0 md:translate-0"
                : "translate-0 md:-translate-y-full"
            }
          `}
      >
        {/* Left side with Logo + Add button */}
        <div className="flex items-center gap-4">
          <div className="text-pink-600 font-bold text-xl">
            <a href="/">
              {" "}
              <img src={logo4} alt="gyapak logo" height={32} width={120} />
            </a>
          </div>
        </div>

        {/* {
          !dailyaffairsPage && (
            <a
              href="/daily-updates"
              className="hidden md:inline-flex font-medium text-gray-800 hover:text-purple-700 transition-colors"
            >
              <div className="flex items-center gap-1 border-black border-2 text-gray-500 px-2 md:px-3 py-2 h-8 md:h-10  bg-gray-100 rounded-full transition-all w-fit">
                <span className="hidden md:block text-xs font-semibold bg-green-600 animate-pulse text-white px-2 py-[2px] rounded-full uppercase tracking-wide">
                  New
                </span>
                Today's Current Affairs in Hindi
              </div>
            </a>
          )
        } */}

        {/* Right side */}
        <div className="flex items-center gap-2  md:gap-6 text-sm ">
          {/* Desktop search with smooth transition */}
          <div
            className={`
              hidden md:flex items-center relative
              transition-all duration-300 ease-out
              ${
                isSearched
                  ? "w-[420px] bg-gray-50 px-3 py-1.5 rounded-xl shadow-accertinity"
                  : "w-9 justify-center"
              }
            `}
          >
            {isSearched && (
              <input
                ref={desktopSearchInputRef}
                value={searchQuery}
                onChange={(e) => inputChangeHandler(e.target.value)}
                type="text"
                placeholder="search states/categories . . ."
                className="flex-1 bg-transparent outline-none text-gray-600 text-sm pr-8"
                onFocus={() => searchQuery && setShowDropdown(true)}
                onBlur={() => {
                  setTimeout(() => {
                    setShowDropdown(false);
                    if (!searchQuery.trim()) {
                      setIsSearched(false);
                    }
                  }, 150);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (searchQuery.trim()) {
                      navigate(
                        `/search?query=${encodeURI(searchQuery.trim())}`
                      );
                      setSearchQuery("");
                      setShowDropdown(false);
                      setIsSearched(false);
                    }
                  } else if (e.key === "Escape") {
                    setIsSearched(false);
                    setShowDropdown(false);
                  }
                }}
              />
            )}

            <button
              type="button"
              onClick={() => {
                if (!isSearched) {
                  setIsSearched(true);
                  setTimeout(() => {
                    desktopSearchInputRef.current?.focus();
                  }, 0);
                } else if (!searchQuery.trim()) {
                  setIsSearched(false);
                  setShowDropdown(false);
                } else {
                  navigate(`/search?query=${encodeURI(searchQuery.trim())}`);
                  setSearchQuery("");
                  setShowDropdown(false);
                  setIsSearched(false);
                }
              }}
              className={`flex items-center justify-center ${
                isSearched ? "ml-2" : ""
              }`}
            >
              <Search
                size={24}
                className={`${
                  isSearched ? "text-slate-500" : "text-slate-100"
                }`}
              />
            </button>

            {isSearched && showDropdown && (
              <div className="absolute left-0 top-full z-[9999] mt-2 w-full bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl max-h-72 overflow-auto custom-scrollbar">
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

          {/* Mobile hamburger */}
          <div className="flex flex-col items-center gap-3">
            <button
              className="md:hidden p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 hover:border-white/40 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
              aria-label="Open menu"
              onClick={() => setIsOpen((v) => !v)}
            >
              {isOpen ? (
                <X size={20} className="text-white" />
              ) : (
                <Menu size={20} className="text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={` hidden md:flex bg-white items-center h-20 px-6 md:px-36 transition-transform duration-500 top-0 left-0 z-45 w-full fixed
            ${showTop ? "translate-0 md:translate-y-16" : " top-0  "}`}
      >
        {/* Menu left */}
        <div className="flex gap-6 font-medium text-gray-700 items-center">
          <a
            href="/blog"
            className="relative group px-4 py-2 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <span className="text-purple-700 font-semibold">📚 Blogs</span>
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">NEW</span>
          </a>
          <button
            className="hover:text-pink-600 flex items-center gap-1 "
            onClick={() => handleMenuClick("categories")}
          >
            Categories{" "}
            {activeMenu === "categories" ? (
              <MdKeyboardArrowUp />
            ) : (
              <MdKeyboardArrowDown />
            )}
          </button>

          <button
            className="hover:text-pink-600 flex items-center gap-1"
            onClick={() => handleMenuClick("state")}
          >
            State{" "}
            {activeMenu === "state" ? (
              <MdKeyboardArrowUp />
            ) : (
              <MdKeyboardArrowDown />
            )}
          </button>
        </div>

        {/* Menu right */}
        <div className="ml-auto flex gap-6 font-medium text-gray-700 items-center">
          <a 
            href="/last-date-to-apply-for-online-offline-government-jobs-applications" 
            className="relative group px-4 py-2 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 transition-all duration-300 shadow-sm hover:shadow-md border border-red-200"
          >
            <span className="text-red-700 font-semibold flex items-center gap-1.5">
              ⏰ Last Date to Apply
            </span>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">HOT</span>
          </a>
          <a href="" className="hover:text-pink-600">
            About
          </a>
          <a href="/contact-us" className="hover:text-pink-600">
            Contact
          </a>
        </div>
      </div>

      {activeMenu === "categories" && (
        <div
          className={`fixed left-1/2 top-[112px] -translate-x-1/2 w-[660px] bg-white/95 backdrop-blur-sm rounded-xl shadow-xl ring-1 ring-black/5 z-50`}
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Browse Categories
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {visibleCategories.map((category, index) => (
                <div
                  key={index}
                  onClick={() => {
                    updateVisibleCategories(category);
                    setActiveMenu(null);
                    navigate(
                      `/government-organisations-under-category/${encodeURIComponent(
                        category.Nameid
                      )}`
                    );
                  }}
                  className="flex items-center p-2.5 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300 group cursor-pointer min-w-0"
                >
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 text-lg flex-shrink-0 group-hover:from-purple-200 group-hover:to-blue-200">
                    <span>{category.icon}</span>
                  </div>
                  <div className="ml-3 min-w-0">
                    <span className="block text-sm font-medium text-gray-800 group-hover:text-purple-700 whitespace-nowrap truncate max-w-[180px]">
                      {category.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeMenu === "state" && (
        <div
          className={`fixed left-1/2 top-[112px] -translate-x-1/2 w-[820px] bg-white/95 backdrop-blur-sm rounded-xl shadow-xl ring-1 ring-black/5 z-50`}
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Browse States
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {(visibleStates || []).map((state) => (
                <StateIcon
                  key={state._id}
                  state={state}
                  updateVisibleStates={updateVisibleStates}
                  setStateDropdownVisible={() => setActiveMenu(null)}
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

      {/* Mobile menu */}
      <div
        className={`lg:hidden transition-all duration-500 mt-[60px] ease-in-out ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden bg-white/95 backdrop-blur-sm`}
      >
        {isOpen && (
          <div className="flex justify-center py-4">
            {/* <img src={logo3} alt="Gyapak Logo" className="h-18 w-auto" /> */}
          </div>
        )}
        <div className="px-6 pt-4 pb-6 space-y-2 custom-scrollbar max-h-[80vh] overflow-y-auto">
          {/* Search Bar - Mobile */}
          <div className="mb-4 relative">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  navigate(`/search?query=${encodeURI(searchQuery.trim())}`);
                  setSearchQuery("");
                  setShowDropdown(false);
                  setIsOpen(false);
                }
              }}
              className="relative"
            >
              <input
                type="text"
                className="outline-none text-gray-600 text-sm w-full px-4 py-1.5 rounded-xl shadow-accertinity focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:border-gray-300 focus:bg-gray-100 border-transparent transition-all  duration-200 "
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => inputChangeHandler(e.target.value)}
                onFocus={() => searchQuery && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate(`/search?query=${encodeURI(searchQuery.trim())}`);
                    setSearchQuery("");
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

          <a
            onClick={() => setIsOpen(false)}
            href="/blog"
            className="relative block px-4 py-3 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 transition-all duration-300 shadow-sm"
          >
            <span className="text-purple-700 font-semibold">📚 Blogs</span>
            <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">NEW</span>
          </a>

          <button
            onClick={goDailyUpdates}
            className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300"
          >
            Today's Current Affairs in Hindi
          </button>

          <a
            onClick={() => setIsOpen(false)}
            href="/last-date-to-apply-for-online-offline-government-jobs-applications"
            className="relative block px-4 py-3 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 transition-all duration-300 shadow-sm border border-red-200"
          >
            <span className="text-red-700 font-semibold">⏰ Last Date to Apply</span>
            <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">HOT</span>
          </a>

          {/* Mobile Categories */}
          <div className="relative">
            <button
              onClick={() =>
                setMobileCategoryDropdownVisible(!mobileCategoryDropdownVisible)
              }
              className="flex w-full items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300"
            >
              <span className="text-base font-medium">Categories</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${
                  mobileCategoryDropdownVisible ? "rotate-180" : ""
                }`}
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
                        navigate(
                          `/government-organisations-under-category/${encodeURIComponent(
                            category.Nameid
                          )}`
                        );
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

          {/* Mobile States */}
          <div className="relative">
            <button
              onClick={() =>
                setMobileStateDropdownVisible(!mobileStateDropdownVisible)
              }
              className="flex w-full items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300"
            >
              <span>States</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  mobileStateDropdownVisible ? "rotate-180" : ""
                }`}
              />
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
                        navigate(
                          `/state/government-jobs-in-${state.name}-for-12th-pass`
                        );
                      }}
                      className="flex items-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300 group cursor-pointer"
                    >
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center">
                        <img
                          className="w-full object-cover h-full rounded-lg"
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

          {/* About / Contact - Mobile (homepage only) */}
          {isHomePage && (
            <>
              <button
                onClick={() => {
                  setIsOpen(false);
                  const aboutSection = document.getElementById("about");
                  if (aboutSection)
                    aboutSection.scrollIntoView({ behavior: "smooth" });
                }}
                className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300"
              >
                About
              </button>

              <button
                onClick={() => {
                  navigate("/contact-us");
                }}
                className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300"
              >
                Contact Us
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
