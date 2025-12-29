import React, { useEffect, useMemo, useState, Suspense, lazy } from "react";
import axios from "axios";
import { RingLoader } from "react-spinners";
import { useApi } from "../../Context/ApiContext";
import { useQuery } from "@tanstack/react-query";
import {
  LatestUpdatesDescription,
  LatestUpdatesTitle,
} from "../../constants/Constants";
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const LatestUpdateCard = lazy(() => import("./LatestUpdateCard"));

const Surface = ({ className = "", children }) => (
  <div
    className={[
      "bg-white/90 backdrop-blur",
      "border-2 main-site-border-color",
      "rounded-2xl",
      "shadow-[var(--shadow-accertinity)]",
      className,
    ].join(" ")}
  >
    {children}
  </div>
);

const Chip = ({ active, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      "px-3 py-1.5 rounded-full text-xs font-extrabold border transition",
      active
        ? "main-site-color secondary-site-text-color main-site-border-color-4"
        : "bg-white utility-secondary-color border main-site-border-color hover:light-site-color-3",
    ].join(" ")}
  >
    {children}
  </button>
);

const SkeletonCard = () => (
  <div className="rounded-2xl border-2 main-site-border-color bg-white p-4 animate-pulse">
    <div className="h-4 w-3/4 rounded bg-gray-200" />
    <div className="mt-3 h-3 w-1/2 rounded bg-gray-200" />
    <div className="mt-4 h-9 w-28 rounded bg-gray-200" />
  </div>
);

const getPageButtons = (current, total) => {
  // smart pagination: [1] ... [c-1,c,c+1] ... [total]
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const set = new Set([1, total, current - 1, current, current + 1]);
  const arr = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);

  // insert ellipsis markers as 0
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    out.push(arr[i]);
    if (i < arr.length - 1 && arr[i + 1] - arr[i] > 1) out.push(0);
  }
  return out;
};

