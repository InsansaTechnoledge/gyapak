import React, { useEffect, useState } from "react";
import { Search, Calendar, Building2, Filter } from "lucide-react";
import axios from "axios";
import API_BASE_URL from "../../Pages/config";
import AdmitCardCard from "../../Components/AdmitCards/AdmitCardCard";
import { Helmet } from "react-helmet-async";

const AdmitCardPage = () => {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [categories, setCategories] = useState();
    const [admitCards, setAdmitCards] = useState();
    const [filteredCards, setFilterCards] = useState();

    // const categories = ["All", "Civil Services", "Staff Selection", "Banking", "Defense"];

    useEffect(() => {
        const fetchAdmitCards = async () => {
            const response = await axios.get(`${API_BASE_URL}/api/admitCard/`);
            if (response.status === 201) {
                setAdmitCards(response.data);
            }
        }

        const fetchCategories = async () => {
            const response = await axios.get(`${API_BASE_URL}/api/category/getcategories`);
            if (response.status === 201) {
                setCategories(response.data.map(cat => cat.category));
                setCategories(prev => ([
                    "All",
                    ...prev
                ]));
            }
        }
        fetchAdmitCards();
        fetchCategories();

    }, []);

    useEffect(() => {
        if (categories && admitCards) {
            setFilterCards(Array.isArray(admitCards)
                ? admitCards.filter((card) => {
                    const matchesFilter = filter === "All" || card.category === filter;
                    return matchesFilter;
                })
                : []);

        }
    }, [categories, admitCards, filter]);


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
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Latest Admit Cards</h2>

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
                    {filteredCards && filteredCards.length > 0 ? (
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