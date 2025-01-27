import React, { useEffect, useState } from "react";
import { Calendar, Building2, Filter, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../Pages/config";

const ResultsDashboard = () => {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const navigate = useNavigate();
    const [filteredResults, setFilteredResults] = useState();
    const [categories, setCategories] = useState();
    const [results, setResults] = useState();

    // const categories = ["All", "Civil Services", "Staff Selection", "Banking", "Defense"];

    // const filteredResults = Array.isArray(results)
    //     ? results.filter((result) => {
    //         const matchesSearch =
    //             result.examName.toLowerCase().includes(search.toLowerCase()) ||
    //             result.organization.toLowerCase().includes(search.toLowerCase());
    //         const matchesFilter = filter === "all" || result.category.toLowerCase() === filter;
    //         return matchesSearch && matchesFilter;
    //     })
    //     : [];

    useEffect(()=>{
        const fetchResults = async () => {
            const response = await axios.get(`${API_BASE_URL}/api/result/`);
            if(response.status===201){
                setResults(response.data);
            }
        }

        const fetchCategories = async () => {
            const response = await axios.get(`${API_BASE_URL}/api/category/getcategories`);
            if(response.status===201){
                setCategories(response.data.map(cat => cat.category));
                setCategories(prev => ([
                    "All",
                    ...prev
                ]))
                
            }
        }
        fetchResults();
        fetchCategories();
    },[]);

    useEffect(()=>{
            if(categories && results){
                setFilteredResults(Array.isArray(results)
                ? results.filter((card) => {
                    const matchesFilter = filter === "All" || card.category === filter;
                    return matchesFilter;
                })
                : []);
            
            }
        },[categories, results, filter]);

    const viewAllResults = () => {
        navigate("/results");
    };

    return (
        <div className="bg-gradient-to-br from-purple-100 to-white shadow-md rounded-lg p-6 mt-10 mb-10">
            <div className="flex flex-col xl:flex-row space-y-4 justify-between items-center mb-6">
                <div className="flex flex-col">
                    <h2 className="text-center xl:text-left text-2xl font-bold text-purple-800">Latest Results</h2>
                    <p className="text-center text-purple-700 mt-1">Check out the latest examination results</p>
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <select
                        className="pl-10 h-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white text-sm"
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

                        {/* {console.log("FIL",filteredResults)} */}
            {filteredResults && filteredResults.length > 0 ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredResults.slice(0, 3).map((result) => (
                            <div
                                key={result._id}
                                className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 border border-purple-200 flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-purple-800">
                                        <Building2 className="h-5 w-5" />
                                        {result.abbreviation}
                                    </h3>
                                    <p className="font-medium text-gray-800 mb-2">{result.name}</p>
                                    <div className="text-sm text-gray-600">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Calendar className="h-4 w-4" />
                                            Published: {new Date(result.date_of_notification).toLocaleDateString()}
                                        </div>
                                        <span
                                            className={`inline-block mt-2 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800`}
                                        >
                                            ACTIVE
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <a
                                        href={result.apply_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block mt-4 px-4 py-2 bg-purple-700 text-white text-center rounded-md hover:bg-purple-800 transition-colors"
                                    >
                                        View Result
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                    {filteredResults && filteredResults.length > 3 && (
                        <button
                            onClick={viewAllResults}
                            className="w-full mt-6 flex items-center justify-center gap-2 text-purple-700 hover:text-purple-800 font-medium transition-colors duration-200"
                        >
                            View All Results
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    )}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500">No results found.</p>
                </div>
            )}
        </div>
    );
};

export default ResultsDashboard;
