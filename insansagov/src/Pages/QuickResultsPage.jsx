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
import ResultsDashboard from "../Components/ResultComponent/Results";

const API_BASE = "https://adminpanel.gyapak.in";

const QuickResultsPage = () => {

  const getTypeFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.has("result") ? "result" : "admitcard";
  };

  const [type, setType] = useState(getTypeFromUrl);
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
            <div className="inline-flex items-center gap-2 rounded-full light-site-color px-3 py-1 text-sm font-medium main-site-text-color w-fit">
              <BadgeCheck className="h-4 w-4" />
              Fast Updates • Official Links
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight utility-site-color">
            Latest Examination Results and Admit Card (Hall Ticket) download
 
            </h1>
            <p className="utility-secondary-color max-w-2xl">
              Browse latest results and admit cards. Use filters and search to find the exact update quickly.
            </p>

           
            <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl shadow-sm ring-1 ring-gray-200 p-1 w-fit">
                <button
                  onClick={() => setType("result")}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    type === "result"
                      ? "main-site-color-2 secondary-site-text-color"
                      : "utility-secondary-color hover:light-site-color-3"
                  }`}
                >
                  Results
                </button>
                <button
                  onClick={() => setType("admitcard")}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    type === "admitcard"
                      ? "main-site-color-2 secondary-site-text-color"
                      : "utility-secondary-color hover:light-site-color-3"
                  }`}
                >
                  Admit Cards
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 rounded-2xl shadow-sm ring-1 ring-gray-200 px-3 py-2">
                  <Search className="h-5 w-5 utility-secondary-color-2" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by title, description, or link..."
                    className="w-full bg-transparent outline-none text-sm utility-secondary-color placeholder:utility-secondary-color-2"
                  />
                </div>
              </div>

              <div className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold utility-secondary-color">
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
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 main-site-text-error-color flex items-start gap-2">
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
                className="rounded-3xl  ring-1 ring-gray-200 shadow-sm p-5"
              >
                <div className="h-5 w-3/4 light-site-color rounded animate-pulse" />
                <div className="mt-3 h-4 w-full light-site-color rounded animate-pulse" />
                <div className="mt-2 h-4 w-5/6 light-site-color rounded animate-pulse" />
                <div className="mt-5 flex gap-2">
                  <div className="h-8 w-24 light-site-color rounded-xl animate-pulse" />
                  <div className="h-8 w-24 light-site-color rounded-xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

       
        {!loading && !errMsg && filtered.length === 0 && (
          <div className="rounded-3xl ring-1 ring-gray-200 shadow-sm p-10 text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl light-site-color flex items-center justify-center">
              <FileText className="h-6 w-6 main-site-text-color" />
            </div>
            <h3 className="mt-4 text-lg font-bold utility-site-color">
              No {type === "result" ? "results" : "admit cards"} found
            </h3>
            <p className="mt-1 utility-secondary-color text-sm">
              Try changing the search keyword or switch tabs.
            </p>
          </div>
        )}

        
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <div
                key={item._id}
                className="rounded-3xl ring-1 ring-gray-200 shadow-sm p-5 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base md:text-lg font-bold utility-site-color leading-snug">
                    {item.title}
                  </h2>

                  <span className="shrink-0 rounded-full light-site-color-3 main-site-text-color ring-1 ring-purple-100 px-3 py-1 text-xs font-semibold">
                    {type === "result" ? "RESULT" : "ADMIT"}
                  </span>
                </div>

                {item.description && (
                  <p className="mt-2 text-sm utility-secondary-color line-clamp-3">
                    {item.description}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm utility-secondary-color">
                  <div className="inline-flex items-center gap-2 rounded-xl light-site-color-3 ring-1 ring-gray-200 px-3 py-2">
                    <CalendarDays className="h-4 w-4 utility-secondary-color" />
                    <span className="font-medium utility-secondary-color">Date:</span>
                    <span>{formatDate(item.resultDate)}</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl main-site-color-2 px-4 py-2 text-sm font-semibold secondary-site-text-color hover:main-site-text-color transition"
                  >
                    Open Link <ExternalLink className="h-4 w-4" />
                  </a>

                  <button
                    onClick={() => navigator.clipboard.writeText(item.link)}
                    className="rounded-2xl bg-white ring-1 ring-gray-200 px-4 py-2 text-sm font-semibold utility-secondary-color hover:light-site-color-3 transition"
                  >
                    Copy Link
                  </button>
                </div>

                <div className="mt-4 text-xs utility-secondary-color-2 break-all">
                  {item.link}
                </div>
              </div>
            ))}
          </div>
        )}

        {
          type === 'result' && (
            <div className="mt-10">
              <ResultsDashboard/>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default QuickResultsPage;
