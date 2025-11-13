import React, { useState, useMemo } from "react";
import { Calendar } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import { useApi } from "../../Context/ApiContext";



export default function MagazineComponent() {
  const currentDate = new Date();
  const { apiBaseUrl, setApiBaseUrl, setServerError } = useApi();

  // Loading states
  const [loadingKey, setLoadingKey] = useState(null);
  const [customLoading, setCustomLoading] = useState(false);

  const [customMonth, setCustomMonth] = useState(currentDate.getMonth() + 4);
  const [customYear, setCustomYear] = useState(currentDate.getFullYear());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const magazines = useMemo(() => {
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

  // ---- NO REACT QUERY ----
  const fetchMagazinePdf = async (month, year) => {
    const res = await fetch(
      `${apiBaseUrl}/api/v1/magazine/generate?month=${month}&year=${year}`
    );

    if (!res.ok) throw new Error("Magazine not found"); //try catch will catch it

    return res.blob();
  };

  const handleDownload = async (month, year, isCustom = false, key = "") => {
    try {
      if (isCustom) setCustomLoading(true);
      else setLoadingKey(key);

      const blob = await fetchMagazinePdf(month, year);

      const url = URL.createObjectURL(blob);
      window.open(url);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingKey(null);
      setCustomLoading(false);
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
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full md:w-auto"
              value={customMonth}
              onChange={(e) => setCustomMonth(Number(e.target.value))}
            >
              {monthNames.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>

            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full md:w-auto"
              value={customYear}
              onChange={(e) => setCustomYear(Number(e.target.value))}
            >
              {[2025, 2024, 2023].map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>

            <button
              onClick={() => handleDownload(customMonth, customYear, true)}
              disabled={customLoading}
              className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition disabled:opacity-50 w-full md:w-auto whitespace-nowrap">
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
            className="flex justify-between items-center bg-white p-4  gap-4 rounded-xl shadow-sm border hover:shadow-md transition"
          >
            <span className="text-gray-700 font-medium">{item.label}</span>

            <button
              onClick={() =>
                handleDownload(item.monthNumber, item.year, false, item.label)
              }
              disabled={loadingKey === item.label}
              className="px-4 py-2 w-3/4 md:w-32 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
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
