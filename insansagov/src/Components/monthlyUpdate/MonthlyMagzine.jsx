import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Download,
  CalendarDays,
} from "lucide-react";

// const API_BASE = "https://adminpanel.gyapak.in/api/v1i2/affair";
const API_BASE = "http://localhost:3000/api/v1i2/affair";

const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const MonthlyMagzine = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = String(new Date().getMonth() + 1);

  const [year, setYear] = useState(currentYear);
  const [activeMonth, setActiveMonth] = useState(currentMonth);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(40);
  const [sort] = useState("-date");

  // Build query: category fixed as Monthly Summary
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("category", "Monthly Summary");
    if (activeMonth) params.set("month", activeMonth);
    if (year) params.set("year", String(year));
    params.set("page", String(page));
    params.set("limit", String(limit));
    params.set("sort", sort);
    return params.toString();
  }, [activeMonth, year, page, limit, sort]);

  useEffect(() => {
    if (!activeMonth || !year) return;

    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const url = `${API_BASE}/get-pdf?${queryString}`;
        const res = await axios.get(url, { signal: controller.signal });

        console.log("ff", res?.data?.data);
        
        const list = res?.data?.data ?? res?.data ?? [];
        if (!cancelled) {
          setItems(Array.isArray(list) ? list : []);
        }
      } catch (e) {
        if (!cancelled) {
          console.error("Error fetching monthly magazines:", e);
          setErr("Unable to load magazines for this month.");
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
  }, [queryString, activeMonth, year]);

  const handlePrevYear = () => setYear((y) => y - 1);
  const handleNextYear = () => setYear((y) => y + 1);

  const handleMonthClick = (m) => {
    setActiveMonth(m);
    setPage(1);
  };

  const getPdfUrl = (item) =>
    item.pdfUrl || item.pdf || item.fileUrl || item.link || item.pdfLink || "#";

  const getTitle = (item, idx) =>
    item.title ||
    item.heading ||
    item.name ||
    `Monthly Summary ${
      MONTHS.find((m) => m.value === activeMonth)?.label || ""
    } ${year} #${idx + 1}`;

  const getDate = (item) =>
    item.date || item.publishedAt || item.createdAt || null;

  return (
    <div className="min-h-screen mt-40 w-full bg-gradient-to-b from-purple-50 via-white to-purple-50 text-gray-900">
      {/* Hero / Header */}
      <div className="border-b border-purple-100 bg-gradient-to-r from-purple-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center">
          {/* Left side */}
          <div className="flex-1 space-y-4">
            <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-purple-500">
              Gyapak Magazine Store
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-purple-900">
              Monthly Current Affairs{" "}
              <span className="text-purple-600">Magazine (Hindi)</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl">
              Browse{" "}
              <span className="text-purple-700 font-medium">
                month-wise & year-wise
              </span>{" "}
              magazines. Download detailed PDF summaries to revise important
              topics for government exams.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                <CalendarDays className="w-4 h-4 text-purple-500" />
                <span>
                  Showing:{" "}
                  <span className="font-semibold text-purple-700">
                    {
                      MONTHS.find((m) => m.value === activeMonth)?.label ??
                      "Select Month"
                    }{" "}
                    {year}
                  </span>
                </span>
              </div>
              <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs text-purple-700">
                Category: Monthly Summary
              </span>
            </div>
          </div>

          {/* Year selector card */}
          <div className="w-full max-w-xs rounded-2xl border border-purple-200 bg-white px-5 py-5 shadow-lg">
            <h2 className="text-sm font-medium text-purple-800 mb-2">
              Choose Year
            </h2>
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handlePrevYear}
                className="p-2 rounded-xl border border-purple-100 hover:bg-purple-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-purple-700" />
              </button>
              <div className="flex flex-col items-center">
                <span className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  Year
                </span>
                <span className="text-2xl font-semibold text-purple-800">
                  {year}
                </span>
              </div>
              <button
                onClick={handleNextYear}
                className="p-2 rounded-xl border border-purple-100 hover:bg-purple-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-purple-700" />
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Use the year selector above and then pick any month below to view
              magazines.
            </p>
          </div>
        </div>
      </div>

      {/* Month Shelf */}
      <section className="border-b border-purple-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-purple-900 tracking-wide">
              Month Shelf
            </h2>
            <span className="text-[11px] sm:text-xs text-gray-500">
              Select a month to load its magazines
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
            {MONTHS.map((m) => {
              const isActive = m.value === activeMonth;
              return (
                <button
                  key={m.value}
                  onClick={() => handleMonthClick(m.value)}
                  className={[
                    "relative group overflow-hidden rounded-xl border px-3 py-3 text-left transition-all",
                    isActive
                      ? "border-purple-500 bg-gradient-to-br from-purple-50 via-white to-indigo-50 shadow-md"
                      : "border-purple-100 bg-white hover:border-purple-300 hover:bg-purple-50/60",
                  ].join(" ")}
                >
                  <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500 group-hover:text-purple-600">
                    {String(m.value).padStart(2, "0")}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-800 group-hover:text-purple-800">
                    {m.label}
                  </div>
                  {isActive && (
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-purple-100/60 via-transparent to-indigo-100/60" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content: Magazine Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {loading ? (
          <div className="min-h-[40vh] grid place-items-center">
            <div className="flex items-center gap-3 text-purple-700">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm sm:text-base">
                Loading magazines for{" "}
                {
                  MONTHS.find((m) => m.value === activeMonth)?.label ??
                  "selected month"
                }{" "}
                {year}…
              </span>
            </div>
          </div>
        ) : err ? (
          <div className="min-h-[40vh] grid place-items-center">
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 max-w-md text-center">
              {err}
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="min-h-[40vh] grid place-items-center text-center">
            <div className="space-y-2 max-w-md">
              <p className="text-base font-semibold text-purple-900">
                No magazines found
              </p>
              <p className="text-sm text-gray-600">
                We could not find any{" "}
                <span className="font-medium text-purple-700">
                  Monthly Summary
                </span>{" "}
                magazines for{" "}
                <span className="font-semibold text-purple-700">
                  {
                    MONTHS.find((m) => m.value === activeMonth)?.label ??
                    "this month"
                  }{" "}
                  {year}
                </span>
                . Try switching month or year.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm sm:text-base font-semibold text-purple-900">
                Magazines for{" "}
                {
                  MONTHS.find((m) => m.value === activeMonth)?.label ??
                  "Month"
                }{" "}
                {year}
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-500">
                {items.length} magazine{items.length > 1 ? "s" : ""} found
              </p>
            </div>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item, idx) => {
                const title = getTitle(item, idx);
                const dateStr = getDate(item);
                const pdfUrl = getPdfUrl(item);

                return (
                  <article
                    key={item._id || item.id || idx}
                    className="group relative flex flex-col rounded-2xl border border-purple-100 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
                  >
                    {/* Fake cover */}
                    <div className="relative h-40 sm:h-44 bg-gradient-to-br from-purple-500 via-indigo-400 to-sky-400 p-[1px]">
                      <div className="relative h-full w-full rounded-2xl bg-white flex flex-col justify-between p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] uppercase tracking-[0.18em] text-purple-500">
                            Monthly Summary
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                            Hindi
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-gray-600">
                            {
                              MONTHS.find((m) => m.value === activeMonth)
                                ?.label
                            }{" "}
                            {year}
                          </p>
                          <h3 className="text-sm font-semibold text-purple-900 line-clamp-2">
                            {title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Info + actions */}
                    <div className="flex-1 flex flex-col px-4 py-3 gap-2">
                      {item.description && (
                        <p className="text-xs text-gray-700 line-clamp-3">
                          {item.description}
                        </p>
                      )}

                      {dateStr && (
                        <p className="mt-1 text-[11px] text-gray-500 flex items-center gap-1">
                          <CalendarDays className="w-3 h-3 text-purple-500" />
                          {new Date(dateStr).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      )}

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm text-white font-medium px-3 py-2 transition-colors"
                        >
                          <BookOpen className="w-4 h-4" />
                          Read / Download
                        </a>
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-[11px] text-purple-700 px-2.5 py-1.5 transition-colors"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          PDF
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            {/* Simple pagination */}
            <div className="mt-8 flex items-center justify_between gap-4 text-xs sm:text-sm text-gray-700">
              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-2 rounded-xl border border-purple-100 bg-white disabled:opacity-40 hover:bg-purple-50 transition-colors"
              >
                Previous Page
              </button>
              <span>Page {page}</span>
              <button
                disabled={loading || items.length < limit}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-2 rounded-xl border border-purple-100 bg-white disabled:opacity-40 hover:bg-purple-50 transition-colors"
              >
                Next Page
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default MonthlyMagzine;
