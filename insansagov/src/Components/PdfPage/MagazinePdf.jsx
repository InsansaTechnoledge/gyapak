import React, { useState, useMemo, useEffect } from "react";
import { Calendar } from "lucide-react";
import { useQueryClient } from '@tanstack/react-query'
import {useApi} from "../../Context/ApiContext"
import { ToastContainer, toast } from 'react-toastify';


export default function MagazinePdf() {
  const currentDate = new Date();
  const {apiBaseUrl} = useApi();
  const queryClient = useQueryClient();


  // Loading states
  const [loadingKey, setLoadingKey] = useState(null);
  const [customLoading, setCustomLoading] = useState(false);

  //for select option
  const [customMonth, setCustomMonth] = useState(currentDate.getMonth() + 1);
  const [customYear, setCustomYear] = useState(currentDate.getFullYear());


  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const magazines = useMemo(() => {
    // This useMemo prevents unnecessary recalculations during re-renders. on heavy calculatino functions like filtering and sorting, here i'm doing data manipulation
    const arr = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i);
      arr.push({
        label: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
        monthNumber: d.getMonth() + 1,
        year: d.getFullYear(),
      });
    }
    return arr;
  }, []);

  const variable = useMemo(()=>{
    //calculating the heavy factorial
  },[]);

    // This function will auto-check cache --> return cached OR fetch fresh
  const getOrFetchPdf = async (monthValue, yearValue) => {
    return await queryClient.ensureQueryData({
      queryKey: ["pdf", monthValue, yearValue],

      queryFn: async () => {
        const res = await fetch(
          `${apiBaseUrl}/api/v1/magazine/generateMagazine?month=${monthValue}&year=${yearValue}`
        );

        if (!res.ok) {
          const result = await res.json();
          return result;
        }

        return res.blob();
      },

      staleTime: 1000 * 60 * 60,   // 1 hour
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    });
  };


  const handleCustomDownload = async (monthValue, yearValue, isCustom, label) => {
    try {
      // console.log("clicked for custom downlaod");
      if (isCustom) {
        setCustomLoading(true);
      } else {
        setLoadingKey(label);
      }


    const pdfResponse = await getOrFetchPdf(monthValue, yearValue);

    if(!pdfResponse.type && !pdfResponse.success){
      //no pdf only json res
      toast.info(pdfResponse.message);
    }

    if(pdfResponse.type==='application/pdf'){
      //pdf
      const url = window.URL.createObjectURL(pdfResponse);
      window.open(url, "_blank");
    }

    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setCustomLoading(false);
      setLoadingKey(null);
    }
  };
  


  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div>
        <div className="bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-6 py-4 rounded-xl shadow-sm border mb-4">

          <h2 className="flex items-center gap-2">
            <Calendar className="text-purple-600" size={32} />
            <span className="text-xl font-semibold text-purple-800">
              Monthly Magazines
            </span>
          </h2>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3 w-full md:w-auto">

            <select
              className="border focus:ring-2 outline-none ring-slate-300 ring-offset-1 border-gray-300 rounded-lg px-3 py-2 text-sm w-full md:w-auto"
              value={customMonth}
              onChange={(e) => setCustomMonth(Number(e.target.value))}
            >
              {monthNames.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>

            <select
              className="border focus:ring-2 outline-none ring-slate-300 ring-offset-1 border-gray-300 rounded-lg px-3 py-2 text-sm w-full md:w-auto"
              value={customYear}
              onChange={(e) => setCustomYear(Number(e.target.value))}
            >
              {[2025, 2024, 2023].map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>

            <button
              onClick={() => handleCustomDownload(customMonth, customYear, true, "custom")}
              disabled={customLoading}
              className="px-4 py-2 focus:ring-2 outline-none ring-slate-400 ring-offset-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition disabled:opacity-50 w-full md:w-auto whitespace-nowrap">
              {customLoading ? "Generating..." : "Generate PDF"}
            </button>

          </div>
        </div>



      </div>


      {/* Last 3 months */}
      <div className="space-y-4 mb-8">
        {magazines.map((item) => (
          <div
            key={item.label}
            className="w-full flex-1 md:flex space-y-1 justify-between items-center bg-white p-4 gap-3 rounded-xl shadow-sm border hover:shadow-md transition"
          >
            <span className="text-gray-700  font-medium text-center md:text-left">{item.label}</span>

            <button
              onClick={() =>
                handleCustomDownload(item.monthNumber, item.year, false, item.label)
              }
              disabled={loadingKey === item.label}
              className="px-4 py-2 w-full md:w-32 focus:ring-2 outline-none ring-slate-400 ring-offset-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loadingKey === item.label ? "Generating..." : "Open PDF"}
            </button>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
}