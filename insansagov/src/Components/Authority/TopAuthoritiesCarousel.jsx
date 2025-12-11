// 👇 add this at the very top of the file (module scope)
let lastScrollLeft = 0;

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const TopAuthoritiesCarousel = ({
  organizations,
  onLoadMore,
  hasMore,
  isFetchingMore,
}) => {
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);
  const hasMoreRef = useRef(hasMore);
  const loadMoreRef = useRef(onLoadMore);
  const loadingTriggeredRef = useRef(false);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    loadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  const handleCardClick = (name) => {
    navigate(
      `/organization/government-competitive-exams-after-12th/${encodeURI(name)}`
    );
  };

  //  On mount, restore previous scroll position
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = lastScrollLeft || 0;
  }, []);

  //  Main auto-scroll loop
  useEffect(() => {
    const el = scrollRef.current;

    // Safety check: if paused or component unmounted
    if (!el || isPaused) return;

    let animationFrameId;
    // Slower speed on mobile for better readability
    const scrollSpeed = window.innerWidth < 768 ? 0.5 : 0.8;

    const scroll = () => {
      const node = scrollRef.current;
      if (!node) return;
      // If user is manually scrolling (touching), do not auto-scroll
      if (isPaused) return;

      const maxScroll = node.scrollWidth - node.clientWidth;
      const current = node.scrollLeft;
      const next = Math.min(current + scrollSpeed, maxScroll);

      node.scrollLeft = next;
      lastScrollLeft = next;

      // Trigger load more logic
      if (
        hasMoreRef.current &&
        !loadingTriggeredRef.current &&
        next > maxScroll * 0.7
      ) {
        loadingTriggeredRef.current = true;
        loadMoreRef.current && loadMoreRef.current();
      }

      if (next < maxScroll * 0.5) {
        loadingTriggeredRef.current = false;
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused]);

  const displayOrganizations = organizations;

  return (
    <div className="w-full mb-16 relative group">
      <div
        ref={scrollRef}
        // Desktop Pause interactions
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        // Mobile Pause interactions (Critical for fixing overflow/fighting feel)
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex gap-4 md:gap-8 overflow-x-auto overflow-hidden no-scrollbar py-4 md:py-8 px-2 md:px-4 w-full max-w-full"
        style={{
          paddingLeft: "1rem", // Add explicit padding
          paddingRight: "1rem", // Add explicit padding
          scrollBehavior: "auto",
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }}
      >
        {displayOrganizations.map((org, index) => (
          <div
            key={`${org._id}-${index}`}
            onClick={() => handleCardClick(org.abbreviation)}
            className="flex-shrink-0 w-24 md:w-28 
               flex flex-col items-center justify-center 
               bg-transparent rounded-lg p-2 md:p-4 
               hover:scale-110 transition-all duration-300 cursor-pointer"
          >
            <div className="h-14 w-14 md:h-20 md:w-20 flex items-center justify-center overflow-hidden">
              <img
                className="max-h-full max-w-full object-contain"
                src={org.logo}
                alt={`${org.abbreviation} Logo`}
                loading="lazy"
              />
            </div>
            <p
              className="mt-2 md:mt-3 text-gray-900 font-medium 
                  text-[10px] md:text-sm text-center 
                  max-w-[72px] md:max-w-none 
                  overflow-hidden leading-tight"
            >
              {org.abbreviation}
            </p>
          </div>
        ))}

        {/* Loading Indicator inside the flex row */}
        {hasMore && isFetchingMore && (
          <div className="flex-shrink-0 flex items-center justify-center px-4 w-24 h-24">
            <span className="text-xs text-gray-500 animate-pulse">
              Loading...
            </span>
          </div>
        )}
      </div>

      {/* Instructional text (Mobile vs Desktop) */}
      {isPaused && (
        <p className="text-center text-xs text-gray-500 -mt-2 absolute w-full left-0 bottom-[-20px]">
          {window.innerWidth < 768 ? "Release to scroll" : "Click to visit"}
        </p>
      )}
    </div>
  );
};

export default React.memo(TopAuthoritiesCarousel);
