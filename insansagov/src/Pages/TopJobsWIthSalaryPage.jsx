import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  IndianRupee,
  Filter,
  RefreshCw,
  ExternalLink,
  Calendar,
  X,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PAGE_SIZE_DEFAULT = 10;

const TopJobsWIthSalaryPage = () => {
  const API_BASE_URL = "http://localhost:8383";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");

  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [sortBy, setSortBy] = useState("salaryDesc"); // salaryDesc | salaryAsc | dateAsc | dateDesc

  const [expanded, setExpanded] = useState(() => new Set());
  const [copied, setCopied] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);

  const fetchJobs = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`${API_BASE_URL}/api/event/with-salary`, {
        params: { type: "job"}, // limit: 100 
      });

      const data = res?.data?.data || res?.data || [];
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [query, minSalary, maxSalary, sortBy, pageSize]);

  const fmtINR = (n) => {
    if (!Number.isFinite(Number(n))) return "—";
    return `₹${Number(n).toLocaleString("en-IN")}`;
  };

  const fmtDateLong = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  };

  const fmtMonthTitle = (dateStr) => {
    if (!dateStr) return "Unknown Month";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "Unknown Month";
    return new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(d);
  };

  const parseNum = (v) => {
    if (v === null || v === undefined || v === "") return null;
    const n = Number(String(v).replace(/[^\d]/g, ""));
    return Number.isFinite(n) ? n : null;
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copyText = async (text, key) => {
    try {
      await navigator.clipboard.writeText(String(text));
      setCopied(key);
      setTimeout(() => setCopied(null), 900);
    } catch {
      // ignore
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = parseNum(minSalary);
    const max = parseNum(maxSalary);

    let data = [...rows];

    // search by name or salary text
    if (q) {
      data = data.filter((r) => {
        const name = (r?.name || "").toLowerCase();
        const salaryText = (r?.salaryCandidates || [])
          .map((c) => `${c?.key || ""} ${c?.text || ""}`.toLowerCase())
          .join(" ");
        return name.includes(q) || salaryText.includes(q);
      });
    }

    // salary range filter using overlap logic
    if (min !== null || max !== null) {
      data = data.filter((r) => {
        const sMin = Number.isFinite(Number(r?.salaryMin)) ? Number(r.salaryMin) : null;
        const sMax = Number.isFinite(Number(r?.salaryMax)) ? Number(r.salaryMax) : null;

        if (sMin === null || sMax === null) return false;

        const passMin = min === null ? true : sMax >= min;
        const passMax = max === null ? true : sMin <= max;
        return passMin && passMax;
      });
    }

    // Month bucket sort (latest month first) then apply sortBy inside month
    data.sort((a, b) => {
      const aD = a?.date_of_commencement ? new Date(a.date_of_commencement) : null;
      const bD = b?.date_of_commencement ? new Date(b.date_of_commencement) : null;

      const aBucket = aD ? aD.getFullYear() * 12 + aD.getMonth() : -Infinity;
      const bBucket = bD ? bD.getFullYear() * 12 + bD.getMonth() : -Infinity;

      if (aBucket !== bBucket) return bBucket - aBucket;

      const aMin = Number(a?.salaryMin || 0);
      const aMax = Number(a?.salaryMax || 0);
      const bMin = Number(b?.salaryMin || 0);
      const bMax = Number(b?.salaryMax || 0);

      const aTime = aD ? aD.getTime() : 0;
      const bTime = bD ? bD.getTime() : 0;

      switch (sortBy) {
        case "salaryAsc":
          return (aMin || aMax) - (bMin || bMax);
        case "dateAsc":
          return aTime - bTime;
        case "dateDesc":
          return bTime - aTime;
        case "salaryDesc":
        default:
          return bMax - aMax;
      }
    });

    return data;
  }, [rows, query, minSalary, maxSalary, sortBy]);

  const stats = useMemo(() => {
    const count = filtered.length;
    const withNumeric = filtered.filter((r) => r?.salaryMin != null && r?.salaryMax != null).length;
    return { count, withNumeric };
  }, [filtered]);

  // Pagination derived
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filtered.length / pageSize));
  }, [filtered.length, pageSize]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const pageNumbers = useMemo(() => {
    // compact pager: show 1..n but limited window
    const maxButtons = 5;
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);

    const arr = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }, [page, totalPages]);

  // Group paged results by month title (for engagement + clarity)
  const groupedPaged = useMemo(() => {
    const map = new Map();
    for (const item of paged) {
      const key = fmtMonthTitle(item?.date_of_commencement);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    }
    return Array.from(map.entries()); // [ [monthTitle, items], ... ]
  }, [paged]);

  const setQuickMin = (value) => {
    setMinSalary(String(value));
  };

  return (
    <div className="min-h-screen mt-40 mb-20 px-4 sm:px-6 md:px-8 py-6">
      <div className="mx-auto ">
        {/* HERO HEADER */}
        <div className="rounded-3xl border main-site-border-color-3 shadow-lg overflow-hidden">
          <div className="p-5 sm:p-6 md:p-7 light-site-color-3">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border main-site-border-color-3 bg-white/50">
                  {/* <Sparkles className="w-4 h-4 utility-site-color" /> */}
                  <span className="text-xs sm:text-sm utility-secondary-color">
                    Salary-based Job Explorer
                  </span>
                </div>

                <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold main-site-text-color">
                  Top Jobs with Salary
                </h1>

                {/* <p className="mt-2 utility-secondary-color text-sm sm:text-base max-w-2xl">
                  Search + filter by salary. Results are grouped month-wise (latest first) to match how candidates apply in real life.
                </p> */}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full border main-site-border-color-3 bg-white/50 text-xs utility-secondary-color">
                    Results: <span className="font-semibold main-site-text-color">{stats.count}</span>
                  </span>
                  <span className="px-3 py-1 rounded-full border main-site-border-color-3 bg-white/50 text-xs utility-secondary-color">
                    With salary mentioned:{" "}
                    <span className="font-semibold main-site-text-color">{stats.withNumeric}</span>
                  </span>
                </div>
              </div>

              <button
                onClick={fetchJobs}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                           border main-site-border-color-3 bg-white/60 hover:bg-white/80 transition"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                <span className="text-sm font-medium">Refresh</span>
              </button>
            </div>

            {error ? (
              <div className="mt-4 p-3 rounded-xl border main-site-border-color-3 bg-white/60">
                <p className="text-sm main-site-text-error-color">{error}</p>
              </div>
            ) : null}
          </div>

          {/* Sticky filters */}
          <div className="p-4 sm:p-5 md:p-6 border-t main-site-border-color-3 bg-transparent sticky top-0 z-20 backdrop-blur">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 utility-secondary-color" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search jobs (e.g., librarian, engineer, level-12)"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border main-site-border-color-3
                               bg-transparent main-site-text-color placeholder:opacity-60 outline-none
                               focus:ring-2 focus:ring-purple-500/30"
                  />
                  {query ? (
                    <button
                      onClick={() => setQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:light-site-color-3"
                      title="Clear"
                    >
                      <X className="w-4 h-4 utility-secondary-color" />
                    </button>
                  ) : null}
                </div>

                {/* quick chips */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    { label: "₹20k+", value: 20000 },
                    { label: "₹50k+", value: 50000 },
                    { label: "₹1L+", value: 100000 },
                    { label: "₹2L+", value: 200000 },
                  ].map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setQuickMin(c.value)}
                      className="px-3 py-1.5 rounded-full text-xs border main-site-border-color-3 light-site-color-3 hover:opacity-90 transition"
                    >
                      {c.label}
                    </button>
                  ))}
                  {(minSalary || maxSalary) && (
                    <button
                      onClick={() => {
                        setMinSalary("");
                        setMaxSalary("");
                      }}
                      className="px-3 py-1.5 rounded-full text-xs border main-site-border-color-3 bg-white/60 hover:bg-white/80 transition inline-flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      Clear salary
                    </button>
                  )}
                </div>
              </div>

              {/* Salary filter + sort + page size */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 utility-secondary-color" />
                  <input
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    inputMode="numeric"
                    placeholder="Min salary"
                    className="w-full sm:w-40 pl-10 pr-3 py-2.5 rounded-xl border main-site-border-color-3
                               bg-transparent main-site-text-color placeholder:opacity-60 outline-none
                               focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>

                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 utility-secondary-color" />
                  <input
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value)}
                    inputMode="numeric"
                    placeholder="Max salary"
                    className="w-full sm:w-40 pl-10 pr-3 py-2.5 rounded-xl border main-site-border-color-3
                               bg-transparent main-site-text-color placeholder:opacity-60 outline-none
                               focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>

                {/* <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 utility-secondary-color" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-52 pl-10 pr-3 py-2.5 rounded-xl border main-site-border-color-3
                               bg-transparent main-site-text-color outline-none
                               focus:ring-2 focus:ring-purple-500/30"
                  >
                    <option value="salaryDesc">Salary (High → Low)</option>
                    <option value="salaryAsc">Salary (Low → High)</option>
                    <option value="dateAsc">Date (Old → New)</option>
                    <option value="dateDesc">Date (New → Old)</option>
                  </select>
                </div> */}

                <div className="relative">
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
                    className="w-full sm:w-28 px-3 py-2.5 rounded-xl border main-site-border-color-3
                               bg-transparent main-site-text-color outline-none
                               focus:ring-2 focus:ring-purple-500/30"
                    title="Items per page"
                  >
                    <option value={10}>10 / page</option>
                    <option value={20}>20 / page</option>
                    <option value={50}>50 / page</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LIST */}
        <div className="mt-6 space-y-5">
          {loading ? (
            <div className="rounded-2xl border main-site-border-color-3 p-6 light-site-color-3">
              <p className="utility-secondary-color">Loading salary-based jobs…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border main-site-border-color-3 p-6 light-site-color-3">
              <p className="utility-secondary-color">
                No jobs found. Try clearing filters or lowering the min salary.
              </p>
            </div>
          ) : (
            groupedPaged.map(([monthTitle, items]) => (
              <div key={monthTitle} className="space-y-3">
                {/* Month header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-sm sm:text-base font-semibold main-site-text-color">
                    {monthTitle}
                  </h2>
                  <span className="text-xs utility-secondary-color">
                    {items.length} job{items.length > 1 ? "s" : ""}
                  </span>
                </div>

                {/* Month jobs */}
                <div className="space-y-4">
                  {items.map((job) => {
                    const id = job?._id;
                    const isExpanded = expanded.has(id);

                    const salaryLabel =
                      job?.salaryMin != null || job?.salaryMax != null
                        ? `${fmtINR(job?.salaryMax)}`
                        : "Salary info available (text)";

                    return (
                      <div
                        key={id}
                        className="rounded-2xl border main-site-border-color-3 shadow-lg overflow-hidden"
                      >
                        {/* Card header */}
                        <div className="p-4 sm:p-5 md:p-6">
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div className="min-w-0">
                              <h3 className="text-lg sm:text-xl font-semibold main-site-text-color break-words">
                                {job?.name || "Untitled Job"}
                              </h3>

                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full light-site-color-3 border main-site-border-color-3 text-xs utility-secondary-color">
                                  <Calendar className="w-4 h-4" />
                                  Commencement:{" "}
                                  <span className="font-semibold main-site-text-color">
                                    {fmtDateLong(job?.date_of_commencement)}
                                  </span>
                                </span>

                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full light-site-color-3 border main-site-border-color-3 text-xs utility-secondary-color">
                                  <IndianRupee className="w-4 h-4" />
                                  <span className="font-semibold main-site-text-color">
                                    {salaryLabel}
                                  </span>
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <a
                                href={job?.apply_link || "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl
                                           bg-purple-600 text-white hover:opacity-90 transition"
                              >
                                Apply
                                <ExternalLink className="w-4 h-4" />
                              </a>

                              <button
                                onClick={() => toggleExpand(id)}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl
                                           border main-site-border-color-3 light-site-color-3 hover:opacity-90 transition"
                              >
                                {isExpanded ? "Hide salary fields" : "View salary fields"}
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Accordion body */}
                        {isExpanded && (
                          <div className="border-t main-site-border-color-3">
                            <div className="p-4 sm:p-5 md:p-6">
                              <div className="overflow-x-auto">
                                <table className="w-full min-w-[720px] border-collapse border main-site-border-color-3 rounded-xl overflow-hidden">
                                  <thead className="light-site-color-3">
                                    <tr>
                                      <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold main-site-text-color border-b main-site-border-color-3 w-[35%]">
                                        Field
                                      </th>
                                      <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold main-site-text-color border-b main-site-border-color-3">
                                        Value
                                      </th>
                                      <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold main-site-text-color border-b main-site-border-color-3 w-[120px]">
                                        Action
                                      </th>
                                    </tr>
                                  </thead>

                                  <tbody className="divide-y main-site-border-color-3">
                                    {(job?.salaryCandidates || []).map((c, idx) => {
                                      const key = `${id}-${idx}`;
                                      const text = c?.text || "";
                                      return (
                                        <tr
                                          key={key}
                                          className={
                                            idx % 2 === 0
                                              ? "bg-transparent"
                                              : "light-site-color-3 bg-opacity-30"
                                          }
                                        >
                                          <td className="px-4 py-3 text-sm font-medium main-site-text-color align-top">
                                            {c?.key || "—"}
                                          </td>
                                          <td className="px-4 py-3 text-sm utility-secondary-color align-top break-words">
                                            {text || "—"}
                                          </td>
                                          <td className="px-4 py-3 align-top">
                                            <button
                                              onClick={() => copyText(text, key)}
                                              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl
                                                         border main-site-border-color-3 light-site-color-3 hover:opacity-90 transition"
                                            >
                                              {copied === key ? (
                                                <Check className="w-4 h-4 utility-site-color" />
                                              ) : (
                                                <Copy className="w-4 h-4 utility-secondary-color" />
                                              )}
                                              <span className="text-xs utility-secondary-color">
                                                {copied === key ? "Copied" : "Copy"}
                                              </span>
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* PAGINATION */}
        {!loading && filtered.length > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm utility-secondary-color">
              Showing{" "}
              <span className="font-semibold main-site-text-color">
                {(page - 1) * pageSize + 1}
              </span>{" "}
              –{" "}
              <span className="font-semibold main-site-text-color">
                {Math.min(page * pageSize, filtered.length)}
              </span>{" "}
              of <span className="font-semibold main-site-text-color">{filtered.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border main-site-border-color-3
                           light-site-color-3 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>

              {pageNumbers[0] > 1 && (
                <>
                  <button
                    onClick={() => setPage(1)}
                    className="px-3 py-2 rounded-xl border main-site-border-color-3 light-site-color-3 hover:opacity-90 transition text-sm"
                  >
                    1
                  </button>
                  <span className="px-2 utility-secondary-color">…</span>
                </>
              )}

              {pageNumbers.map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-2 rounded-xl border main-site-border-color-3 text-sm transition ${
                    p === page
                      ? "bg-purple-600 text-white"
                      : "light-site-color-3 hover:opacity-90"
                  }`}
                >
                  {p}
                </button>
              ))}

              {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                  <span className="px-2 utility-secondary-color">…</span>
                  <button
                    onClick={() => setPage(totalPages)}
                    className="px-3 py-2 rounded-xl border main-site-border-color-3 light-site-color-3 hover:opacity-90 transition text-sm"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border main-site-border-color-3
                           light-site-color-3 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopJobsWIthSalaryPage;
