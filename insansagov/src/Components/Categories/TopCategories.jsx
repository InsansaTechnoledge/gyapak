import React, { lazy, Suspense, useMemo } from "react";
import axios from "axios";
import { RingLoader } from "react-spinners";
import { useQuery } from "@tanstack/react-query";
import { useApi, CheckServer } from "../../Context/ApiContext";
import { TopCategoriesComponentTitle } from "../../constants/Constants";

const TopCategoriesCard = lazy(() => import("./TopCategoriesCard"));

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
    <div className="h-10 w-10 rounded-2xl light-site-color animate-pulse" />
    <div className="mt-3 h-4 w-3/4 rounded light-site-color animate-pulse" />
    <div className="mt-2 h-3 w-1/2 rounded light-site-color animate-pulse" />
  </div>
);

const TopCategories = ({ titleHidden }) => {
  const { apiBaseUrl, setApiBaseUrl, setServerError } = useApi();

  const fetchCategories = async () => {
    if (!apiBaseUrl) return [];

    try {
      const response = await axios.get(`${apiBaseUrl}/api/category/getCategories`);

      // support both 200 and 201
      if (response.status === 200 || response.status === 201) {
        return Array.isArray(response.data) ? response.data : response.data?.data || [];
      }

      return [];
    } catch (error) {
      console.error("Error fetching categories:", error);

      if (error.response || error.request) {
        const shouldRetry =
          (error.response &&
            error.response.status >= 500 &&
            error.response.status < 600) ||
          ["ECONNREFUSED", "ETIMEDOUT", "ENOTFOUND", "ERR_NETWORK"].includes(error.code);

        if (shouldRetry) {
          try {
            const url = await CheckServer();
            if (url) setApiBaseUrl(url);
            if (error.response) setServerError(error.response.status);
          } catch (e) {
            console.error("CheckServer failed:", e);
          }
        } else {
          console.error("Error fetching categories (client issue):", error);
        }
      } else {
        console.error("Unknown error fetching categories:", error);
      }

      return [];
    }
  };

  const {
    data: categories = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["fetchCategories", apiBaseUrl],
    queryFn: fetchCategories,
    enabled: !!apiBaseUrl,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 24 * 60 * 60 * 1000, // react-query v5
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const totalCategories = useMemo(() => categories.length, [categories]);

  // FIRST LOAD
  if (isLoading && !categories.length) {
    return (
      <div className="w-full flex flex-col justify-center mb-10">
        <h1 className="flex secondary-site-text-color py-4 main-site-color rounded-full text-center text-2xl justify-center mb-5 font-bold">
          {TopCategoriesComponentTitle}
        </h1>
        <div className="flex justify-center">
          <RingLoader
            size={60}
            color={"#5B4BEA"}
            speedMultiplier={2}
            className="my-auto"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* HEADER CARD */}
      {!titleHidden && (
        <Surface className="p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-black main-site-text-color">
                {TopCategoriesComponentTitle}
              </h1>
              <p className="text-xs utility-secondary-color mt-1">
                Browse categories to quickly explore government exams, jobs and updates.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="px-3 py-2 rounded-xl border main-site-border-color light-site-color-3">
                <p className="text-[10px] uppercase tracking-widest utility-secondary-color font-extrabold">
                  Total Categories
                </p>
                <p className="text-lg font-black utility-site-color leading-6">
                  {totalCategories || "—"}
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

      {/* GRID */}
      <div className="grid mt-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 mb-10 gap-4">
        <Suspense
          fallback={
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </>
          }
        >
          {categories.length > 0 ? (
            categories.map((category) => (
              <TopCategoriesCard
                key={category._id}
                name={category.category}
                logo={category.logo}
                id={category._id}
              />
            ))
          ) : (
            <div className="col-span-full">
              <Surface className="p-8 text-center">
                <p className="font-bold utility-site-color">No categories found</p>
                <p className="text-sm utility-secondary-color mt-1">
                  Please check back later. New categories will appear here as they are added.
                </p>
              </Surface>
            </div>
          )}
        </Suspense>

        {/* extra skeletons while refetching in background */}
        {isFetching &&
          categories.length > 0 &&
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
      </div>
    </>
  );
};

export default TopCategories;
