import React, { lazy, Suspense, useMemo, useState } from "react";
import axios from "axios";
import { RingLoader } from "react-spinners";
import { useQuery } from "@tanstack/react-query";
import { useApi, CheckServer } from "../../Context/ApiContext";
import { CentralAuthoriyComponentTitle } from "../../constants/Constants";

const TopAuthoritiesCard = lazy(() => import("./TopAuthoritiesCard"));
const ViewMoreButton = lazy(() => import("../Buttons/ViewMoreButton"));

const PAGE_LIMIT = 8;

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

const SkeletonCard = () => (
  <div className="rounded-2xl border-2 main-site-border-color bg-white p-4">
    <div className="h-14 w-14 rounded-2xl light-site-color animate-pulse" />
    <div className="mt-3 h-4 w-3/4 rounded light-site-color animate-pulse" />
    <div className="mt-2 h-3 w-1/2 rounded light-site-color animate-pulse" />
  </div>
);

const TopAuthorities = ({ titleHidden }) => {
  const { apiBaseUrl, setApiBaseUrl, setServerError } = useApi();
  const [page, setPage] = useState(1);

  const fetchLogos = async ({ queryKey }) => {
    const [_key, base, p] = queryKey;
    if (!base) return { data: [], total: 0, page: p, limit: PAGE_LIMIT };

    try {
      const res = await axios.get(`${base}/api/organization/logo`, {
        params: { page: p, limit: PAGE_LIMIT },
      });

      if (res.status === 200) return res.data;
      return { data: [], total: 0, page: p, limit: PAGE_LIMIT };
    } catch (error) {
      console.error("Error fetching organizations:", error);

      // Server retry logic
      try {
        const shouldRetry =
          (error?.response?.status >= 500 && error?.response?.status < 600) ||
          ["ECONNREFUSED", "ETIMEDOUT", "ENOTFOUND", "ERR_NETWORK"].includes(error?.code);

        if (shouldRetry) {
          const url = await CheckServer();
          if (url) setApiBaseUrl(url);
          if (error?.response) setServerError(error.response.status);
        }
      } catch (e) {}

      return { data: [], total: 0, page: p, limit: PAGE_LIMIT };
    }
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["fetchLogos", apiBaseUrl, page],
    queryFn: fetchLogos,
    keepPreviousData: true,
    staleTime: 10 * 60 * 1000, // safer than Infinity for dynamic logos
    gcTime: 24 * 60 * 60 * 1000, // ✅ react-query v5
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!apiBaseUrl,
  });

  const organizations = data?.data || [];
  const total = Number(data?.total || 0);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  const canNext = page < totalPages;
  const canReset = page > 1;

  const title = useMemo(
    () => `${CentralAuthoriyComponentTitle} ${new Date().getFullYear()}`,
    []
  );

  const handleViewMore = () => canNext && setPage((p) => p + 1);
  const handleCloseAll = () => setPage(1);

  return (
    <>
      {/* HEADER */}
      {!titleHidden && (
        <Surface className="p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-black main-site-text-color">
                {title}
              </h1>
              <p className="text-xs utility-secondary-color mt-1">
                Explore top government authorities • Official sources
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="px-3 py-2 rounded-xl border main-site-border-color light-site-color-3">
                <p className="text-[10px] uppercase tracking-widest utility-secondary-color font-extrabold">
                  Total
                </p>
                <p className="text-lg font-black utility-site-color leading-6">
                  {total || "—"}
                </p>
              </div>

              <div className="px-3 py-2 rounded-xl border main-site-border-color light-site-color-3">
                <p className="text-[10px] uppercase tracking-widest utility-secondary-color font-extrabold">
                  Page
                </p>
                <p className="text-lg font-black utility-site-color leading-6">
                  {page} / {totalPages}
                </p>
              </div>

              {isFetching && (
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border main-site-border-color bg-white">
                  <RingLoader size={18} color={"#5B4BEA"} speedMultiplier={2} />
                  <span className="text-xs utility-secondary-color font-semibold">
                    Updating…
                  </span>
                </div>
              )}
            </div>
          </div>
        </Surface>
      )}

      {/* FIRST LOAD LOADER */}
      {isLoading ? (
        <div className="w-full flex justify-center py-12">
          <RingLoader size={60} color={"#5B4BEA"} speedMultiplier={2} />
        </div>
      ) : (
        <>
          {/* GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
            <Suspense
              fallback={
                <>
                  {Array.from({ length: PAGE_LIMIT }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </>
              }
            >
              {organizations.length > 0 ? (
                organizations.map((org) => (
                  <TopAuthoritiesCard
                    key={org._id}
                    name={org.abbreviation}
                    logo={org.logo}
                    id={org._id}
                  />
                ))
              ) : (
                <div className="col-span-full">
                  <Surface className="p-8 text-center">
                    <p className="font-bold utility-site-color">No authorities found</p>
                    <p className="text-sm utility-secondary-color mt-1">
                      Please try again later.
                    </p>
                  </Surface>
                </div>
              )}
            </Suspense>

            {/* Loading skeletons while fetching next page */}
            {isFetching &&
              Array.from({ length: Math.min(4, PAGE_LIMIT) }).map((_, i) => (
                <SkeletonCard key={`sk-${i}`} />
              ))}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-center gap-3 flex-wrap mb-16">
            <Suspense fallback={null}>
              {canNext && (
                <ViewMoreButton content="View More ▼" onClick={handleViewMore} />
              )}

              {canReset && (
                <ViewMoreButton content="Close All ▲" onClick={handleCloseAll} />
              )}
            </Suspense>
          </div>
        </>
      )}
    </>
  );
};

export default TopAuthorities;
