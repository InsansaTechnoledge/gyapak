import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../Context/ApiContext";
import { Link } from "react-router-dom";
import { Briefcase, ArrowRight, Building2, CalendarDays } from "lucide-react";
import { generateSlugUrl } from "../../Utils/urlUtils.utils";

export default function RecentVacencies() {
  const { apiBaseUrl } = useApi();

  const { data, error, isFetching, isLoading } = useQuery({
    queryKey: ["recent-vacancies"],
    queryFn: async () => {
      const res = await axios.get(
        `${apiBaseUrl}/api/event/getTodaysEvents?page=1&limit=3`
      );
      return res.data;
    },
    staleTime: 3000,
    refetchOnWindowFocus: false,
  });

  if (isLoading || isFetching) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <p className="text-sm text-gray-600">
            Fetching today&apos;s vacancies…
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white/70 shadow-sm p-4 animate-pulse space-y-3"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-10 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-sm text-red-600">
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
          <h2 className="font-semibold text-xl md:text-2xl text-gray-900 flex items-center gap-2">
            {/* <Briefcase className="w-5 h-5 text-purple-600" /> */}
            Recent Vacancies
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Today&apos;s latest opportunities — open them to see full details.
          </p>
        </div>

        {hasVacancies && (
          <span className="hidden md:inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            New Update's Daily
          </span>
        )}
      </div>

      {!hasVacancies && (
        <div className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
          No vacancies were posted today. Check back later for new
          opportunities.
        </div>
      )}

      {hasVacancies && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {data.map((e, idx) => {
            const gyapakLink = generateLink(e);

            // Some optional meta fields – safely read if present
            const authority =
              e.authorityName ||
              e.organization?.name ||
              e.authority ||
              "Government / Public Sector";

            const dateLabel =
              e.publishedAt ||
              e.createdAt ||
              e.lastDate ||
              e.lastDateToApply ||
              null;

            const badgeLabel =
              idx === 0 ? "Hot Today" : idx === 1 ? "New" : "Just Added";

            return (
              <Link
                key={e._id}
                to={gyapakLink}
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
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500  to-purple-500" />

                {/* Content */}
                <div className="flex flex-col flex-1 p-4 pt-5 gap-3">
                  {/* Badge row */}
                  <div className="flex items-center justify-between gap-2">
                    {dateLabel && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                        <CalendarDays className="w-3 h-3" />
                        <span className="truncate max-w-[110px]">
                          {String(dateLabel).slice(0, 10)}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base md:text-[15px] font-semibold text-gray-900 leading-snug line-clamp-3 group-hover:text-purple-700 transition-colors">
                    {e.name}
                  </h3>

                  {/* Meta */}
                  <div className="flex items-start gap-2 text-xs text-gray-500 mt-1">
                    <Building2 className="w-3.5 h-3.5 mt-0.5 text-gray-400" />
                    <span className="line-clamp-2">{authority}</span>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* CTA row */}
                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <p className="text-xs font-medium text-gray-700 group-hover:text-purple-700">
                      View vacancy details
                    </p>
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-gray-100 text-gray-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

function generateLink(e) {
  return generateSlugUrl(e.name, e._id);
}
