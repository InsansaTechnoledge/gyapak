import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useApi } from "../../Context/ApiContext";
import { useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from 'react-toastify';


export default function VacanciesPdf() {
  const { apiBaseUrl } = useApi();
  const queryClient = useQueryClient();


  const [categories, setCategories] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const categoriesRef = useRef();

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [orgId, setOrgId] = useState("");
  const [dateFilter, setDateFilter] = useState({}); //dynamic date filter
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const selectedCategory = categories.find((c) => c._id === selectedCategoryId);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${apiBaseUrl}/api/category/getCategories`);

        // backend returns: { categories: [...] }
        setCategories(data.categories || data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, [apiBaseUrl]);

  useEffect(() => {
    if (selectedCategoryId) fetchOrganizations();
  }, [selectedCategoryId]);

  const fetchOrganizations = async () => {
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/organization/${selectedCategoryId}`
      );

      // backend might return array or inside {organizations:[]}
      setOrganizations(data.organizations || data);
    } catch (err) {
      console.log(err);
    }
  };
  
  function buildUrl() {
  let baseUrl = `${apiBaseUrl}/api/v1/magazine/generateVacencies?categoryId=${selectedCategoryId}&organizationId=${orgId}&type=${type}`;
  
  if (dateFilter.type === "custom") {
    baseUrl += `&range=custom&from=${from}&to=${to}`;
  }else{
    baseUrl += `&range=${dateFilter.type}&${dateFilter.type}=${dateFilter.value}`
  }
  // if (filter === "week") {
  //   baseUrl += `&range=week&week=${dateFilter.value}`;
  // }

  // if (filter === "month") {
  //   baseUrl += `&range=month&month=${dateFilter.value}`;
  // }

  // if (filter === "year") {
  //   baseUrl += `&range=year&year=${dateFilter.value}`;
  // }


  return baseUrl;
}


  const getOrFetchPdf = async () => {
    return await queryClient.ensureQueryData({
      queryKey: ["pdf", selectedCategoryId, orgId],
      queryFn: async () => {
        const url = buildUrl();
        const res = await fetch(url, { responseType: "blob" });

        if(!res.ok){
          const result = await res.json();
          console.log(result.message);
          return result;
        }

        return res.blob();
      },
      staleTime: 1000 * 60 * 60,   // 1 hour
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    })
  }


  const handleGenerate = async () => {
    if (!orgId){
      toast.info("Please select an organization with category");
      return;
    }
    if(Object.keys(dateFilter).length===0){
      toast.info("Please select an Date Filter");
      return;
    }
    if(!type){
      toast.info("Please select Type");
      return;
    }


    try {
      setLoading(true);

      const pdfResponse = await getOrFetchPdf();

      if(!pdfResponse.type && !pdfResponse.success){
        // console.log("there is no pdf");
        toast.info(pdfResponse.message);
      }

      if(pdfResponse.type==='application/pdf'){
        // console.log("there is pdf")
        const url = window.URL.createObjectURL(pdfResponse);
        window.open(url, "_blank");
      }
      
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    const handleClick = (e) => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
    }
    window.addEventListener('mousedown', handleClick);

    return () => window.removeEventListener("mousedown", handleClick);
  })


  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* CATEGORY GRID */}
        <div className="col-span-1 md:col-span-2">
          <label className="font-semibold block mb-2 after:content-['*'] after:ml-0.5 after:text-red-500 ">Select Category</label>

          {/* Dropdown Box */}
          <div className="relative" ref={categoriesRef}>
            <div
              tabIndex="0"
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="w-full p-3 border rounded-lg cursor-pointer 
                        flex justify-between items-center shadow-accertinity
                        focus:outline-none focus:ring-1 focus:ring-gray-300 
                        focus:ring-offset-2 focus:border-gray-300
                        focus:bg-gray-100 transition-all duration-200"
            >
              {selectedCategory ? (
                <div className="flex items-center gap-3">
                  <img
                    src={`data:image/png;base64,${selectedCategory.logo}`}
                    alt="category"
                    className="w-8 h-8 rounded-md object-contain bg-white"
                  />
                  <span className="font-medium">{selectedCategory.category}</span>
                </div>
              ) : (
                <span className="text-gray-500">Select Category</span>
              )}

              <span className="text-gray-500">▼</span>
            </div>

            {/* Dropdown Menu */}
            {categoryOpen && (
              <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow 
                      z-50 max-h-64 overflow-y-auto ">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    onClick={() => {
                      setSelectedCategoryId(cat._id);
                      setOrganizations([]);
                      setOrgId("");
                      setCategoryOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 cursor-pointer outline-none"
                  >
                    <img
                      src={`data:image/png;base64,${cat.logo}`}
                      alt={cat.category}
                      className="w-8 h-8 rounded-md object-contain bg-white"
                    />
                    <span>{cat.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ORGANIZATIONS */}
        <div>
          <label className="font-semibold block mb-1 after:content-['*'] after:ml-0.5 after:text-red-500">Organization</label>
          <select
            className="w-full p-3 border rounded-lg shadow-accertinity focus:outline-none focus:ring-1 focus:ring-gray-300 focus:ring-offset-2 focus:border-gray-300 focus:bg-gray-100 transition-all duration-200"
            value={orgId}
            onChange={(e) => setOrgId(e.target.value)}
            disabled={!selectedCategoryId}
          >
            <option value="">Select Organization</option>

            <option value="all">All Organizations</option>

            {organizations.map((org) => (

              <option key={org._id} value={org._id} className="outline-none">
                {org.name}
              </option>
            ))}
          </select>
        </div>

        {/* DATE FILTER */}
        <div>
          <label className="font-semibold block mb-1 after:content-['*'] after:ml-0.5 after:text-red-500">Date Filter</label>
          <select
            className="w-full p-3 border  rounded-xl shadow-accertinity focus:outline-none focus:ring-1 focus:ring-gray-300 focus:ring-offset-2 focus:border-gray-300 focus:bg-gray-100 transition-all duration-200"
            value={JSON.stringify(dateFilter)}
            onChange={(e) =>{
             
                const parsed = JSON.parse(e.target.value);
                setDateFilter(parsed);
              
            }}

          >
            <option value='{}'>Select Date Filter</option>
            <option value='{"type":"year","value":1}'>Last 1 year</option>
            <option value='{"type":"year","value":2}'>Last 2 years</option>
            <option value='{"type":"month","value":3}'>Last 3 months</option>
            <option value='{"type":"week","value":1}'>Last Week</option>
            <option value='{"type":"custom","value":"custom"}'>custom</option>
            
          </select>
        </div>

        {/* TYPE */}
        <div>
          <label className="font-semibold block mb-1 after:content-['*'] after:ml-0.5 after:text-red-500">Type</label>
          <select
            className="w-full p-3 border rounded-lg shadow-accertinity focus:outline-none focus:ring-1 focus:ring-gray-300 focus:ring-offset-2 focus:border-gray-300 focus:bg-gray-100 transition-all duration-200"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="exam">Exam</option>
            <option disabled={true} value="admitcard">Admit Card</option>
            <option disabled={true} value="result">Result</option>
          </select>
        </div>

        {/* CUSTOM DATE */}
        {dateFilter.type === "custom" && (
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold block mb-1">From</label>
              <input
                type="date"
                className="w-full p-3 border  rounded-xl shadow-accertinity focus:outline-none focus:ring-1 focus:ring-gray-300 focus:ring-offset-2 focus:border-gray-300 focus:bg-gray-100 transition-all duration-200 "
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">To</label>
              <input
                type="date"
                className="w-full p-3 border rounded-xl shadow-accertinity focus:outline-none focus:ring-1 focus:ring-gray-300 focus:ring-offset-2 focus:border-gray-300 focus:bg-gray-100 transition-all duration-200"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full mt-8 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
      >
        {loading ? "Generating PDF..." : "Generate PDF"}
      </button>
      <ToastContainer />
    </div>
  );
}
