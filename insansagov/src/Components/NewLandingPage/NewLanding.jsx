import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Search, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useApi, CheckServer } from "../../Context/ApiContext";
import { debounce } from "../../Utils/debounce";
import { useEventRouting } from "../../Utils/useEventRouting";
import GovCalendar from "./components/GovCalendar";

import {
  JobPageTitle,
  LandingPageSearch,
  LandingPageSearchDescription,
  LandingPageSearchPlaceholder,
  LandingPageStatsDescription,
} from "../../constants/Constants";
import { ComingSoonModal } from "../ComingSoonModal";


const Surface = ({ className = "", children }) => (
  <div
    className={[
      "bg-white/90 backdrop-blur",
      "border-2 main-site-border-color",
      "rounded-xl",
      "shadow-[var(--shadow-accertinity)]",
      "animate-slide-up",
      className,
    ].join(" ")}
  >
    {children}
  </div>
);

const SideBtn = ({ label, to , onComingSoon}) => {
  const base =
    "group w-full flex items-center justify-between gap-3 " +
    "border-2 main-site-border-color bg-white " +
    "px-4 py-4 rounded-xl " +
    "hover:light-site-color-3 transition " +
    "active:scale-[0.99]";

  const left = (
    <div className="flex items-center gap-3">
      <div className="text-left">
        <p className="font-semibold main-site-text-color leading-5">{label}</p>
        <p className="text-[11px] utility-secondary-color mt-0.5">Tap to explore</p>
      </div>
    </div>
  );

  const right = (
    <ArrowRight className="w-4 h-4 utility-secondary-color group-hover:main-site-text-color transition" />
  );

  if (to) {
    return (
      <Link to={to} className={base}>
        {left}
        {right}
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => onComingSoon?.(label)} className={base}>
    {left}
    {right}
  </button>
  );
};

const RightBigBtn = ({ label, to, subtitle = "Open latest updates", onComingSoon }) => {
  const base =
    "group block w-full no-underline text-left " +
    "border-2 main-site-border-color bg-white " +
    "rounded-xl px-5 py-5 shadow-[var(--shadow-accertinity)] " +
    "hover:light-site-color-3 transition active:scale-[0.99]";

  const inner = (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="font-extrabold main-site-text-color truncate">{label}</p>
        <p className="text-[11px] utility-secondary-color mt-1 truncate">{subtitle}</p>
      </div>

      <ArrowRight className="w-4 h-4 utility-secondary-color group-hover:main-site-text-color transition" />
    </div>
  );

  if (to) {
    return (
      <Link to={to} className={base} aria-label={label} title={label}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => onComingSoon?.(label)} className={base}>
      {inner}
    </button>
  );
};

