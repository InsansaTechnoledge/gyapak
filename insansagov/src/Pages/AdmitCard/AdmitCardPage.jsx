import React, { useEffect, useState } from "react";
import { Search, Calendar, Building2, Filter, RefreshCw } from "lucide-react";
import AdmitCardCard from "../../Components/AdmitCards/AdmitCardCard";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useApi, CheckServer } from "../../Context/ApiContext";

const AdmitCardPage = () => {
    const { apiBaseUrl, setApiBaseUrl } = useApi();
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [categories, setCategories] = useState();
    const [admitCards, setAdmitCards] = useState();
    const [filteredCards, setFilterCards] = useState();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const ADMIT_CARDS_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes for admit cards
    const CATEGORIES_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours for categories
    const ADMIT_CARDS_CACHE_KEY = "admit_cards_cache";
    const CATEGORIES_CACHE_KEY = "categories_cache";

    const getFromCache = (key, duration) => {
        const cachedData = localStorage.getItem(key);
        if (!cachedData) return null;

        const { data, timestamp } = JSON.parse(cachedData);
        const isExpired = Date.now() - timestamp > duration;

        if (isExpired) {
            localStorage.removeItem(key);
            return null;
        }

        return data;
    };

    const saveToCache = (key, data) => {
        const cacheData = {
            data,
            timestamp: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(cacheData));
    };

    const fetchAdmitCards = async (forceRefresh = false) => {
        const cachedAdmitCards = forceRefresh ? null : getFromCache(ADMIT_CARDS_CACHE_KEY, ADMIT_CARDS_CACHE_DURATION);
        if (cachedAdmitCards) {
            console.log("Using cached admit cards");
            setAdmitCards(cachedAdmitCards);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`${apiBaseUrl}/api/admitCard/`);
            const data = await response.json();
            if (response.ok) {
                setAdmitCards(data);
                // Save to cache
                saveToCache(ADMIT_CARDS_CACHE_KEY, data);
            } else {
                console.error("Failed to fetch admit cards:", data);
            }
        } catch (error) {
            console.error("Error fetching admit cards:", error);
            if (error.response || error.request) {
                if ((error.response && error.response.status >= 500 && error.response.status < 600) || (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND' || error.code === "ERR_NETWORK")) {
                    const url = await CheckServer();
                    setApiBaseUrl(url);
                }
                else {
                    console.error('Error fetching state count:', error);
                }
            }
            else {
                console.error('Error fetching state count:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async (forceRefresh = false) => {
        const cachedCategories = forceRefresh ? null : getFromCache(CATEGORIES_CACHE_KEY, CATEGORIES_CACHE_DURATION);
        if (cachedCategories) {
            console.log("Using cached categories");
            setCategories(cachedCategories);
            return;
        }

        try {
            const response = await axios.get(`${apiBaseUrl}/api/category/getcategories`);
            const data = await response.json();
            if (response.ok) {
                const formattedCategories = ["All", ...data.map(cat => cat.category)];
                setCategories(formattedCategories);
                // Save to cache with the longer duration
                saveToCache(CATEGORIES_CACHE_KEY, formattedCategories);
            } else {
                console.error("Failed to fetch categories:", data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            if (error.response || error.request) {
                if ((error.response && error.response.status >= 500 && error.response.status < 600) || (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND' || error.code === "ERR_NETWORK")) {
                    const url = await CheckServer();
                    setApiBaseUrl(url);
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

    // Handle manual refresh
    const handleRefresh = async () => {
        setRefreshing(true);
        await Promise.all([
            fetchAdmitCards(true),  // Force refresh admit cards
            fetchCategories(false)  // Don't force refresh categories unless needed
        ]);
        setRefreshing(false);
    };

    useEffect(() => {
        fetchAdmitCards();
        fetchCategories();
    }, [apiBaseUrl]);

    useEffect(() => {
        if (categories && admitCards) {
            setFilterCards(Array.isArray(admitCards)
                ? admitCards.filter((card) => {
                    const matchesFilter = filter === "All" || card.category === filter;
                    const matchesSearch = search.trim() === "" ||
                        card.title.toLowerCase().includes(search.toLowerCase()) ||
                        card.organization.toLowerCase().includes(search.toLowerCase());
                    return matchesFilter && matchesSearch;
                })
                : []);
        }
    }, [categories, admitCards, filter, search]);

    return (
        <>
            <Helmet>
                <title>gyapak</title>
                <meta name="description" content="gyapak.in is a trusted source for the latest government exam updates, including exam dates, notifications, admit cards, and results for both central and state government departments. Stay updated with real-time information on competitive exams, application deadlines, and result announcements!" />
                <meta name="keywords" content="government exams, exam dates, admit cards, results, central government jobs, state government jobs, competitive exams, government jobs" />
                <meta property="og:title" content="gyapak" />
                <meta property="og:description" content="Find the latest updates on government exams, admit cards, results, and application deadlines for central and state government jobs." />
            </Helmet>
            <div className="bg-white pt-28 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Latest Admit Cards</h2>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition"
                        disabled={refreshing}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* Search and Filter Section */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search exams or organizations"
                            className="pl-10 w-full h-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <select
                            className="pl-10 h-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            {categories && categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Cards Grid */}
                <div>
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : filteredCards && filteredCards.length > 0 ? (
                        <div className="flex flex-col">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCards.map((card, index) => (
                                    <AdmitCardCard card={card} key={index} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">No admit cards found.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdmitCardPage;