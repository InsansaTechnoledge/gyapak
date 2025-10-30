// CurrentAffairsPdfGrid.jsx
// Pretty UI for your Current Affairs PDF list + per-card preview modal
// Tech: React + TailwindCSS (no extra libs)

import React, { useMemo, useState } from "react";

// ---------- small utils ----------
const cls = (...xs) => xs.filter(Boolean).join(" ");

function timeAgo(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  const r = (n, u) => `${n} ${u}${n > 1 ? "s" : ""} ago`;
  if (s < 60) return r(s, "sec");
  const m = Math.floor(s / 60);
  if (m < 60) return r(m, "min");
  const h = Math.floor(m / 60);
  if (h < 24) return r(h, "hr");
  const dd = Math.floor(h / 24);
  if (dd < 30) return r(dd, "day");
  const mo = Math.floor(dd / 30);
  if (mo < 12) return r(mo, "month");
  const y = Math.floor(mo / 12);
  return r(y, "year");
}

function fmtDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return iso;
  }
}

function toDriveEmbed(url) {
  if (!url) return "";
  // Accepts either .../file/d/<id>/view or raw id; returns /preview URL for iframe
  const m = url.match(/\/d\/([a-zA-Z0-9_-]{20,})/);
  const id = m?.[1] || url;
  return `https://drive.google.com/file/d/${id}/preview`;
}

// ---------- Components ----------
function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-teal-700/40 bg-teal-900/20 px-2 py-0.5 text-xs text-teal-600">
      {children}
    </span>
  );
}

function StatusPill({ published }) {
  return (
    <span
      className={cls(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
        published
          ? "bg-emerald-900/20 text-emerald-600 border border-emerald-700/40"
          : "bg-amber-900/20 text-amber-300 border border-amber-700/40"
      )}
      title={published ? "Published" : "Draft"}
    >
      <span className={cls("h-1.5 w-1.5 rounded-full", published ? "bg-emerald-400" : "bg-amber-400")} />
      {published ? "Published" : "Draft"}
    </span>
  );
}

function Card({ item, onPreview , handleDeletePdf}) {
  const embed = useMemo(() => toDriveEmbed(item.pdfLink), [item.pdfLink]);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-100/60 shadow-sm backdrop-blur transition hover:shadow-lg">
      {/* Thumb */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
        <iframe
          title={item.title}
          src={embed}
          className="h-full w-full scale-[1.01]"
          allow="autoplay"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-base font-semibold text-slate-600">
            {item.title || "Untitled"}
          </h3>
          <StatusPill published={!!item.isPublished} />
        </div>
        <p className="line-clamp-2 text-sm text-slate-600">{item.description || "—"}</p>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-200">
          {item.category && <span className="rounded-md bg-slate-800/60 px-2 py-0.5">{item.category}</span>}
          {item.tags?.length > 0 && (
            <span className="flex flex-wrap gap-1">
              {item.tags.map((t, i) => (
                <Tag key={`${item._id}-tag-${i}`}>{t}</Tag>
              ))}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between text-xs text-slate-400">
          <div>
            <div>Published: {fmtDate(item.date)}</div>
            <div className="mt-0.5">Updated {timeAgo(item.updatedAt)}</div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={item.pdfLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-slate-700/70 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800"
            >
              Open
            </a>
            <button
              onClick={() => onPreview(item)}
              className="rounded-lg bg-gradient-to-r from-sky-500 to-teal-400 px-3 py-1.5 text-xs font-semibold text-white shadow-teal-500/20 hover:opacity-90"
            >
              Preview
            </button>
            
          </div>
        </div>
            <button
                onClick={() =>handleDeletePdf(item._id)}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-teal-500/20 hover:opacity-90"
                >
              Delete
            </button>
      </div>
    </article>
  );
}

function PreviewModal({ open, onClose, item }) {
  if (!open || !item) return null;
  const embed = toDriveEmbed(item.pdfLink);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4">
      <div className="relative w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-800 p-3">
          <div className="truncate pr-2 text-sm font-semibold text-slate-100">{item.title}</div>
          <div className="flex items-center gap-2">
            <a
              href={item.pdfLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-slate-700/70 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700"
            >
              Open in new tab
            </a>
            <button
              onClick={onClose}
              className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-white"
            >
              Close
            </button>
          </div>
        </div>
        <div className="aspect-[16/9] w-full">
          <iframe title={item.title} src={embed} className="h-full w-full" allow="autoplay" />
        </div>
      </div>
    </div>
  );
}

export default function CurrentAffairsPdfGrid({ data = [] , handleDeletePdf }) {
  const [preview, setPreview] = useState(null);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <h1 className="text-2xl font-bold text-slate-600">No Current Affairs found</h1>
        <p className="mt-2 text-slate-400">Upload a PDF to get started.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-600">
            Current Affair PDFs <span className="text-slate-500">({data.length})</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">Browse, preview, and share the latest uploads.</p>
        </div>
       
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {data.map((p) => (
          <Card key={p._id || p.pdfLink} item={p} onPreview={setPreview} handleDeletePdf={handleDeletePdf}/>
        ))}
      </div>

      <PreviewModal open={!!preview} onClose={() => setPreview(null)} item={preview} />
    </div>
  );
}
