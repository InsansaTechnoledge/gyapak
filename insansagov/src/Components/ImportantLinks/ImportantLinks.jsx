import React, { useEffect, useState } from "react";
import { Calendar, Building2, ArrowRight, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../Pages/config";

const ImportantLinksDashboard = () => {
    const [filter, setFilter] = useState("All");
    const navigate = useNavigate();
    const [categories, setCategories] = useState();
    const [filteredLinks, setFilteredLinks] = useState();
    const [importantLinks, setImportantLinks] = useState();

    useEffect(() => {
        const fetchImportantLinks = async () => {
            const response = await axios.get(`${API_BASE_URL}/api/importantLinks/`);
            if (response.status === 201) {
                setImportantLinks(response.data);
            }
        };

        const fetchCategories = async () => {
            const response = await axios.get(`${API_BASE_URL}/api/category/getcategories`);
            if (response.status === 201) {
                setCategories(response.data.map(cat => cat.category));
                setCategories(prev => ([
                    "All",
                    ...prev
                ]));
            }
        };

        fetchImportantLinks();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (categories && importantLinks) {
            setFilteredLinks(Array.isArray(importantLinks)
                ? importantLinks.filter((link) => {
                    const matchesFilter = filter === "All" || link.category === filter;
                    return matchesFilter;
                })
                : []);
        }
    }, [categories, importantLinks, filter]);

    const viewAllLinks = () => {
        navigate("/important-links");
    };

    return (
        <div className="bg-gradient-to-br from-purple-50 to-white shadow-md rounded-lg p-6 mt-10 mb-10">
            <div className="flex flex-col space-y-4 md:flex-row justify-between items-center mb-6">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold text-purple-900">Exam's Important Links</h2>
                    <p className="text-purple-600 mt-1">Find all examination resources in one place</p>
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

            {filteredLinks && filteredLinks.length > 0 ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredLinks.slice(0, 3).map((link) => (
                            <div
                                key={link._id}
                                className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 border border-purple-200 flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-purple-800">
                                        <Building2 className="h-5 w-5" />
                                        {link.abbreviation}
                                    </h3>
                                    <p className="font-medium text-gray-800 mb-2">{link.examName}</p>
                                    <div className="text-sm text-gray-600">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Calendar className="h-4 w-4" />
                                            Updated: {new Date(link.lastUpdated).toLocaleDateString()}
                                        </div>
                                        <span
                                            className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${link.status === "Active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                                }`}
                                        >
                                            {link.status || "ACTIVE"}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-4 space-y-2">
                                    {link.links && link.links.map((resource, idx) => (
                                        <a
                                            key={idx}
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between px-3 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors"
                                        >
                                            <span>{resource.title}</span>
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredLinks.length > 3 && (
                        <button
                            onClick={viewAllLinks}
                            className="w-full mt-6 flex items-center justify-center gap-2 text-purple-700 hover:text-purple-900 font-medium transition-colors duration-200"
                        >
                            View All Important Links
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    )}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500">No important links available for this category.</p>
                </div>
            )}
        </div>
    );
};

export default ImportantLinksDashboard;