import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Search, Calendar, Bell } from "lucide-react";
import { useApi, CheckServer } from "../../Context/ApiContext";
import { debounce } from "../../Utils/debounce";
import { Link, useNavigate } from "react-router-dom";
import { useEventRouting } from "../../Utils/useEventRouting";
import GovCalendar from "./components/GovCalendar";
import { JobPageTitle, LandingPageCurrentAffairsDescription, LandingPageCurrentAffairsTitle, LandingPageMonthlyMagazineDescription, LandingPageMonthlyMagazineTitle, LandingPageSearch, LandingPageSearchDescription, LandingPageSearchPlaceholder, LandingPageStatsDescription, QuickResultsTitle } from "../../constants/Constants";

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
    <div className="min-h-screen mt-32 utility-site-color">
      <header className="border-b main-site-border-color ">
        <div className=" mx-auto px-4 sm:px-16 py-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] main-site-text-color">
                Gyapak 
              </p>
              <p className="text-xs utility-secondary-color">{today}</p>
            </div>
  
            <div className="flex flex-col items-end gap-1">
             
              <div className="flex flex-wrap gap-2 text-[11px] utility-secondary-color">
                <span className="px-2 py-0.5 rounded-full light-site-color-3 border main-site-border-color">
                  {statesCovered} States
                </span>
                <span className="px-2 py-0.5 rounded-full light-site-color-3 border main-site-border-color">
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
                    "bg-clip-text py-10 text-transparent main-site-text-color",
                    "transition-opacity duration-300",
                    isFading ? "opacity-0" : "opacity-100",
                  ].join(" ")}
                >
                  {TITLE_VARIANTS[titleIndex]}
                </span>
              </h1>
            </div>
  
            <div className="flex flex-col items-center sm:items-end gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border main-site-border-color shadow-sm">
                <span className="text-[11px] uppercase tracking-[0.25em] utility-secondary-color">
                  Edition
                </span>
                <span className="text-xs font-semibold main-site-text-color">
                  All India • Digital
                </span>
              </div>
              <div className="text-[11px] utility-secondary-color uppercase tracking-[0.3em] font-medium">
                Price: <span className="main-site-text-color">Free</span> • Updated Daily
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
                <div className="h-9 w-9 rounded-xl main-dark-border-color border flex items-center justify-center">
                  <Search className="w-4 h-4 main-site-text-color" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold font-serif tracking-tight utility-site-color">
                    {LandingPageSearch}
                  </h2>
                  <p className="text-xs sm:text-[13px] utility-secondary-color mt-1">
                    {LandingPageSearchDescription}
                  </p>
                </div>
              </div>
              <span className="text-[11px] utility-secondary-color-2 uppercase tracking-[0.2em]">
                Feature Story • Search
              </span>
            </div>
  
            <div className="relative mb-4">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="w-4 h-4 utility-secondary-color-2" />
              </div>
              <input
                type="text"
                placeholder={LandingPageSearchPlaceholder}
                className="w-full pl-10 pr-4 py-3.5 rounded-xl border main-dark-border-color  text-sm sm:text-base utility-site-color placeholder:utility-secondary-color-2 focus:outline-none focus:ring-2 focus:ring-purple-500/80 focus:border-purple-500/80 transition"
                value={searchInput}
                onChange={handleSearch}
              />
            </div>
  
            {searched.trim() && (
              <div className="mt-4 rounded-xl border main-dark-border-color light-site-color-3/80 max-h-72 overflow-hidden flex flex-col">
                {searchResults.length === 0 ? (
                  <div className="px-4 py-3 text-sm utility-site-color font-serif">
                    No results for{" "}
                    <span className="font-semibold main-site-text-color">
                      "{searched}"
                    </span>
                    . Try another exam name.
                  </div>
                ) : (
                  <>
                    <div className="px-4 py-2 text-[11px] uppercase tracking-[0.22em] main-site-color secondary-site-text-color font-semibold flex items-center justify-between">
                      <span>{searchResults.length} Results Found</span>
                      <span className="hidden sm:inline text-[10px] utility-scondary-color-3/90">
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

                        //   className="w-full text-left px-4 py-3 hover:light-site-color-3 transition-colors"
                        // >
                        <button
                          key={event._id}
                          type="button"
                          onMouseEnter={() => prefetchEventRoute(event)}     // optional but recommended
                          onClick={(e) => handleEventClick(e, event)}        // ✅ global old/new resolver
                          className="w-full text-left px-4 py-3 hover:light-site-color-3 transition-colors"
                        >
                          <p className="font-serif font-semibold text-sm sm:text-base utility-site-color line-clamp-2">
                            {event.name}
                          </p>
                          <p className="mt-1 text-[11px] sm:text-xs utility-secondary-color">
                            {event.organizationName || "Unknown Organization"}
                            {event.event_type ? (
                              <span className="main-site-text-color">
                                {" "}
                                • {event.event_type}
                              </span>
                            ) : null}
                          </p>
                          {event.date_of_commencement && (
                            <p className="mt-1 text-[11px] utility-secondary-color">
                              Commencement:{" "}
                              <span className="font-medium main-site-text-color">
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
            <div className="light-site-color-3 border main-site-border-color rounded-2xl p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold font-serif utility-site-color">
                    {statesCovered}
                  </p>
                  <p className="tex t-[11px] uppercase tracking-[0.22em] utility-secondary-color mt-1">
                    States Covered
                  </p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold font-serif utility-site-color">
                    {examsTracked}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.22em] utility-secondary-color mt-1">
                    Active Exams
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[11px] utility-secondary-color">
                {LandingPageStatsDescription}
              </p>
            </div>
  
          </div>
        </section>
  
        <section className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <a
                href="/daily-updates"
                className="group border main-site-border-color rounded-2xl overflow-hidden shadow-[0_18px_50px_rgba(15,23,42,0.08)] flex flex-col h-full"
              >
                <div className="relative h-12 sm:h-16 overflow-hidden">
                  <div className="absolute inset-0 main-site-color" />
                  <div className="absolute bottom-3 left-4 px-3 py-1  rounded-full border main-site-border-color-2 text-[10px] uppercase tracking-[0.22em] secondary-site-text-color font-semibold">
                    Cover Story • Today
                  </div>
                </div>
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl sm:text-3xl font-serif font-semibold mb-2 leading-tight utility-site-color">
                    {LandingPageCurrentAffairsTitle}
                  </h3>
                  <p className="text-sm sm:text-[15px] utility-secondary-color font-serif mb-3 flex-1">
                    {LandingPageCurrentAffairsDescription}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] utility-secondary-color">
                    <span className="px-2 py-1 rounded-full light-site-color-3 border main-site-border-color-2 main-site-text-color">
                      Today&apos;s Edition
                    </span>
                    <span className="px-2 py-1 rounded-full light-site-color-3 border main-site-border-color-2 main-site-text-color">
                      Free Access
                    </span>
                    <span className="px-2 py-1 rounded-full light-site-color-3 border main-site-border-color-2 main-site-text-color">
                      Hindi &amp; English
                    </span>
                  </div>
                </div>
              </a>
  
              <a
                href="/monthly-magazine"
                className="group  border main-site-border-color rounded-2xl overflow-hidden shadow-[0_18px_50px_rgba(15,23,42,0.08)] flex flex-col h-full"
              >
                <div className="relative h-12 sm:h-16 overflow-hidden">
                  <div className="absolute inset-0 main-site-color" />
                  <div className="absolute top-3 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full  border main-site-border-color-2">
                    <span className="h-1.5 w-1.5 rounded-full support-component-bg-color" />
                    <span className="text-[10px] uppercase tracking-[0.22em] secondary-site-text-color font-semibold">
                      Monthly Issue
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-4 text-right text-[11px] utility-site-color">
                   
                    <div className="text-[10px] utility-scondary-color-3">
                      Latest Edition
                    </div>
                  </div>
                </div>
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <h3 className="text-xl sm:text-2xl font-serif font-semibold mb-2 utility-site-color">
                    {LandingPageMonthlyMagazineTitle}
                  </h3>
                  <p className="text-sm sm:text-[15px] utility-secondary-color font-serif mb-3 flex-1">
                    {LandingPageMonthlyMagazineDescription}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] utility-secondary-color">
                  
                    <span className="px-2 py-1 rounded-full light-site-color-3 border main-site-border-color-2 main-site-text-color">
                      One-click Download
                    </span>
                  </div>
                </div>
              </a>
            </div>
  
            <div className="border main-site-border-color rounded-2xl p-4 sm:p-5 flex flex-wrap gap-4 justify-between items-center shadow-sm">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] utility-secondary-color mb-1">
                  Coverage &amp; Reach
                </p>
                <p className="text-sm utility-secondary-color font-serif max-w-xl">
                  From central to state-level exams, Gyapak magazine keeps you
                  ahead with{" "}
                  <span className="main-site-text-color font-semibold">
                    verified, noise-free updates
                  </span>
                  .
                </p>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <p className="text-xl font-bold font-serif utility-site-color">
                    {statesCovered}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.22em] utility-secondary-color">
                    States
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold font-serif utility-site-color">
                    {examsTracked}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.22em] utility-secondary-color">
                    Exams
                  </p>
                </div>
              </div>
            </div>
          </div>

         
        </section>
          <div className="flex gap-5 justify-center w-full mt-10">

            <Link to={'/Latest-Examination-Results-Admit-Card'} className="main-site-color text-left px-6 py-2 rounded-lg text-xl secondary-site-text-color font-bold">
              {QuickResultsTitle}
            </Link>

            <Link to={'/top-high-paid-goverment-job-2025'} className="main-site-color text-left px-6 py-2 rounded-lg text-xl secondary-site-text-color font-bold">
              {JobPageTitle}
            </Link>
          </div>

        <GovCalendar/>
  
      </main>
    </div>
  );
  
  
}
