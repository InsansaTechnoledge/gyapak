import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdmitCardCard from "./AdmitCardCard";
import { useApi, CheckServer } from "../../Context/ApiContext";

const AdmitCardLanding = () => {
    const { apiBaseUrl, setApiBaseUrl, setServerError } = useApi();
    const [filter, setFilter] = useState("All");
    const navigate = useNavigate();
    const [categories, setCategories] = useState();
    const [filteredCards, setFilterCards] = useState();
    const [admitCards, setAdmitCards] = useState();

    // const categories = ["All", "Civil Services", "Staff Selection", "Banking", "Defense"];    

    useEffect(() => {
        const fetchAdmitCards = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/api/admitCard/`);
                if (response.status === 201) {
                    setAdmitCards(response.data);
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

        const fetchCategories = async () => {
            try {

                const response = await axios.get(`${apiBaseUrl}/api/category/getcategories`);
                if (response.status === 201) {
                    setCategories(response.data.map(cat => cat.category));
                    setCategories(prev => ([
                        "All",
                        ...prev
                    ]))

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
        }//test comment
        fetchAdmitCards();
        fetchCategories();
    }, [apiBaseUrl]);

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

    const viewAllAdmitCards = () => {
        navigate("/admit-card");
    };

    return (
        <div className="bg-gradient-to-br from-purple-50 to-white shadow-md rounded-lg p-6">
            <div className="flex flex-col space-y-4 md:flex-row justify-between items-center mb-6">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold text-purple-900">Latest Admit Cards</h2>
                    <p className="text-purple-600 mt-1">Download your exam admit cards</p>
                </div>
                <div className="flex items-center gap-4">
                    <select
                        className="h-9 rounded-full px-4 pr-8 border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
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

            {filteredCards && filteredCards.length > 0 ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCards.slice(0, 3).map((card, index) => (
                            <AdmitCardCard card={card} key={index} />

                        ))}
                    </div>

                    {filteredCards.length > 3 && (
                        <button
                            onClick={viewAllAdmitCards}
                            className="w-full mt-6 flex items-center justify-center gap-2 text-purple-700 hover:text-purple-900 font-medium transition-colors duration-200"
                        >
                            View All Admit Cards
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    )}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500">No admit cards available for this category.</p>
                </div>
            )}
        </div>
    );
};

export default AdmitCardLanding;