export default function GyapakLanding() {
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
const [comingSoonLabel, setComingSoonLabel] = useState("");

const comingSoon = (label) => {
  setComingSoonLabel(label);
  setComingSoonOpen(true);
};


  const { apiBaseUrl, setApiBaseUrl, setServerError } = useApi();

  const [stateCount, setStateCount] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searched, setSearched] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [rows, setRows] = useState([]);

  const { handleEventClick, prefetchEventRoute , getEventHref} = useEventRouting({
    fallback: "old",
  });

  

  const debouncedUpdateRef = useRef(null);

  useEffect(() => {
    debouncedUpdateRef.current = debounce((value) => setSearched(value), 600);
    return () => debouncedUpdateRef.current?.cancel?.();
  }, []);

  const fetchJobs = async () => {
    if (!apiBaseUrl) return;

    try {
      const res = await axios.get(`${apiBaseUrl}/api/event/latest-events`);

      const data = res?.data?.data || res?.data || [];
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log("fetchJobs error:", e?.response?.data?.message || e?.message);
      setRows([]);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBaseUrl]);

  const fmtINR = (n) => {
    if (!Number.isFinite(Number(n))) return "—";
    return `₹${Number(n).toLocaleString("en-IN")}`;
  };


  const top5Jobs = useMemo(() => {
    return (Array.isArray(rows) ? rows : []).slice(0, 5);
  }, [rows]);

  const isNewEvent = (job) => {
    const d = job?.updatedAt || job?.createdAt || job?.date_of_commencement;
    if (!d) return false;
    const ms = Date.now() - new Date(d).getTime();
    return ms >= 0 && ms <= 1000 * 60 * 60 * 24 * 7; // 7 days
  };
  
  const fmtDateShort = (d) => {
    if (!d) return "";
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "";
    return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  useEffect(() => {
    const fetchStateCount = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/state/count`);
        setStateCount(response.data);
      } catch (error) {
        if (error?.response?.status >= 500) {
          const url = await CheckServer();
          if (url) setApiBaseUrl?.(url);
          setServerError?.(error.response.status);
        } else {
          console.error("Error fetching state count:", error);
        }
      }
    };
    if (apiBaseUrl) fetchStateCount();
  }, [apiBaseUrl, setApiBaseUrl, setServerError]);

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
        setSearchResults(res.data?.data || res.data || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
        if (error?.response?.status >= 500) {
          const url = await CheckServer();
          if (url) setApiBaseUrl?.(url);
          setServerError?.(error.response.status);
        }
      }
    };

    if (apiBaseUrl) fetchSearchResults();
  }, [searched, apiBaseUrl, setApiBaseUrl, setServerError]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedUpdateRef.current?.(value);
  };

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

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const StatPill = ({ label, value }) => (
    <div className="px-3 py-2 rounded-xl border main-site-border-color light-site-color-3">
      <p className="text-[10px] uppercase tracking-widest utility-secondary-color font-extrabold">
        {label}
      </p>
      <p className="text-lg font-black main-site-text-color leading-6">{value}</p>
    </div>
  );
  
  const SectionTitle = ({ title, subtitle }) => (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-lg font-black utility-site-color">{title}</p>
        {subtitle ? (
          <p className="text-xs utility-secondary-color mt-1">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
  

  
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
    <>
      <div className="min-h-screen mt-28 animate-fade-in">
        {/* HERO */}
        <header className="relative">
          <div className="absolute inset-0 -z-10 " />
  
          <div className="mx-auto px-4 sm:px-6 lg:px-10 py-10">
            <Surface className="p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border main-site-border-color light-site-color-3">
                    <span className="text-[10px] uppercase tracking-widest font-extrabold utility-secondary-color">
                      Daily verified updates
                    </span>
                    <span className="text-[10px] font-black main-site-text-color">
                      {today}
                    </span>
                  </div>
  
                  <h1 className="mt-4 text-5xl sm:text-6xl lg:text-[4.5vw] font-black tracking-tight font-serif">
                    <span
                      className={[
                        "bg-clip-text text-transparent main-site-text-color",
                        "transition-opacity duration-300",
                        isFading ? "opacity-0" : "opacity-100",
                      ].join(" ")}
                    >
                      {TITLE_VARIANTS[titleIndex]}
                    </span>
                  </h1>
  
                  {/* <p className="mt-3 text-sm sm:text-base utility-secondary-color max-w-2xl">
                    Search government exams, jobs, results, admit cards, and daily current affairs — in one place.
                  </p> */}
                </div>
  
                {/* Quick stats (optional) */}
                <div className="flex flex-wrap gap-3 justify-start lg:justify-end">
                  <StatPill label="States" value={statesCovered} />
                  <StatPill label="Exams" value={examsTracked} />
                </div>
              </div>
            </Surface>
          </div>
        </header>
  
        {/* MAIN */}
        <div className="mx-auto px-4 sm:px-6 lg:px-10 pb-10">
          {/* ✅ Correct column order: LEFT | CENTER | RIGHT */}
          <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_340px] gap-6">
            {/* LEFT SIDEBAR */}
            <div className="lg:sticky lg:top-24 h-fit">
              <Surface className="p-5">
                <SectionTitle
                  title="Quick Links"
                  subtitle="Explore key sections quickly"
                />
  
                <div className="mt-4 space-y-3">
                  <SideBtn
                    label="Last Date To Apply"
                    to="/Last-Date-to-Apply-for-Online-Offline-Government-Jobs-Applications"
                  />
                  <SideBtn label="Daily Current affairs for upsc" to="/daily-updates" />
                  <SideBtn label="Current affair Magazines" to="/monthly-magazine" />
                  <SideBtn label="Blogs" to="/blog" />
                  <SideBtn label="Daily mcq's" onComingSoon={comingSoon} />
                </div>
              </Surface>
            </div>
  
            {/* CENTER */}
            <div className="space-y-6">
              {/* SEARCH */}
              <Surface className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-xl light-site-color border main-site-border-color flex items-center justify-center">
                        <Search className="w-4 h-4 main-site-text-color" />
                      </div>
                      <h2 className="text-lg font-extrabold utility-site-color">
                        {LandingPageSearch || "Explore the Exam Archive"}
                      </h2>
                    </div>
                    <p className="text-xs utility-secondary-color mt-1">
                      {LandingPageSearchDescription ||
                        "Search across all government exams, notifications and opportunities in one place."}
                    </p>
                  </div>
                </div>
  
                <div className="relative">
                  <Search className="w-4 h-4 utility-secondary-color-2 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={LandingPageSearchPlaceholder || "Search by exam/jobs/events"}
                    className={[
                      "w-full pl-10 pr-3 py-3.5 rounded-xl text-sm outline-none",
                      "border-2 main-site-border-color bg-white",
                      "focus:main-site-border-color-4 transition",
                    ].join(" ")}
                    value={searchInput}
                    onChange={handleSearch}
                  />
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                    <div className="absolute -left-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shine" />
                  </div>
                </div>
  
                {/* Search results dropdown */}
                {searched.trim() && (
                  <div className="mt-4 border-2 main-site-border-color rounded-2xl overflow-hidden bg-white">
                    {searchResults.length === 0 ? (
                      <div className="px-4 py-4 text-sm utility-site-color">
                        No results for{" "}
                        <span className="font-extrabold main-site-text-color">
                          "{searched}"
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="px-4 py-2 light-site-color-3 text-[11px] uppercase tracking-widest utility-secondary-color font-extrabold flex items-center justify-between">
                          <span>
                            <span className="main-site-text-color font-black">
                              {searchResults.length}
                            </span>{" "}
                            Results Found
                          </span>
                          <span className="hidden sm:inline text-[10px] utility-secondary-color-2">
                            Hover loads faster • Click to open
                          </span>
                        </div>
  
                        <div className="max-h-72 overflow-y-auto divide-y main-site-border-color scrollbar-hide">
                          {searchResults.map((event) => (
                            <button
                              key={event._id}
                              type="button"
                              onMouseEnter={() => prefetchEventRoute(event)}
                              onClick={(e) => handleEventClick(e, event)}
                              className="w-full text-left px-4 py-3 hover:light-site-color-3 transition"
                            >
                              <p className="font-extrabold utility-site-color line-clamp-2">
                                {event.name}
                              </p>
  
                              <div className="mt-1 flex items-center gap-2 flex-wrap">
                                <span className="text-[11px] utility-secondary-color">
                                  {event.organizationName || "Unknown Organization"}
                                </span>
  
                                {event.event_type ? (
                                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full light-site-color border main-site-border-color main-site-text-color">
                                    {event.event_type}
                                  </span>
                                ) : null}
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </Surface>
  
              {/* NEWLY ADDED EVENTS */}
              <Surface className="p-6">
                <SectionTitle
                  title="Upcoming Govt Exams"
                  subtitle="Fresh events added recently on Gyapak"
                />
  
                <div className="mt-5 space-y-3">
                  {top5Jobs.map((job) => {
                    const isNew = true;
                    const org = job?.organizationName || job?.organization || "Government";
                    const type = job?.event_type || job?.type || "";
                    const dateLabel = fmtDateShort(
                      job?.updatedAt || job?.createdAt || job?.date_of_commencement
                    );
  
                    return (
                      <Link
                        key={job?._id}
                        to={getEventHref(job)}
                        onMouseEnter={() => prefetchEventRoute(job)}
                        onClick={(e) => handleEventClick(e, job)}
                        className={[
                          "group block rounded-2xl border-2 main-site-border-color bg-white overflow-hidden",
                          "transition cursor-pointer",
                          "hover:light-site-color-3 hover:-translate-y-[1px] hover:shadow-[var(--shadow-accertinity)]",
                          "active:scale-[0.99]",
                        ].join(" ")}
                        title={job?.name || "Open"}
                        aria-label={`Open ${job?.name || "event"}`}
                      >
                        <div className="h-1 w-full main-site-color" />
  
                        <div className="p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              {isNew ? (
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full main-site-color secondary-site-text-color">
                                  NEW
                                </span>
                              ) : null}
  
                              {type ? (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border main-site-border-color light-site-color-3 main-site-text-color">
                                  {type}
                                </span>
                              ) : null}
  
                              {dateLabel ? (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border main-site-border-color light-site-color-3 utility-secondary-color">
                                  {dateLabel}
                                </span>
                              ) : null}
                            </div>
  
                            <div className="h-9 w-9 rounded-xl border main-site-border-color light-site-color flex items-center justify-center">
                              <ArrowRight className="w-4 h-4 utility-secondary-color group-hover:main-site-text-color transition" />
                            </div>
                          </div>
  
                          <p className="mt-3 font-extrabold utility-site-color line-clamp-2 leading-snug">
                            {job?.name || "Untitled Event"}
                          </p>
  
                          <div className="mt-2 flex items-center justify-between gap-3">
                            <p className="text-[11px] utility-secondary-color line-clamp-1">
                              {org}
                            </p>
  
                            <span className="text-[11px] font-extrabold main-site-text-color">
                              Open
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
  
                <Link
                  to="/latest-government-updates"
                  className="mt-5 group flex items-center justify-center gap-2 w-full main-site-color secondary-site-text-color font-extrabold rounded-xl py-3 hover:main-site-color-hover transition"
                >
                  View all upcoming govt exams
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </Link>
              </Surface>
  
              {/* CALENDAR */}
              <Surface className="p-4">
                <GovCalendar />
              </Surface>
            </div>
  
            {/* RIGHT SIDEBAR */}
            <div className="lg:sticky lg:top-24 h-fit space-y-4">
              <Surface className="p-5">
                <SectionTitle title="Highlights" subtitle="Quick access to popular sections" />
  
                <div className="mt-4 space-y-3">
                  <RightBigBtn label="Latest Results" to="/Latest-Examination-Results-Admit-Card?result" />
                  <RightBigBtn label="Big Announcements" onComingSoon={comingSoon} />
                  <RightBigBtn label="Latest Admit cards" to="/Latest-Examination-Results-Admit-Card?admitcard" />
                  <RightBigBtn label="Top Government Jobs" to="/top-high-paid-goverment-job-2025" />
                </div>
              </Surface>
  
              <Surface className="p-5">
                <p className="text-sm font-extrabold utility-site-color">Tip</p>
                <p className="text-xs utility-secondary-color mt-1">
                  Use the search box to find any exam/event instantly. Hover on a result for faster opening.
                </p>
              </Surface>
            </div>
          </div>
        </div>
      </div>
  
      <ComingSoonModal
        open={comingSoonOpen}
        label={comingSoonLabel}
        onClose={() => setComingSoonOpen(false)}
      />
    </>
  );
  
}