const LatestUpdates = ({ titleHidden }) => {
  const { apiBaseUrl, setApiBaseUrl, setServerError } = useApi();

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // new UI states
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | result | admit | job

  const fetchLatestUpdates = async () => {
    const response = await axios.get(`${apiBaseUrl}/api/event/latest`, {
      withCredentials: true,
    });

    if (response.status === 201 || response.status === 200) {
      const sortedUpdates = (response.data || []).sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.date_of_notification);
        const dateB = new Date(b.updatedAt || b.date_of_notification);
        if (isNaN(dateA) || isNaN(dateB)) return 0;
        return dateB - dateA;
      });

      return sortedUpdates.slice(0, 100);
    }

    return [];
  };

  const {
    data: latestUpdates = [],
    isLoading,
    isFetching,
    refetch,
    error,
  } = useQuery({
    queryKey: ["latestUpdates", apiBaseUrl],
    queryFn: fetchLatestUpdates,
    enabled: !!apiBaseUrl,
    staleTime: 5 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [latestUpdates?.length, search, filter]);

  const filteredUpdates = useMemo(() => {
    const q = search.trim().toLowerCase();

    return (latestUpdates || []).filter((u) => {
      const name = `${u?.name || ""}`.toLowerCase();
      const org = `${u?.organizationName || ""}`.toLowerCase();

      const matchesSearch = !q || name.includes(q) || org.includes(q);

      const hay = `${u?.name || ""} ${u?.event_type || ""} ${u?.category || ""}`.toLowerCase();
      const matchesFilter =
        filter === "all"
          ? true
          : filter === "result"
          ? hay.includes("result")
          : filter === "admit"
          ? hay.includes("admit")
          : filter === "job"
          ? hay.includes("job") || hay.includes("recruit")
          : true;

      return matchesSearch && matchesFilter;
    });
  }, [latestUpdates, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredUpdates.length / ITEMS_PER_PAGE));

  const pagedUpdates = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUpdates.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUpdates, currentPage]);

  const goToPage = (page) => {
    const next = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageButtons = useMemo(
    () => getPageButtons(currentPage, totalPages),
    [currentPage, totalPages]
  );

  // --- Loading UI (nice skeleton) ---
  if (isLoading) {
    return (
      <div className="mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <Surface className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-5 w-52 bg-gray-200 rounded animate-pulse" />
              <div className="mt-2 h-3 w-80 bg-gray-200 rounded animate-pulse" />
            </div>
            <RingLoader size={36} />
          </div>
        </Surface>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-10 py-8">
      {/* HEADER / TOOLBAR */}
      {!titleHidden && (
        <Surface className="p-5 top-24 z-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-black main-site-text-color truncate">
                  {LatestUpdatesTitle}
                </h1>

                {isFetching ? (
                  <span className="text-[11px] font-extrabold px-2 py-1 rounded-full border main-site-border-color light-site-color-3 utility-secondary-color">
                    Updating…
                  </span>
                ) : (
                  <span className="text-[11px] font-extrabold px-2 py-1 rounded-full border main-site-border-color light-site-color-3 utility-secondary-color">
                    Updated
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm utility-secondary-color max-w-2xl">
                {LatestUpdatesDescription}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px]">
                <span className="px-3 py-1 rounded-full border main-site-border-color light-site-color-3 utility-secondary-color">
                  Total:{" "}
                  <span className="font-black main-site-text-color">
                    {filteredUpdates.length}
                  </span>
                </span>
                <span className="px-3 py-1 rounded-full border main-site-border-color light-site-color-3 utility-secondary-color">
                  Page:{" "}
                  <span className="font-black main-site-text-color">
                    {currentPage}/{totalPages}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              {/* Search */}
              <div className="relative w-full sm:w-[320px]">
                <Search className="w-4 h-4 utility-secondary-color absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search updates (exam/organization)"
                  className={[
                    "w-full pl-10 pr-3 py-2.5 rounded-xl text-sm outline-none",
                    "border-2 main-site-border-color bg-white",
                    "focus:main-site-border-color-4 transition",
                  ].join(" ")}
                />
              </div>

              {/* Refresh */}
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 main-site-border-color bg-white hover:light-site-color-3 transition font-extrabold text-sm main-site-text-color"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Filter chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Chip active={filter === "all"} onClick={() => setFilter("all")}>
              All
            </Chip>
            <Chip active={filter === "result"} onClick={() => setFilter("result")}>
              Results
            </Chip>
            <Chip active={filter === "admit"} onClick={() => setFilter("admit")}>
              Admit Cards
            </Chip>
            <Chip active={filter === "job"} onClick={() => setFilter("job")}>
              Jobs
            </Chip>
          </div>

          {/* Optional: error line */}
          {error ? (
            <div className="mt-3 text-sm text-red-600">
              Something went wrong while loading updates.
            </div>
          ) : null}
        </Surface>
      )}

      {/* LIST */}
      {!titleHidden && (
        <div className="mt-6">
          {pagedUpdates.length === 0 ? (
            <Surface className="p-6">
              <p className="font-extrabold utility-site-color">
                No updates found.
              </p>
              <p className="text-sm utility-secondary-color mt-1">
                Try changing filters or search keyword.
              </p>
            </Surface>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Suspense
                fallback={
                  <div className="col-span-full">
                    <Surface className="p-6 flex items-center justify-center gap-3">
                      <RingLoader size={28} />
                      <span className="text-sm utility-secondary-color">
                        Loading cards…
                      </span>
                    </Surface>
                  </div>
                }
              >
                {pagedUpdates.map((update, index) => (
                  <LatestUpdateCard
                    key={update._id || index}
                    id={update._id}
                    name={update.name}
                    date={update.updatedAt || update.date_of_notification}
                    organization={update.organizationName}
                    apply_link={update.apply_link}
                  />
                ))}
              </Suspense>
            </div>
          )}
        </div>
      )}

      {/* PAGINATION */}
      {!titleHidden && filteredUpdates.length > ITEMS_PER_PAGE && (
        <Surface className="mt-6 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm utility-secondary-color">
              Showing{" "}
              <span className="font-black main-site-text-color">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              –{" "}
              <span className="font-black main-site-text-color">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredUpdates.length)}
              </span>{" "}
              of{" "}
              <span className="font-black main-site-text-color">
                {filteredUpdates.length}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className={[
                  "h-10 w-10 rounded-xl border-2 flex items-center justify-center",
                  currentPage === 1
                    ? "light-site-color utility-secondary-color cursor-not-allowed border main-site-border-color"
                    : "bg-white hover:light-site-color-3 border main-site-border-color",
                ].join(" ")}
                aria-label="First page"
                title="First"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={[
                  "h-10 w-10 rounded-xl border-2 flex items-center justify-center",
                  currentPage === 1
                    ? "light-site-color utility-secondary-color cursor-not-allowed border main-site-border-color"
                    : "bg-white hover:light-site-color-3 border main-site-border-color",
                ].join(" ")}
                aria-label="Previous page"
                title="Prev"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {pageButtons.map((p, idx) =>
                p === 0 ? (
                  <span key={`dots-${idx}`} className="px-1 utility-secondary-color">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={[
                      "h-10 w-10 rounded-xl border-2 text-sm font-extrabold transition",
                      p === currentPage
                        ? "main-site-color secondary-site-text-color main-site-border-color-4"
                        : "bg-white utility-secondary-color border main-site-border-color hover:light-site-color-3",
                    ].join(" ")}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={[
                  "h-10 w-10 rounded-xl border-2 flex items-center justify-center",
                  currentPage === totalPages
                    ? "light-site-color utility-secondary-color cursor-not-allowed border main-site-border-color"
                    : "bg-white hover:light-site-color-3 border main-site-border-color",
                ].join(" ")}
                aria-label="Next page"
                title="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className={[
                  "h-10 w-10 rounded-xl border-2 flex items-center justify-center",
                  currentPage === totalPages
                    ? "light-site-color utility-secondary-color cursor-not-allowed border main-site-border-color"
                    : "bg-white hover:light-site-color-3 border main-site-border-color",
                ].join(" ")}
                aria-label="Last page"
                title="Last"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Surface>
      )}
    </div>
  );
};

export default LatestUpdates;
