import React from "react";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const go = (p) => onPageChange?.(Math.max(1, Math.min(totalPages, p)));

  const windowSize = 5;
  const start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);

  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-between gap-3">
      <button
        disabled={!canPrev}
        onClick={() => go(page - 1)}
        className="px-3 py-1.5 text-sm rounded-md border border-slate-300 disabled:opacity-50"
      >
        Prev
      </button>

      <div className="flex items-center gap-1">
        {start > 1 && (
          <>
            <button
              onClick={() => go(1)}
              className="px-2 py-1 text-sm rounded-md border border-slate-200"
            >
              1
            </button>
            {start > 2 && <span className="text-slate-400 px-1">…</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => go(p)}
            className={`px-2 py-1 text-sm rounded-md border ${
              p === page
                ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                : "border-slate-200"
            }`}
          >
            {p}
          </button>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="text-slate-400 px-1">…</span>}
            <button
              onClick={() => go(totalPages)}
              className="px-2 py-1 text-sm rounded-md border border-slate-200"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        disabled={!canNext}
        onClick={() => go(page + 1)}
        className="px-3 py-1.5 text-sm rounded-md border border-slate-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
