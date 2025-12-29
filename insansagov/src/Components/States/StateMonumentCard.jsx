import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ChevronRight } from "lucide-react";

const StateMonumentCard = ({ state, region, img }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/state/government-jobs-in-${state}-for-12th-pass`);
    // If you later add slugs, you can do:
    // const slug = state.toLowerCase().replace(/\s+/g, "-");
    // navigate(`/state/government-jobs-in-${slug}-for-12th-pass`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={[
        "group relative flex flex-col overflow-hidden",
        "rounded-2xl border-2 main-site-border-color bg-white",
        "shadow-sm hover:shadow-[var(--shadow-accertinity)]",
        "transition-all duration-300 cursor-pointer",
        "hover:-translate-y-[2px]",
      ].join(" ")}
      aria-label={`Open government jobs and exams for ${state}`}
    >
      {/* Image wrapper */}
      <div className="relative h-44 sm:h-48 bg-gray-100 overflow-hidden">
        <img
          src={img || "/api/placeholder/400/320"}
          alt={`Upcoming government exams and jobs in ${state}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Bottom gradient overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-3 flex flex-col gap-2 z-10">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5">
            <MapPin className="h-3.5 w-3.5 text-purple-200" />
            <span className="text-[11px] font-medium text-purple-100">
              {region} Region
            </span>
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white leading-snug line-clamp-1">
          {state}
        </h3>

        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] sm:text-xs text-gray-100 line-clamp-1">
            Explore government jobs & exams in {state}
          </p>

          <span
            className={[
              "inline-flex items-center gap-1",
              "rounded-full px-3 py-1 text-[11px] font-semibold",
              "main-site-color secondary-site-text-color",
              "group-hover:main-site-color-hover transition-colors",
            ].join(" ")}
          >
            View Jobs
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </button>
  );
};

export default StateMonumentCard;
