import React, { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Filter, X } from "lucide-react";
import axios from "axios";
import ReelSlide from "./ReelSlide";


// const API_BASE = "https://admin.harshvaidya.tech/api/v1i2/affair"; 

const API_BASE = "http://localhost:3000/api/v1i2/affair"

// The enum you used in Mongoose
const CATEGORIES = ["Current Affairs", "Editorial", "MCQs", "Monthly Summary"];

export default function DailyUpdatesReels() {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const [headerH, setHeaderH] = useState(0);

  // data
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // filters
  const [date, setDate] = useState("");          // yyyy-mm-dd (single day)
  const [from, setFrom] = useState("");          // yyyy-mm-dd
  const [to, setTo] = useState("");              // yyyy-mm-dd
  const [month, setMonth] = useState("");        // "1".."12"
  const [year, setYear] = useState("");          // "2024"
  const [category, setCategory] = useState("");  // one of CATEGORIES
  const [published, setPublished] = useState(""); // "", "true", "false"
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("-date");

  // UI helpers
  const [showFilters, setShowFilters] = useState(true);
  const [typing, setTyping] = useState(false);

  // measure header height for full-screen slides
  useEffect(() => {
    const measure = () => setHeaderH(headerRef.current?.offsetHeight || 0);
    measure();
    const ro = new ResizeObserver(measure);
    if (headerRef.current) ro.observe(headerRef.current);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  const minSlideH = `calc(100vh - ${headerH}px)`;

  // Build query string from filters
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (month) params.set("month", month);
    if (year) params.set("year", year);
    if (category) params.set("category", category);
    if (published) params.set("published", published); // "true"/"false"
    if (search.trim()) params.set("search", search.trim());
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));
    if (sort) params.set("sort", sort);
    return params.toString();
  }, [date, from, to, month, year, category, published, search, page, limit, sort]);

  // Fetch with filters
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const url = `${API_BASE}/get-pdf${queryString ? `?${queryString}` : ""}`;
        const res = await axios.get(url, { signal: controller.signal });
        const list = res?.data?.data ?? res?.data ?? [];
        if (!cancelled) {
          setItems(Array.isArray(list) ? list : []);
        }
      } catch (e) {
        if (!cancelled) {
          setErr("Could not load daily updates.");
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [queryString]);

  // Debounce typing indicator for search UX (purely visual)
  useEffect(() => {
    setTyping(true);
    const t = setTimeout(() => setTyping(false), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Reset mutually exclusive date filters helpers
  const resetAllDates = () => {
    setDate("");
    setFrom("");
    setTo("");
    setMonth("");
    setYear("");
    setPage(1);
  };

  const resetRange = () => {
    setFrom("");
    setTo("");
    setPage(1);
  };

  const resetMonthYear = () => {
    setMonth("");
    setYear("");
    setPage(1);
  };

  const clearAll = () => {
    setDate("");
    setFrom("");
    setTo("");
    setMonth("");
    setYear("");
    setCategory("");
    setPublished("");
    setSearch("");
    setPage(1);
    setLimit(10);
    setSort("-date");
  };

  return (
    <div className="min-h-screen w-full mt-10 bg-white">
      {/* Header */}
      <header
        ref={headerRef}
        className="bg-white sticky top-0 z-40 pt-8 sm:pt-10 border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Title */}
            <div className="flex-1 mt-16 md:mt-20 text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl font-bold text-purple-800 mb-3 relative inline-block">
                <span className="relative z-10">Gyapak&apos;s Daily Updates</span>
                <span className="absolute -bottom-2 left-0 w-full h-2 bg-purple-200 transform -rotate-1 rounded z-0"></span>
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mt-1 max-w-xl mx-auto md:mx-0">
                Curated insights from{" "}
                <span className="text-purple-700 font-semibold">
                  gyapak ({loading ? "…" : items.length})
                </span>
                {typing ? <span className="ml-2 text-xs text-gray-400">typing…</span> : null}
              </p>
            </div>

            {/* Toggle filters */}
            <button
              type="button"
              onClick={() => setShowFilters((s) => !s)}
              className="inline-flex items-center gap-2 self-center md:self-auto px-3 py-2 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Hide filters" : "Show filters"}
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {/* Single Day */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Date (single)</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    // clear other date modes
                    setFrom(""); setTo(""); setMonth(""); setYear("");
                    setPage(1);
                  }}
                  className="border rounded-lg px-3 py-2"
                />
              </div>

              {/* Range */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">From</label>
                <input
                  type="date"
                  value={from}
                  onChange={(e) => {
                    if (date) setDate("");
                    if (month || year) { setMonth(""); setYear(""); }
                    setFrom(e.target.value);
                    setPage(1);
                  }}
                  className="border rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">To</label>
                <input
                  type="date"
                  value={to}
                  onChange={(e) => {
                    if (date) setDate("");
                    if (month || year) { setMonth(""); setYear(""); }
                    setTo(e.target.value);
                    setPage(1);
                  }}
                  className="border rounded-lg px-3 py-2"
                />
              </div>

              {/* Month / Year */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Month</label>
                <select
                  value={month}
                  onChange={(e) => {
                    if (date) setDate("");
                    if (from || to) { setFrom(""); setTo(""); }
                    setMonth(e.target.value);
                    setPage(1);
                  }}
                  className="border rounded-lg px-3 py-2"
                >
                  <option value="">Any</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1)}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Year</label>
                <input
                  type="number"
                  placeholder="2025"
                  value={year}
                  onChange={(e) => {
                    if (date) setDate("");
                    if (from || to) { setFrom(""); setTo(""); }
                    setYear(e.target.value);
                    setPage(1);
                  }}
                  className="border rounded-lg px-3 py-2"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                  className="border rounded-lg px-3 py-2"
                >
                  <option value="">All</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Published */}
              {/* <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Published</label>
                <select
                  value={published}
                  onChange={(e) => { setPublished(e.target.value); setPage(1); }}
                  className="border rounded-lg px-3 py-2"
                >
                  <option value="">Any</option>
                  <option value="true">Published</option>
                  <option value="false">Unpublished</option>
                </select>
              </div> */}

              {/* Search */}
              <div className="flex flex-col sm:col-span-2 xl:col-span-2">
                <label className="text-xs text-gray-500 mb-1">Search</label>
                <input
                  type="text"
                  placeholder="title or description…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="border rounded-lg px-3 py-2"
                />
              </div>

              {/* Sort */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Sort</label>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="border rounded-lg px-3 py-2"
                >
                  <option value="-date">Newest first</option>
                  <option value="date">Oldest first</option>
                  <option value="title">Title A→Z</option>
                  <option value="-title">Title Z→A</option>
                </select>
              </div>

              {/* Pagination */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Per page</label>
                <select
                  value={limit}
                  onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                  className="border rounded-lg px-3 py-2"
                >
                  {[10, 20, 30, 50].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              {/* Clear / Reset */}
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={clearAll}
                  className="px-3 py-2 rounded-lg border text-gray-700 border-gray-200 hover:bg-gray-50 inline-flex items-center gap-1"
                >
                  <X className="h-4 w-4" /> Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Error banner */}
      {err && (
        <div className="sticky top-[var(--headerH,0px)] z-30 p-3 sm:p-4 bg-amber-50 text-amber-800 text-sm border-y border-amber-200">
          ⚠️ {err}
        </div>
      )}

      {/* Reels / List */}
      <main
        ref={containerRef}
        className="w-full overflow-y-auto snap-y snap-mandatory"
        style={{ overscrollBehavior: "contain" }}
      >
        {loading ? (
          <div className="min-h-[50vh] grid place-items-center">
            <div className="flex items-center gap-3 text-purple-700">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="font-medium">Loading updates…</span>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="min-h-[40vh] grid place-items-center text-gray-500">
            No updates found for the selected filters.
          </div>
        ) : (
          items.map((item, idx) => (
            <ReelSlide
              key={item._id || item.id || idx}
              item={item}
              isLast={idx === items.length - 1}
              minH={minSlideH}
            />
          ))
        )}

        {/* Simple pagination controls */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <button
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-2 rounded-lg border border-gray-200 disabled:opacity-50"
          >
            Previous
          </button>
          <div className="text-sm text-gray-600">Page {page}</div>
          <button
            disabled={loading || items.length < Number(limit)}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-2 rounded-lg border border-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
