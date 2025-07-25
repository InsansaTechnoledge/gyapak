import React, { useState, useEffect, lazy, Suspense } from "react";
import { Check, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import axios from "axios";
import moment from "moment";
import { RingLoader } from "react-spinners";
import { CheckServer, useApi } from "../../Context/ApiContext";
import { useQuery } from "@tanstack/react-query";
const StateCard = lazy(() => import('./StateCard'));

const StateComponent = () => {
    const { apiBaseUrl, setApiBaseUrl, setServerError } = useApi();
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [activeRegion, setActiveRegion] = useState('North');

    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    const navigate = useNavigate();
    // const [stateCount, setStateCount] = useState();
    // const [lastUpdated, setLastUpdated] = useState();

    useEffect(() => {
        if (suggestions) {
            const total = suggestions?.length;

            setTotalCount(total);
        }
    }, [suggestions]);

    const inputChangeHandler = (val) => {
        setInput(val);
        fetchSuggestions(val);
    }

    // Handle suggestion selection
    const selectSuggestion = (suggestion) => {
        navigate(`/state/government-jobs-in-${suggestion}-for-12th-pass`);
        setInput(suggestion);
        setShowDropdown(false);
    };

    const fetchSuggestions = debounce(async (query) => {
        if (!query) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        try {
            const response = await axios.get(`${apiBaseUrl}/api/search/state`, { params: { q: query.trim() } });
            setSuggestions(response.data.suggestions);
            console.log(response.data.suggestions);
            setShowDropdown(true);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            if (error.response || error.request) {
                if ((error.response && error.response.status >= 500 && error.response.status < 600) || (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND' || error.code === "ERR_NETWORK")) {
                    const url = await CheckServer();
                    setApiBaseUrl(url),
                        setServerError(error.response.status);
                    setTimeout(() => fetchSuggestions(), 1000);
                }
                else {
                    console.error('Error fetching state count:', error);
                }
            }
            else {
                console.error('Error fetching state count:', error);
            }
        }
    }, 300); // 1000ms debounce delay

    // Organized states by region
    const statesByRegion = {
        'North': [
            "Haryana",
            "Himachal Pradesh",
            "Punjab",
            "Uttar Pradesh",
            "Uttarakhand"
        ],
        'South': [
            "Andhra Pradesh",
            "Karnataka",
            "Kerala",
            "Tamil Nadu"
        ],
        'Central': [
            "Madhya Pradesh",
            "Maharashtra"
        ],
        'East': [
            "Bihar",
            "Odisha"
        ],
        'West': [
            "Gujarat",
            "Rajasthan"
        ]
    };

    function formatDate(date) {
        if (!date) return '';

        if (typeof date === 'number') {
            return moment(date).format('MMMM D, YYYY');
        }

        return moment(date, 'YYYY-MM-DD').format('MMMM D, YYYY');
    }

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
                    {items && items.map((item, index) => (
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
    const fetchStateCount = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/api/state/count`);
            // setStateCount(response.data);
            return response.data;
        } catch (error) {
            if (error.response) {
                if (error.response.status >= 500 && error.response.status < 600) {
                    console.error("🚨 Server Error:", error.response.status, error.response.statusText);
                    const url = CheckServer();
                    setApiBaseUrl(url),
                        setServerError(error.response.status);
                    fetchStateCount();
                }
                else {
                    console.error('Error fetching state count:', error);
                }
            }
            else {
                console.error('Error fetching state count:', error);
            }

        }
    };

    const fetchLastUpdated = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/api/event/lastupdated`);
            // setLastUpdated(formatDate(response.data.data));
            return formatDate(response.data.data);
        } catch (error) {
            if (error.response) {
                if (error.response.status >= 500 && error.response.status < 600) {
                    console.error("🚨 Server Error:", error.response.status, error.response.statusText);
                    const url = CheckServer();
                    setApiBaseUrl(url),
                        setServerError(error.response.status);
                    fetchLastUpdated();
                }
                else {
                    console.error('Error fetching state count:', error);
                }
            }
            else {
                console.error('Error fetching state count:', error);
            }
        }
    };
    // useEffect(() => {

    //     fetchStateCount();
    //     fetchLastUpdated();
    // }, []);

    const { data: stateCount, isLoading1 } = useQuery({
        queryKey: ["stateCount"],
        queryFn: fetchStateCount,
        staleTime: Infinity, // ✅ Data never becomes stale, preventing automatic refetch
        cacheTime: 24 * 60 * 60 * 1000, // ✅ Keeps cache alive for 24 hours in memory
        refetchOnMount: true, // ✅ Prevents refetch when component mounts again
        refetchOnWindowFocus: false, // ✅ Prevents refetch when switching tabs
    });
    const { data: lastUpdated, isLoading2 } = useQuery({
        queryKey: ["lastUpdated"],
        queryFn: fetchLastUpdated,
        staleTime: Infinity, // ✅ Data never becomes stale, preventing automatic refetch
        cacheTime: 24 * 60 * 60 * 1000, // ✅ Keeps cache alive for 24 hours in memory
        refetchOnMount: true, // ✅ Prevents refetch when component mounts again
        refetchOnWindowFocus: false, // ✅ Prevents refetch when switching tabs
    });

    if (isLoading1 || isLoading2) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <>
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


            <div className="mt-8 mb-8">


                {/* Hero Header Section */}

                <div className="bg-gradient-to-r from-purple-800 to-indigo-800 rounded-t-2xl p-4 sm:p-8 text-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                                    State government authorities
                                </h1>
                                <p className="text-purple-200 text-xs sm:text-sm">
                                    {`Explore upcoming government exams ${new Date().getFullYear()}`}
                                </p>
                            </div>

                            {/* Mobile Search Toggle */}
                            {/* <div className="xl:hidden flex justify-end">
                                <button
                                    onClick={() => setIsSearchVisible(!isSearchVisible)}
                                    className="p-2 hover:bg-white/10 rounded-full"
                                >
                                    {isSearchVisible ? (
                                        <X className="h-5 w-5 text-white" />
                                    ) : (
                                        <Search className="h-5 w-5 text-white" />
                                    )}
                                </button>
                            </div> */}

                            {/* Desktop Search */}
                            <div className="flex flex-col">
                                <div className="flex items-center bg-white/10 rounded-full p-2 backdrop-blur-sm">
                                    <Search className="h-4 w-4 text-purple-200 ml-2" />
                                    <input
                                        type="text"
                                        onChange={(e) => {
                                            inputChangeHandler(e.target.value);
                                        }}
                                        placeholder="Search your state..."
                                        className="bg-transparent border-none focus:outline-none text-white placeholder-purple-200 text-sm ml-2 w-48"
                                        autoComplete="off"
                                        value={input}
                                    />
                                </div>
                                {/* Suggestions Dropdown */}
                                <div className="relative">
                                    {showDropdown && suggestions && (
                                        <div className="custom-scrollbar max-h-72 w-full overflow-auto absolute mt-1 bg-white border border-gray-200 rounded shadow-lg z-50">


                                            <div className="">
                                                {suggestions.length > 0
                                                    ?
                                                    (
                                                        <SuggestionList
                                                            title="States"
                                                            items={suggestions}
                                                            itemKey="name"
                                                        />
                                                    )
                                                    :
                                                    null}

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
                            </div>
                        </div>

                        {/* Mobile Search Bar */}
                        {/* {isSearchVisible && (
                            <div className="mt-4 xl:hidden">
                                <div className="flex items-center bg-white/10 rounded-full p-2 backdrop-blur-sm">
                                    <Search className="h-4 w-4 text-purple-200 ml-2" />
                                    <input
                                        type="text"
                                        placeholder="Search your state..."
                                        className="bg-transparent border-none focus:outline-none text-white placeholder-purple-200 text-sm ml-2 w-full"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )} */}
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="bg-purple-900 text-white py-3 px-4 sm:px-8 overflow-x-auto">
                    <div className="flex justify-center space-x-6 sm:space-x-12 text-xs sm:text-sm whitespace-nowrap">
                        <div className="text-center">
                            <div className="font-bold">
                                {stateCount?.states}
                            </div>
                            <div className="text-purple-200 text-xs">States</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold">
                                {stateCount?.exams}
                            </div>
                            <div className="text-purple-200 text-xs">Active Exams</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold">1M+</div>
                            <div className="text-purple-200 text-xs">Candidates</div>
                        </div>
                    </div>
                </div>

                {/* States Content */}
                <div className="bg-gradient-to-b from-purple-50 to-white rounded-b-2xl p-4 sm:p-8">

                    <div className="mb-6">
                        <div className="flex flex-wrap gap-4 whitespace-nowrap p-1">
                            {Object.keys(statesByRegion).map((region) => (
                                <button
                                    key={region}
                                    onClick={() => setActiveRegion(region)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeRegion === region
                                        ? 'bg-purple-800 text-white'
                                        : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                                        }`}
                                >
                                    {region}
                                </button>
                            ))}
                        </div>
                    </div>


                    {/* States Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        <Suspense fallback={<div><div className='w-full h-screen flex justify-center'>
                            <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />
                        </div></div>}>
                            {activeRegion
                                ? statesByRegion[activeRegion].map((state, index) => (
                                    <StateCard key={index} state={state} />
                                ))
                                : Object.values(statesByRegion).flat().map((state, index) => (
                                    <StateCard key={index} state={state} />
                                ))}
                        </Suspense>
                    </div>

                    {/* Bottom Stats */}
                    <div className="mt-6 sm:mt-8 text-center">
                        <p className="text-xs sm:text-sm text-purple-600">
                            Last updated: {lastUpdated}
                        </p>
                    </div>
                </div>
            </div>
        </>

    );
};



export default StateComponent;