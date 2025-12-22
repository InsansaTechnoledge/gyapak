import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Search, Calendar, Bell } from "lucide-react";
import { useApi, CheckServer } from "../../Context/ApiContext";
import { debounce } from "../../Utils/debounce";
import { Link, useNavigate } from "react-router-dom";
import { useEventRouting } from "../../Utils/useEventRouting";
import GovCalendar from "./components/GovCalendar";

export default function GyapakLanding() {
  const { apiBaseUrl, setApiBaseUrl, setServerError } = useApi();

  const [stateCount, setStateCount] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searched, setSearched] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  const { handleEventClick, prefetchEventRoute } = useEventRouting({ fallback: "old" });



  const debouncedUpdateRef = useRef(null);

  // Setup debounce for search input
  useEffect(() => {
    debouncedUpdateRef.current = debounce((value) => {
      setSearched(value);
    }, 600);

    return () => {
      debouncedUpdateRef.current?.cancel?.();
    };
  }, []);

  // Fetch state/exam counts
  useEffect(() => {
    const fetchStateCount = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/state/count`);
        setStateCount(response.data);
      } catch (error) {
        if (error.response) {
          if (error.response.status >= 500 && error.response.status < 600) {
            console.error(
              "🚨 Server Error:",
              error.response.status,
              error.response.statusText
            );
            const url = await CheckServer();
            if (url) setApiBaseUrl?.(url);
            setServerError?.(error.response.status);
          } else {
            console.error("Error fetching state count:", error);
          }
        } else {
          console.error("Error fetching state count:", error);
        }
      }
    };

    if (apiBaseUrl) {
      fetchStateCount();
    }
  }, [apiBaseUrl, setApiBaseUrl, setServerError]);

  // Fetch search results whenever debounced `searched` changes
  useEffect(() => {
    if (!searched.trim()) {
      setSearchResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/api/event/search`, {
          params: { q: searched.trim() },
        });

        // Adjust depending on your backend response shape
        setSearchResults(res.data.data || res.data || []);
      } catch (error) {
        console.error("Error fetching search results:", error);

        if (error.response) {
          if (error.response.status >= 500 && error.response.status < 600) {
            console.error(
              "🚨 Server Error (search):",
              error.response.status,
              error.response.statusText
            );
            const url = await CheckServer();
            if (url) setApiBaseUrl?.(url);
            setServerError?.(error.response.status);
          }
        }
      }
    };

    if (apiBaseUrl) {
      fetchSearchResults();
    }
  }, [searched, apiBaseUrl, setApiBaseUrl, setServerError]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedUpdateRef.current?.(value);
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const statesCovered = stateCount?.states ?? 0;
  const examsTracked = stateCount?.exams ?? 0;

  const TITLE_VARIANTS = [
    "gyapak",          // English 
    "ज्ञापक",          // Hindi / Marathi / Sanskrit
    "জ্যাপক",          // Bangla / Assamese style
    "గ్యాపక్",         // Telugu
    "ஜ்ஞாபக",        // Tamil 
    "ಜ್ಞಾಪಕ",         // Kannada
    "ഗ്യാപക്",        // Malayalam
    "જ્ઞાપક",         // Gujarati
    "ଜ୍ଞାପକ",         // Odia
    "ਗਿਆਪਕ",         // Punjabi 
  ];
  
  
  const [titleIndex, setTitleIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
  
      setTimeout(() => {
        setTitleIndex((prev) => (prev + 1) % TITLE_VARIANTS.length);
        setIsFading(false);
      }, 250); 
    }, 2500); 
  
    return () => clearInterval(interval);
  }, []);
  

  return (
    <div className="min-h-screen mt-32 text-slate-900">
      <header className="border-b border-purple-100 ">
        <div className=" mx-auto px-4 sm:px-16 py-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-purple-600">
                Gyapak 
              </p>
              <p className="text-xs text-slate-500">{today}</p>
            </div>
  
            <div className="flex flex-col items-end gap-1">
             
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                <span className="px-2 py-0.5 rounded-full bg-purple-50 border border-purple-100">
                  {statesCovered} States
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-50 border border-purple-100">
                  {examsTracked} Exams
                </span>
              </div>
            </div>
          </div>
  
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h1 className="text-5xl sm:text-6xl lg:text-[6vw] font-black tracking-tight font-serif">
                <span
                  className={[
                    "bg-clip-text py-10 text-transparent bg-purple-700",
                    "transition-opacity duration-300",
                    isFading ? "opacity-0" : "opacity-100",
                  ].join(" ")}
                >
                  {TITLE_VARIANTS[titleIndex]}
                </span>
              </h1>
            </div>
  
            <div className="flex flex-col items-center sm:items-end gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-purple-100 shadow-sm">
                <span className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
                  Edition
                </span>
                <span className="text-xs font-semibold text-purple-600">
                  All India • Digital
                </span>
              </div>
              <div className="text-[11px] text-slate-500 uppercase tracking-[0.3em] font-medium">
                Price: <span className="text-purple-600">Free</span> • Updated Daily
              </div>
            </div>
          </div>
        </div>
      </header>
  
      <main className=" mx-auto px-4 sm:px-6 py-10 pb-16">
        <section className="mb-10 grid lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-6">
          <div className="rounded-2xl p-6 sm:p-7 relative overflow-hidden">
           
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl border-purple-800 border flex items-center justify-center">
                  <Search className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold font-serif tracking-tight text-slate-900">
                    Explore the Exam Archive
                  </h2>
                  <p className="text-xs sm:text-[13px] text-slate-500 mt-1">
                    Search across all government exams, notifications and
                    opportunities in one place.
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 uppercase tracking-[0.2em]">
                Feature Story • Search
              </span>
            </div>
  
            <div className="relative mb-4">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search by exam name"
                className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/80 focus:border-purple-500/80 transition"
                value={searchInput}
                onChange={handleSearch}
              />
            </div>
  
            {searched.trim() && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/80 max-h-72 overflow-hidden flex flex-col">
                {searchResults.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-slate-700 font-serif">
                    No results for{" "}
                    <span className="font-semibold text-purple-600">
                      "{searched}"
                    </span>
                    . Try another exam name.
                  </div>
                ) : (
                  <>
                    <div className="px-4 py-2 text-[11px] uppercase tracking-[0.22em] bg-purple-600 text-white font-semibold flex items-center justify-between">
                      <span>{searchResults.length} Results Found</span>
                      <span className="hidden sm:inline text-[10px] text-purple-100/90">
                        Tap a card to open full notification
                      </span>
                    </div>
                    <div className="divide-y divide-slate-200 overflow-y-auto custom-scroll-sm">
                      {searchResults.map((event) => (
                        // <button
                        //   key={event._id}
                        //   type="button"
                        //   // onClick={() =>
                        //   //   (window.location.href = `/top-exams-for-government-jobs-in-india/${event.name}?id=${event._id}`)
                        //   // }
                        //   onClick={(e) => onEventNavigate(e, apiBaseUrl, navigate, event)}

                        //   className="w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors"
                        // >
                        <button
                          key={event._id}
                          type="button"
                          onMouseEnter={() => prefetchEventRoute(event)}     // optional but recommended
                          onClick={(e) => handleEventClick(e, event)}        // ✅ global old/new resolver
                          className="w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors"
                        >
                          <p className="font-serif font-semibold text-sm sm:text-base text-slate-900 line-clamp-2">
                            {event.name}
                          </p>
                          <p className="mt-1 text-[11px] sm:text-xs text-slate-600">
                            {event.organizationName || "Unknown Organization"}
                            {event.event_type ? (
                              <span className="text-purple-600">
                                {" "}
                                • {event.event_type}
                              </span>
                            ) : null}
                          </p>
                          {event.date_of_commencement && (
                            <p className="mt-1 text-[11px] text-slate-500">
                              Commencement:{" "}
                              <span className="font-medium text-purple-700">
                                {event.date_of_commencement}
                              </span>
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
  
          <div className="flex flex-col gap-4">
            <div className="bg-purple-500/10 border border-purple-100 rounded-2xl p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
                    {statesCovered}
                  </p>
                  <p className="tex t-[11px] uppercase tracking-[0.22em] text-slate-500 mt-1">
                    States Covered
                  </p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
                    {examsTracked}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mt-1">
                    Active Exams
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-slate-600">
                Real-time tracking of government exams across India, refreshed
                daily with verified updates.
              </p>
            </div>
  
          </div>
        </section>
  
        <section className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <a
                href="/daily-updates"
                className="group bg-white border border-purple-100 rounded-2xl overflow-hidden shadow-[0_18px_50px_rgba(15,23,42,0.08)] flex flex-col h-full"
              >
                <div className="relative h-12 sm:h-16 overflow-hidden">
                  <div className="absolute inset-0 bg-purple-800" />
                  <div className="absolute bottom-3 left-4 px-3 py-1  rounded-full bg-white/80 border border-purple-200 text-[10px] uppercase tracking-[0.22em] text-purple-700 font-semibold">
                    Cover Story • Today
                  </div>
                </div>
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl sm:text-3xl font-serif font-semibold mb-2 leading-tight text-slate-900">
                    आज की करेंट अफेयर्स
                  </h3>
                  <p className="text-sm sm:text-[15px] text-slate-700 font-serif mb-3 flex-1">
                    Exam-focused current affairs with MCQs for SSC, Banking,
                    Railway &amp; State PSC — freshly curated every morning at
                    6:00 AM IST.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-700">
                    <span className="px-2 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700">
                      Today&apos;s Edition
                    </span>
                    <span className="px-2 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700">
                      Free Access
                    </span>
                    <span className="px-2 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700">
                      Hindi &amp; English
                    </span>
                  </div>
                </div>
              </a>
  
              <a
                href="/monthly-magazine"
                className="group bg-white border border-purple-100 rounded-2xl overflow-hidden shadow-[0_18px_50px_rgba(15,23,42,0.08)] flex flex-col h-full"
              >
                <div className="relative h-12 sm:h-16 overflow-hidden">
                  <div className="absolute inset-0 bg-purple-800" />
                  <div className="absolute top-3 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/85 border border-purple-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span className="text-[10px] uppercase tracking-[0.22em] text-purple-700 font-semibold">
                      Monthly Issue
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-4 text-right text-[11px] text-slate-800">
                   
                    <div className="text-[10px] text-slate-100">
                      Latest Edition
                    </div>
                  </div>
                </div>
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <h3 className="text-xl sm:text-2xl font-serif font-semibold mb-2 text-slate-900">
                    Gyapak Monthly Magazine
                  </h3>
                  <p className="text-sm sm:text-[15px] text-slate-700 font-serif mb-3 flex-1">
                    A complete monthly digest of government jobs, major exams and
                    high-yield current affairs — in a beautifully designed PDF
                    format.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-700">
                  
                    <span className="px-2 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700">
                      One-click Download
                    </span>
                  </div>
                </div>
              </a>
            </div>
  
            <div className="bg-white border border-purple-100 rounded-2xl p-4 sm:p-5 flex flex-wrap gap-4 justify-between items-center shadow-sm">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 mb-1">
                  Coverage &amp; Reach
                </p>
                <p className="text-sm text-slate-700 font-serif max-w-xl">
                  From central to state-level exams, Gyapak magazine keeps you
                  ahead with{" "}
                  <span className="text-purple-700 font-semibold">
                    verified, noise-free updates
                  </span>
                  .
                </p>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <p className="text-xl font-bold font-serif text-slate-900">
                    {statesCovered}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    States
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold font-serif text-slate-900">
                    {examsTracked}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    Exams
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Link to={'/Latest-Examination-Results-Admit-Card'} className="bg-purple-600 text-left px-6 py-2 rounded-lg text-xl text-white font-bold">
            Qucik Results and Admit Cards news
          </Link>
         
  
          {/* <aside className="space-y-6">
            <div className="bg-white border border-purple-100 rounded-2xl shadow-[0_18px_50px_rgba(15,23,42,0.06)] overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.25em] text-purple-600">
                  Important Dates
                </p>
                <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">
                  Deadline Radar
                </span>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex gap-3 pb-4 border-b border-slate-200">
                  <div className="mt-1">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold font-serif text-slate-900">
                      SSC CGL 2024
                    </p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Last date for application:{" "}
                      <span className="text-amber-700 font-medium">
                        15 Dec 2024
                      </span>
                    </p>
                  </div>
                </div>
  
                <div className="flex gap-3 pb-4 border-b border-slate-200">
                  <div className="mt-1">
                    <Calendar className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold font-serif text-slate-900">
                      UPSC CSE 2024
                    </p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Prelims exam date:{" "}
                      <span className="text-emerald-700 font-medium">
                        20 Dec 2024
                      </span>
                    </p>
                  </div>
                </div>
  
                <div className="flex gap-3">
                  <div className="mt-1">
                    <Calendar className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold font-serif text-slate-900">
                      RRB NTPC 2024
                    </p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Application window closes:{" "}
                      <span className="text-sky-700 font-medium">
                        25 Dec 2024
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <a
                href="/government-calendar"
                className="block px-4 py-3 text-center text-[11px] uppercase tracking-[0.25em] font-semibold bg-purple-700 hover:bg-purple-800 text-purple-100 transition-colors border-t border-slate-200"
              >
                View Full Exam Calendar →
              </a>
            </div>
  
            <div className=" border border-purple-200 rounded-2xl p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
              <div className="flex items-center gap-3 mb-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-purple-500">
                    Subscribe
                  </p>
                  <h3 className="text-sm sm:text-base font-semibold font-serif text-slate-900">
                    Daily Exam Brief in Your Inbox
                  </h3>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-serif mb-4">
                One concise email with handpicked notifications, last dates and
                current affairs. No spam, just{" "}
                <span className="font-semibold text-purple-700">
                  exam-relevant signal
                </span>
                .
              </p>
              <button className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-purple-600 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-white hover:bg-purple-700 transition-colors shadow-sm">
                Subscribe Free
              </button>
            </div>
          </aside> */}
        </section>

        <GovCalendar/>
  
      </main>
    </div>
  );
  
  
}
