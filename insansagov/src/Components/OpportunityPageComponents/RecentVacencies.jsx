import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../Context/ApiContext";
import { ArrowRight, Building2, CalendarDays } from "lucide-react";
import { useEventRouting } from "../../Utils/useEventRouting";

export default function RecentVacencies() {
  const { apiBaseUrl } = useApi();

  const { getEventHref, handleEventClick, prefetchEventRoute } = useEventRouting({
    fallback: "old",
  });

  const { data, error, isFetching, isLoading } = useQuery({
    queryKey: ["recent-vacancies", apiBaseUrl],
    queryFn: async () => {
      const res = await axios.get(
        `${apiBaseUrl}/api/event/getTodaysEvents?page=1&limit=3`,
        { withCredentials: true }
      );
      return res.data;
    },
    enabled: !!apiBaseUrl,
    staleTime: 3000,
    refetchOnWindowFocus: false,
  });

  if (isLoading || isFetching) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-2 w-2 rounded-full support-component-bg-color-green animate-pulse" />
          <p className="text-sm utility-secondary-color">Fetching today&apos;s vacancies…</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white/70 shadow-sm p-4 animate-pulse space-y-3"
            >
              <div className="h-4 light-site-color-2 rounded w-3/4" />
              <div className="h-3 light-site-color-2 rounded w-1/2" />
              <div className="h-10 light-site-color rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-sm main-site-text-error-color">
          Something went wrong while loading vacancies:{" "}
          <span className="font-mono">{error.message}</span>
        </p>
      </div>
    );
  }

  const hasVacancies = Array.isArray(data) && data.length > 0;

  return (
    <section className="p-4">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-xl md:text-2xl utility-site-color flex items-center gap-2">
            Recent Vacancies
          </h2>
          <p className="text-sm utility-secondary-color mt-1">
            Today&apos;s latest opportunities — open them to see full details.
          </p>
        </div>

        {hasVacancies && (
          <span className="hidden md:inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full support-component-bg-color-green text-green-700 border border-green-200">
            <span className="h-2 w-2 rounded-full main-site-color-2 animate-pulse" />
            New Update&apos;s Daily
          </span>
        )}
      </div>

      {!hasVacancies && (
        <div className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm utility-secondary-color">
          No vacancies were posted today. Check back later for new opportunities.
        </div>
      )}

      {hasVacancies && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {data.map((e, idx) => {
            const authority =
              e.authorityName ||
              e.organization?.name ||
              e.authority ||
              "Government / Public Sector";

            const dateLabel =
              e.publishedAt || e.createdAt || e.lastDate || e.lastDateToApply || null;

            return (
              <a
                key={e._id}
                href={getEventHref(e)}                       
                onClick={(ev) => handleEventClick(ev, e)}    
                onMouseEnter={() => prefetchEventRoute(e)}   
                className={`
                  group relative flex flex-col h-full
                  rounded-2xl border border-gray-200 bg-white/90
                  shadow-[0_8px_20px_rgba(15,23,42,0.08)]
                  overflow-hidden
                  transition-all duration-300 ease-out
                  hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(15,23,42,0.18)]
                  focus:outline-none focus:ring-2 focus:ring-purple-500/70
                `}
              >
                {/* Top accent bar */}
                <div className="absolute inset-x-0 top-0 h-1 main-site-color" />

                <div className="flex flex-col flex-1 p-4 pt-5 gap-3">
                  {/* Date */}
                  <div className="flex items-center justify-between gap-2">
                    {dateLabel && (
                      <span className="inline-flex items-center gap-1 text-[11px] main-site-text-color-2">
                        <CalendarDays className="w-3 h-3" />
                        <span className="truncate max-w-[110px]">
                          {String(dateLabel).slice(0, 10)}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base md:text-[15px] font-semibold utility-site-color leading-snug line-clamp-3 group-hover:main-site-text-color transition-colors">
                    {e.name}
                  </h3>

                  {/* Authority */}
                  <div className="flex items-start gap-2 text-xs main-site-text-color-2 mt-1">
                    <Building2 className="w-3.5 h-3.5 mt-0.5 text-gray-400" />
                    <span className="line-clamp-2">{authority}</span>
                  </div>

                  <div className="flex-1" />

                  {/* CTA row */}
                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <p className="text-xs font-medium text-gray-700 group-hover:main-site-text-color">
                      View vacancy details
                    </p>
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-gray-100 text-gray-700 group-hover:main-site-color group-hover:text-white transition-colors">
                      <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
