import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Calendar,
    Building2,
    Filter,
    Search,
    RefreshCcw,
    ChevronRight,
    Clock,
    FileText,
    Bell,
} from "lucide-react";
import BackButton from "../../Components/BackButton/BackButton";
import API_BASE_URL from "../config";
import { Helmet } from "react-helmet-async";

const OverviewPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrg, setSelectedOrg] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [notifications, setNotifications] = useState({});
    const [allUpdates, setAllUpdates] = useState([]);
    const [filteredUpdates, setFilteredUpdates] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch all different types of data
            const [typeAResponse, typeBResponse, typeCResponse] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/admitCard`),
                axios.get(`${API_BASE_URL}/api/result`),
                axios.get(`${API_BASE_URL}/api/examDates`)
            ]);

            // Format type A data (admit cards)
            const formattedTypeA = typeAResponse.data.map(item => ({
                ...item,
                category: 'documents',
                title: item.name,
                organization: item.abbreviation || item.organization,
                date: item.date_of_notification,
                status: 'Available',
                documentType: 'Card'
            }));

            // Format type B data (results)
            const formattedTypeB = typeBResponse.data.map(item => ({
                ...item,
                category: 'updates',
                title: item.name,
                organization: item.abbreviation || item.organization,
                date: item.date_of_notification,
                status: 'Published',
                documentType: 'Update'
            }));

            // Format type C data (exam dates)
            const formattedTypeC = typeCResponse.data.map(item => ({
                ...item,
                category: 'schedule',
                title: item.name || item.examName,
                organization: item.abbreviation || item.organization,
                date: item.examDate,
                status: 'Upcoming',
                documentType: 'Event'
            }));

            // Combine all updates
            const combined = [...formattedTypeA, ...formattedTypeB, ...formattedTypeC];

            // Sort by date (newest first)
            combined.sort((a, b) => new Date(b.date) - new Date(a.date));

            setAllUpdates(combined);

            // Extract unique organizations
            const uniqueOrgs = [...new Set(combined.map(item => item.organization))]
                .filter(Boolean)
                .sort();

            setOrganizations(uniqueOrgs);
            setIsLoading(false);
        } catch (error) {
            console.error("Failed to fetch data:", error.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filterUpdates = () => {
            const filtered = allUpdates.filter(item => {
                const matchesOrg = selectedOrg === "all" ||
                    item.organization?.toLowerCase() === selectedOrg.toLowerCase();

                const matchesCategory = selectedCategory === "all" ||
                    item.category === selectedCategory;

                const matchesSearch = !searchQuery ||
                    item.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.title?.toLowerCase().includes(searchQuery.toLowerCase());

                return matchesOrg && matchesCategory && matchesSearch;
            });

            setFilteredUpdates(filtered);
        };

        filterUpdates();
    }, [searchQuery, selectedOrg, selectedCategory, allUpdates]);

    const toggleNotification = (id) => {
        setNotifications(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleRefresh = () => {
        fetchData();
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'documents': return FileText;
            case 'updates': return Clock;
            case 'schedule': return Calendar;
            default: return Building2;
        }
    };

    const getColorScheme = (category) => {
        switch (category) {
            case 'documents': return blueColorScheme;
            case 'updates': return greenColorScheme;
            case 'schedule': return orangeColorScheme;
            default: return purpleColorScheme;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const UpdateCard = ({ item }) => {
        const colorScheme = getColorScheme(item.category);
        const IconComponent = getCategoryIcon(item.category);

        return (
            <div className="bg-white shadow-md rounded-lg overflow-hidden transition-all hover:shadow-lg">
                <div className={`h-2 ${colorScheme.headerBg}`} />
                <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2.5 rounded-xl ${colorScheme.iconBg} ring-1 ring-inset ${colorScheme.iconRing}`}>
                                    <IconComponent className={`h-5 w-5 ${colorScheme.icon}`} />
                                </div>
                                <div>
                                    <h4 className={`text-lg font-semibold ${colorScheme.title} line-clamp-1`}>
                                        {item.organization}
                                    </h4>
                                    <span className={`text-xs font-medium ${colorScheme.typeBadge} px-2.5 py-0.5 rounded-full`}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-gray-900 font-medium text-lg line-clamp-2">
                            {item.title}
                        </p>

                        <div className={`inline-flex items-center gap-2 text-sm ${colorScheme.dateText} bg-gray-50 px-3 py-1.5 rounded-lg`}>
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(item.date)}</span>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            className={`flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition-all duration-200 
                ${colorScheme.button} hover:shadow-lg active:scale-98 flex items-center justify-center gap-2`}
                            onClick={() => window.open(item.apply_link || "#", "_blank")}
                        >
                            <span>View Details</span>
                            <ChevronRight className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => toggleNotification(item._id)}
                            className={`p-2.5 rounded-lg transition-all duration-200 
                ${notifications[item._id]
                                    ? `${colorScheme.notificationActive} ring-1 ring-inset ${colorScheme.iconRing}`
                                    : "bg-gray-50 hover:bg-gray-100"
                                }`}
                        >
                            <Bell className={`h-5 w-5 ${notifications[item._id] ? colorScheme.icon : "text-gray-500"}`} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const categories = [
        { id: "all", label: "All Updates", icon: Filter },
        { id: "documents", label: "Documents", icon: FileText },
        { id: "updates", label: "Updates", icon: Clock },
        { id: "schedule", label: "Schedule", icon: Calendar },
    ];

    return (
        <>
            <Helmet>
                <title>Overview | gyapak</title>
                <meta name="description" content="Comprehensive overview of all government exam updates, documents, notifications and schedules." />
                <meta name="keywords" content="government exams, updates, notifications, documents, schedules, government jobs" />
                <meta property="og:title" content="Overview | gyapak" />
                <meta property="og:description" content="Find all the latest updates on government exams, documents, and schedules for central and state government jobs." />
            </Helmet>
            <div className="min-h-screen bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32 space-y-6">
                    <BackButton />
                    <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="bg-indigo-100 p-2 rounded-lg">
                                        <Building2 className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                        All Updates
                                    </h1>
                                </div>
                                <p className="text-gray-600 text-sm sm:text-base">
                                    Your complete overview of all notifications, documents and schedules
                                </p>
                            </div>
                            <button
                                onClick={handleRefresh}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-all duration-200 font-medium"
                            >
                                <RefreshCcw className="h-4 w-4" />
                                Refresh
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by organization or title..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white placeholder-gray-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <select
                                className="w-full md:w-[220px] px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white cursor-pointer"
                                value={selectedOrg}
                                onChange={(e) => setSelectedOrg(e.target.value)}
                            >
                                <option value="all">All Organizations</option>
                                {organizations.map((org) => (
                                    <option key={org} value={org}>
                                        {org}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
                        <div className="flex flex-wrap gap-2 mb-8 border-b">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-all duration-200 relative
                  ${selectedCategory === category.id
                                            ? "text-indigo-800 border-b-2 border-indigo-600"
                                            : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    <category.icon className="h-4 w-4" />
                                    {category.label}
                                </button>
                            ))}
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center p-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                            </div>
                        ) : filteredUpdates.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredUpdates.map((item, index) => (
                                    <UpdateCard
                                        key={item._id || `update-${index}`}
                                        item={item}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="mx-auto h-16 w-16 bg-gray-100 flex items-center justify-center rounded-full mb-4">
                                    <Search className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">No updates found</h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Try adjusting your search or filter criteria
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

const purpleColorScheme = {
    headerBg: "bg-gradient-to-r from-indigo-500 to-purple-600",
    icon: "text-indigo-600",
    iconBg: "bg-indigo-50",
    iconRing: "ring-indigo-100",
    title: "text-indigo-900",
    typeBadge: "bg-indigo-50 text-indigo-700",
    dateText: "text-indigo-700",
    button: "bg-indigo-600 hover:bg-indigo-700",
    notificationActive: "bg-indigo-50",
};

const greenColorScheme = {
    headerBg: "bg-gradient-to-r from-emerald-500 to-green-600",
    icon: "text-emerald-600",
    iconBg: "bg-emerald-50",
    iconRing: "ring-emerald-100",
    title: "text-emerald-900",
    typeBadge: "bg-emerald-50 text-emerald-700",
    dateText: "text-emerald-700",
    button: "bg-emerald-600 hover:bg-emerald-700",
    notificationActive: "bg-emerald-50",
};

const blueColorScheme = {
    headerBg: "bg-gradient-to-r from-sky-500 to-blue-600",
    icon: "text-sky-600",
    iconBg: "bg-sky-50",
    iconRing: "ring-sky-100",
    title: "text-sky-900",
    typeBadge: "bg-sky-50 text-sky-700",
    dateText: "text-sky-700",
    button: "bg-sky-600 hover:bg-sky-700",
    notificationActive: "bg-sky-50",
};

const orangeColorScheme = {
    headerBg: "bg-gradient-to-r from-amber-500 to-orange-600",
    icon: "text-amber-600",
    iconBg: "bg-amber-50",
    iconRing: "ring-amber-100",
    title: "text-amber-900",
    typeBadge: "bg-amber-50 text-amber-700",
    dateText: "text-amber-700",
    button: "bg-amber-600 hover:bg-amber-700",
    notificationActive: "bg-amber-50",
};

export default OverviewPage;