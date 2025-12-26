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
    <div className="min-h-screen mt-32 animate-fade-in">
        <header className="border-b border-purple-100 ">
          <div className=" mx-auto px-4 sm:px-16 py-6 flex flex-col gap-4">
           
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
            </div>

          </div>
        </header>
      <div className="relative">
        <div className="absolute inset-0 -z-10 " />

        <div className="mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_320px] gap-6">
            {/* RIGHT */}
            <div className="space-y-6">
              {/* <SoftCard className="overflow-hidden">
                <div className="p-4">
                  <div className="rounded-xl p-3 text-center border-2 main-site-border-color light-site-color-3">
                    <div className="text-[10px] uppercase tracking-widest utility-secondary-color-2 font-extrabold">
                      Edition{" "}
                      <span className="main-site-text-color font-black">All India • Digital</span>
                    </div>
                    <div className="mt-2 text-[10px] uppercase tracking-widest utility-secondary-color-2 font-extrabold">
                      Price: <span className="main-site-text-color font-black">Free</span> • Updated Daily
                    </div>
                  </div>
                </div>
              </SoftCard>

              <SoftCard>
                <div className="p-4">
                  <div className="border-2 main-site-border-color rounded-xl p-3 grid grid-cols-2 gap-3 items-center light-site-color-3">
                    <div className="text-center">
                      <div className="text-2xl font-black main-site-text-color">{statesCovered}</div>
                      <div className="text-[10px] uppercase tracking-widest utility-secondary-color-2 font-extrabold">
                        States Covered
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black main-site-text-color">{examsTracked}</div>
                      <div className="text-[10px] uppercase tracking-widest utility-secondary-color-2 font-extrabold">
                        Exams Tracked
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 text-[11px] utility-secondary-color">
                    {LandingPageStatsDescription || "Daily verified updates across India."}
                  </p>
                </div>
              </SoftCard> */}

              <RightBigBtn label="Latest Results" to="/Latest-Examination-Results-Admit-Card" />
              <RightBigBtn label="Big Announcements" onComingSoon={comingSoon} />
              <RightBigBtn label="Latest Admit cards" to="/Latest-Examination-Results-Admit-Card"/>
              <RightBigBtn label="Top Government Jobs" to="/top-high-paid-goverment-job-2025"/>

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
                      "focus:main-site-border-color-4",
                      "transition",
                    ].join(" ")}
                    value={searchInput}
                    onChange={handleSearch}
                  />

                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                    <div className="absolute -left-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shine" />
                  </div>
                </div>

                {searched.trim() && (
                  <div className="mt-4 border-2 main-site-border-color rounded-xl overflow-hidden bg-white">
                    {searchResults.length === 0 ? (
                      <div className="px-4 py-3 text-sm utility-site-color">
                        No results for{" "}
                        <span className="font-extrabold main-site-text-color">"{searched}"</span>
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
                            Hover to prefetch • Click to open
                          </span>
                        </div>

                        <div className="max-h-64 overflow-y-auto divide-y main-site-border-color scrollbar-hide">
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

              

              {/* TOP  JOBS */}
              <Surface className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className=" font-extrabold main-site-text-color text-lg">Newly added Government Events on gyapak</p>
                  </div>

                  {/* <Link
                    to="/top-high-paid-goverment-job-2025"
                    className="text-xs font-extrabold px-3 py-2 rounded-xl border-2 main-site-border-color light-site-color-3 hover:opacity-90 transition"
                  >
                    View all
                  </Link> */}
                </div>

                <div className="mt-5 space-y-3">
                {top5Jobs.map((job) => {
                  const isNew = true;
                  const org = job?.organizationName || job?.organization || "Government";
                  const type = job?.event_type || job?.type || "";
                  const dateLabel = fmtDateShort(job?.updatedAt || job?.createdAt || job?.date_of_commencement);

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
                      {/* Top accent strip */}
                      <div className="h-1 w-full main-site-color" />

                      <div className="p-4">
                        {/* Header row: chips */}
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

                        {/* Title */}
                        <p className="mt-3 font-extrabold utility-site-color line-clamp-2 leading-snug">
                          {job?.name || "Untitled Event"}
                        </p>

                        {/* Sub line */}
                        <div className="mt-2 flex items-center justify-between gap-3">
                          <p className="text-[11px] utility-secondary-color line-clamp-1">
                            {org}
                          </p>

                          <span className="text-[11px] font-extrabold main-site-text-color">
                            Open
                          </span>
                        </div>

                        {/* Soft bottom hint */}
                        <div className="mt-3 rounded-xl border main-site-border-color light-site-color-3 px-3 py-2">
                          <p className="text-[11px] utility-secondary-color">
                            Tap to open details • Hover loads faster
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}

                </div>

              </Surface>
            </div>

            {/* LEFT */}
            <Surface className="p-5">
              {/* <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-extrabold utility-site-color">Quick Links</p>
              </div> */}

              <div className="space-y-4">
              <SideBtn label="Current affairs" to="/daily-updates" />
              <SideBtn label="Daily mcq's" onComingSoon={comingSoon} />
              <SideBtn label="Monthly Magazines" to="/monthly-magazine" />
              <SideBtn label="Blogs" to="/blog" />

                {/* <SideBtn label="Quick Results" to="/Latest-Examination-Results-Admit-Card" /> */}
              </div>
            </Surface>

            
          </div>

          <div className="">
            <GovCalendar />
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

