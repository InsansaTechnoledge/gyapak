import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  ExternalLink,
  CalendarDays,
  FileText,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";

const API_BASE = "http://localhost:3000";

const QuickResultsPage = () => {
  const [type, setType] = useState("result"); 
  const [resultData, setResultData] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const fetchResultData = async () => {
      setLoading(true);
      setErrMsg("");
      try {
        const res = await axios.get(
          `${API_BASE}/api/result-admitcard/get-results`,
          { params: { kind: type } }
        );
        setResultData(Array.isArray(res?.data?.data) ? res.data.data : []);
      } catch (e) {
        setErrMsg(e?.response?.data?.message || e.message || "Request failed");
        setResultData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResultData();
  }, [type]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return resultData;
    return resultData.filter((x) => {
      const hay = `${x?.title || ""} ${x?.description || ""} ${x?.link || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [resultData, query]);

  const formatDate = (d) => {
    if (!d) return "—";
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return String(d);
    return dt.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "2-digit" });
  };

  return (
    <div className="min-h-screen ">
      
      <div className="pt-24 pb-10">
        <div className="mx-auto  px-4">
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 w-fit">
              <BadgeCheck className="h-4 w-4" />
              Fast Updates • Official Links
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Latest Examination Results and Admit Card (Hall Ticket) download
 
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Browse latest results and admit cards. Use filters and search to find the exact update quickly.
            </p>

           
            <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-1 w-fit">
                <button
                  onClick={() => setType("result")}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    type === "result"
                      ? "bg-purple-600 text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Results
                </button>
                <button
                  onClick={() => setType("admitcard")}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    type === "admitcard"
                      ? "bg-purple-600 text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Admit Cards
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 px-3 py-2">
                  <Search className="h-5 w-5 text-gray-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by title, description, or link..."
                    className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-800">
                  {filtered.length}
                </span>{" "}
                items
              </div>
            </div>
          </div>
        </div>
      </div>

     
      <div className="mx-auto px-4 pb-16">
        {/* Error */}
        {errMsg && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <div>
              <div className="font-semibold">Couldn’t load updates</div>
              <div className="text-sm">{errMsg}</div>
            </div>
          </div>
        )}

    
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl bg-white ring-1 ring-gray-200 shadow-sm p-5"
              >
                <div className="h-5 w-3/4 bg-gray-100 rounded animate-pulse" />
                <div className="mt-3 h-4 w-full bg-gray-100 rounded animate-pulse" />
                <div className="mt-2 h-4 w-5/6 bg-gray-100 rounded animate-pulse" />
                <div className="mt-5 flex gap-2">
                  <div className="h-8 w-24 bg-gray-100 rounded-xl animate-pulse" />
                  <div className="h-8 w-24 bg-gray-100 rounded-xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

       
        {!loading && !errMsg && filtered.length === 0 && (
          <div className="rounded-3xl bg-white ring-1 ring-gray-200 shadow-sm p-10 text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-purple-100 flex items-center justify-center">
              <FileText className="h-6 w-6 text-purple-700" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-gray-900">
              No {type === "result" ? "results" : "admit cards"} found
            </h3>
            <p className="mt-1 text-gray-600 text-sm">
              Try changing the search keyword or switch tabs.
            </p>
          </div>
        )}

        
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <div
                key={item._id}
                className="rounded-3xl bg-white ring-1 ring-gray-200 shadow-sm p-5 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base md:text-lg font-bold text-gray-900 leading-snug">
                    {item.title}
                  </h2>

                  <span className="shrink-0 rounded-full bg-purple-50 text-purple-700 ring-1 ring-purple-100 px-3 py-1 text-xs font-semibold">
                    {type === "result" ? "RESULT" : "ADMIT"}
                  </span>
                </div>

                {item.description && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                    {item.description}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <div className="inline-flex items-center gap-2 rounded-xl bg-gray-50 ring-1 ring-gray-200 px-3 py-2">
                    <CalendarDays className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-800">Date:</span>
                    <span>{formatDate(item.resultDate)}</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition"
                  >
                    Open Link <ExternalLink className="h-4 w-4" />
                  </a>

                  <button
                    onClick={() => navigator.clipboard.writeText(item.link)}
                    className="rounded-2xl bg-white ring-1 ring-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
                  >
                    Copy Link
                  </button>
                </div>

                <div className="mt-4 text-xs text-gray-400 break-all">
                  {item.link}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickResultsPage;
