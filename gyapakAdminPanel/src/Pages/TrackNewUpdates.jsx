import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import * as XLSX from "xlsx";
// import Pagination from "../components/ui/Pagination";
import ManageSources from "./ManageSources";
import { API_BASE_URL } from "../config";
import Pagination from "./SEO/Components/Pagination";

const API_BASE = API_BASE_URL;

// IST date key YYYY-MM-DD
const istDateKey = (d) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);

const getDocTime = (n) => n.firstSeenAt || n.publishedAt || n.createdAt || null;
const makeKey = (n) => n._id || n.link || `${n.sourceCode}|${n.title}`;

// small UI
const Badge = ({ children, tone = "slate" }) => {
  const tones = {
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-green-50 text-green-700 border-green-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
};

const StatCard = ({ label, value, hint }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="text-xs text-slate-500">{label}</div>
    <div className="mt-1 text-2xl font-semibold text-slate-800">{value}</div>
    {hint ? <div className="mt-1 text-[11px] text-slate-500">{hint}</div> : null}
  </div>
);

export default function TrackNewUpdates() {
  const [sources, setSources] = useState([]);
  const [notificationsBySource, setNotificationsBySource] = useState({});
  const [loadingSources, setLoadingSources] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // UI
  const [query, setQuery] = useState("");
  const [onlyToday, setOnlyToday] = useState(false);
  const [view, setView] = useState("grouped"); // grouped | combined
  const [expanded, setExpanded] = useState(() => new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);

  // left sources pagination
  const [sourcesPage, setSourcesPage] = useState(1);
  const [sourcesPageSize, setSourcesPageSize] = useState(10);

  // socket / dedupe / new since open
  const socketRef = useRef(null);
  const seenRef = useRef({}); // { code: Set(keys) }
  const newSinceOpenRef = useRef(new Set());
  const [newSinceOpenCount, setNewSinceOpenCount] = useState(0);

  const todayKey = useMemo(() => istDateKey(new Date()), []);

  // load sources
  useEffect(() => {
    const fetchSources = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/sources`, { withCredentials: true });
        setSources(res?.data?.data || []);
      } catch (err) {
        console.error("Error fetching sources:", err);
      } finally {
        setLoadingSources(false);
      }
    };
    fetchSources();
  }, []);

  const activeSources = useMemo(
    () => sources.filter((s) => s.isActive !== false),
    [sources]
  );

  // initial notifications for all active sources
  useEffect(() => {
    if (!activeSources.length) return;

    const fetchAll = async () => {
      setLoadingNotifications(true);
      try {
        const results = await Promise.all(
          activeSources.map(async (s) => {
            const res = await axios.get(`${API_BASE}/api/notifications`, {
              params: { sourceCode: s.code, limit: 60 },
              withCredentials: true,
            });
            return { code: s.code, rows: res?.data?.data || [] };
          })
        );

        const next = {};
        for (const { code, rows } of results) {
          next[code] = rows;
          if (!seenRef.current[code]) seenRef.current[code] = new Set();
          rows.forEach((r) => seenRef.current[code].add(makeKey(r)));
        }

        setNotificationsBySource(next);

        // nicer UX: expand first 2 sources initially
        setExpanded((prev) => {
          const ns = new Set(prev);
          activeSources.slice(0, 2).forEach((s) => ns.add(s.code));
          return ns;
        });
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchAll();
  }, [activeSources]);

  // socket connect once + subscribe to all active rooms
  useEffect(() => {
    if (!activeSources.length) return;

    if (!socketRef.current) {
      socketRef.current = io(API_BASE, {
        withCredentials: true,
        transports: ["websocket"],
      });
    }

    const socket = socketRef.current;

    // subscribe
    activeSources.forEach((s) => socket.emit("subscribe-source", s.code));

    const handleNewNotifications = (incoming) => {
      const docs = Array.isArray(incoming) ? incoming : [incoming];
      if (!docs.length) return;

      setNotificationsBySource((prev) => {
        const copy = { ...prev };

        for (const doc of docs) {
          const code = doc.sourceCode;
          if (!code) continue;

          if (!seenRef.current[code]) seenRef.current[code] = new Set();
          const k = makeKey(doc);
          if (seenRef.current[code].has(k)) continue;

          seenRef.current[code].add(k);
          newSinceOpenRef.current.add(k);

          const list = copy[code] ? [...copy[code]] : [];
          list.unshift(doc);

          list.sort((a, b) => {
            const ta = getDocTime(a) ? new Date(getDocTime(a)).getTime() : 0;
            const tb = getDocTime(b) ? new Date(getDocTime(b)).getTime() : 0;
            return tb - ta;
          });

          copy[code] = list.slice(0, 400);
        }

        setNewSinceOpenCount(newSinceOpenRef.current.size);
        return copy;
      });
    };

    socket.on("new-notifications", handleNewNotifications);

    return () => {
      socket.off("new-notifications", handleNewNotifications);
      // keep socket alive if page remains; if you want hard cleanup:
      // socket.disconnect();
      // socketRef.current = null;
    };
  }, [activeSources]);

  const isToday = (n) => {
    const t = getDocTime(n);
    if (!t) return false;
    return istDateKey(new Date(t)) === todayKey;
  };

  const allNotifications = useMemo(() => {
    const flat = Object.values(notificationsBySource).flat();
    flat.sort((a, b) => {
      const ta = getDocTime(a) ? new Date(getDocTime(a)).getTime() : 0;
      const tb = getDocTime(b) ? new Date(getDocTime(b)).getTime() : 0;
      return tb - ta;
    });
    return flat;
  }, [notificationsBySource]);

  const todayNotifications = useMemo(
    () => allNotifications.filter(isToday),
    [allNotifications]
  );

  const filteredCombined = useMemo(() => {
    const base = onlyToday ? todayNotifications : allNotifications;
    const q = query.trim().toLowerCase();
    if (!q) return base;

    return base.filter((n) => {
      const hay = `${n.title || ""} ${n.summary || ""} ${n.sourceCode || ""} ${n.link || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [allNotifications, todayNotifications, onlyToday, query]);

  const statsBySource = useMemo(() => {
    const map = {};
    for (const s of activeSources) {
      const list = notificationsBySource[s.code] || [];
      map[s.code] = {
        total: list.length,
        today: list.filter(isToday).length,
      };
    }
    return map;
  }, [activeSources, notificationsBySource]);

  // paginate left sources list
  const totalSourcePages = Math.max(1, Math.ceil(activeSources.length / sourcesPageSize));
  const pagedSources = useMemo(() => {
    const safePage = Math.min(sourcesPage, totalSourcePages);
    const start = (safePage - 1) * sourcesPageSize;
    return activeSources.slice(start, start + sourcesPageSize);
  }, [activeSources, sourcesPage, sourcesPageSize, totalSourcePages]);

  useEffect(() => {
    if (sourcesPage > totalSourcePages) setSourcesPage(totalSourcePages);
    // eslint-disable-next-line
  }, [totalSourcePages]);

  const toggleExpanded = (code) => {
    setExpanded((prev) => {
      const ns = new Set(prev);
      ns.has(code) ? ns.delete(code) : ns.add(code);
      return ns;
    });
  };

  const downloadTodayExcel = () => {
    const rows = todayNotifications.map((n) => ({
      Source: n.sourceCode || "",
      Title: n.title || "",
      Link: n.link || "",
      Summary: n.summary || "",
      SeenAt: getDocTime(n) ? new Date(getDocTime(n)).toLocaleString("en-IN") : "",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Today");
    XLSX.writeFile(wb, `today-notifications-${todayKey}.xlsx`);
  };

  return (
    <div className="mt-24 max-w-7xl mx-auto px-4 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Track New Updates</h1>
          <p className="text-sm text-slate-500">All sources tracked together — clean dashboard + live feed.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Live */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
            </span>
            <span className="text-xs font-medium text-green-700">LIVE</span>
          </div>

          <button
            onClick={() => setDrawerOpen(true)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Manage Sources
          </button>

          <button
            onClick={downloadTodayExcel}
            disabled={!todayNotifications.length}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            Download Today (Excel)
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Today (IST)" value={todayNotifications.length} hint={`Date: ${todayKey}`} />
        <StatCard label="New since open" value={newSinceOpenCount} hint="Live additions after opening" />
        <StatCard label="Total cached" value={allNotifications.length} hint="Across active sources" />
        <StatCard label="Active sources" value={activeSources.length} hint={loadingSources ? "Loading…" : ""} />
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, summary, source…"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:flex-1"
        />

        <button
          onClick={() => setOnlyToday((v) => !v)}
          className={`rounded-md border px-3 py-2 text-sm ${
            onlyToday ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "border-slate-300 bg-white text-slate-700"
          }`}
        >
          {onlyToday ? "Showing: Today" : "Filter: Today"}
        </button>

        <div className="flex rounded-md border border-slate-300 overflow-hidden">
          <button
            onClick={() => setView("grouped")}
            className={`px-3 py-2 text-sm ${
              view === "grouped" ? "bg-indigo-50 text-indigo-700" : "bg-white text-slate-700"
            }`}
          >
            Grouped
          </button>
          <button
            onClick={() => setView("combined")}
            className={`px-3 py-2 text-sm border-l border-slate-300 ${
              view === "combined" ? "bg-indigo-50 text-indigo-700" : "bg-white text-slate-700"
            }`}
          >
            Combined
          </button>
        </div>

        <div className="text-sm text-slate-600">
          <span className="font-semibold">{filteredCombined.length}</span> results
        </div>
      </div>

      {/* Main layout */}
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left: Sources (paginated) */}
        <aside className="lg:col-span-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-800">Sources</h2>
              <select
                value={sourcesPageSize}
                onChange={(e) => {
                  setSourcesPageSize(Number(e.target.value));
                  setSourcesPage(1);
                }}
                className="border border-slate-200 rounded-md px-2 py-1 text-xs"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
              </select>
            </div>

            {loadingSources ? (
              <p className="text-sm text-slate-500">Loading sources…</p>
            ) : activeSources.length === 0 ? (
              <p className="text-sm text-slate-500">No active sources.</p>
            ) : (
              <div className="space-y-2">
                {pagedSources.map((s) => {
                  const st = statsBySource[s.code] || { total: 0, today: 0 };
                  const open = expanded.has(s.code);
                  return (
                    <button
                      key={s._id}
                      onClick={() => toggleExpanded(s.code)}
                      className={`w-full rounded-lg border p-3 text-left hover:bg-slate-50 ${
                        open ? "border-indigo-200 bg-indigo-50/30" : "border-slate-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{s.name}</div>
                          <div className="mt-0.5 font-mono text-[11px] text-slate-500">{s.code}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge tone={st.today ? "green" : "slate"}>Today: {st.today}</Badge>
                          <Badge tone="slate">Total: {st.total}</Badge>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-3">
              <Pagination
                page={sourcesPage}
                totalPages={totalSourcePages}
                onPageChange={setSourcesPage}
              />
            </div>
          </div>
        </aside>

        {/* Center: Feed */}
        <main className="lg:col-span-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">
                {view === "grouped" ? "Feed by Source" : "Combined Feed"}
              </h2>
              {loadingNotifications && <span className="text-xs text-slate-500">Syncing…</span>}
            </div>

            {/* GROUPED */}
            {view === "grouped" ? (
              <div className="mt-3 space-y-3">
                {activeSources.map((s) => {
                  const list0 = notificationsBySource[s.code] || [];
                  const list1 = onlyToday ? list0.filter(isToday) : list0;

                  const q = query.trim().toLowerCase();
                  const filtered = !q
                    ? list1
                    : list1.filter((n) =>
                        `${n.title || ""} ${n.summary || ""} ${n.link || ""}`.toLowerCase().includes(q)
                      );

                  if (filtered.length === 0) return null;

                  const open = expanded.has(s.code);
                  const slice = open ? filtered.slice(0, 30) : filtered.slice(0, 6);

                  const st = statsBySource[s.code] || { total: 0, today: 0 };

                  return (
                    <div key={s.code} className="rounded-xl border border-slate-200 overflow-hidden">
                      <button
                        onClick={() => toggleExpanded(s.code)}
                        className="flex w-full items-center justify-between gap-3 bg-slate-50 px-4 py-3 text-left"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{s.name}</div>
                          <div className="text-[11px] font-mono text-slate-500">{s.code}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge tone={st.today ? "green" : "slate"}>Today: {st.today}</Badge>
                          <Badge tone="slate">Items: {filtered.length}</Badge>
                          <span className="text-xs text-slate-500">{open ? "Collapse" : "Expand"}</span>
                        </div>
                      </button>

                      <ul className="divide-y divide-slate-200">
                        {slice.map((n) => {
                          const t = getDocTime(n);
                          const today = t && istDateKey(new Date(t)) === todayKey;
                          const isNew = newSinceOpenRef.current.has(makeKey(n));

                          return (
                            <li key={makeKey(n)} className="px-4 py-3">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {isNew && <span className="h-2 w-2 rounded-full bg-indigo-500" title="New since open" />}
                                    <a
                                      href={n.link}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-sm font-semibold text-indigo-600 hover:underline line-clamp-2"
                                    >
                                      {n.title}
                                    </a>
                                    {today && <Badge tone="green">Today</Badge>}
                                  </div>
                                  {n.summary ? (
                                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                                      {n.summary}
                                    </p>
                                  ) : null}
                                </div>

                                <div className="shrink-0 text-right">
                                  <div className="text-[11px] text-slate-500">
                                    {t ? new Date(t).toLocaleString("en-IN") : ""}
                                  </div>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>

                      {filtered.length > slice.length && (
                        <div className="px-4 py-3">
                          <button
                            onClick={() => toggleExpanded(s.code)}
                            className="text-sm font-medium text-indigo-700 hover:underline"
                          >
                            {open ? "Show less" : `Show more (${filtered.length - slice.length})`}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              // COMBINED
              <ul className="mt-3 divide-y divide-slate-200">
                {filteredCombined.slice(0, 200).map((n) => {
                  const t = getDocTime(n);
                  const today = t && istDateKey(new Date(t)) === todayKey;
                  const isNew = newSinceOpenRef.current.has(makeKey(n));

                  return (
                    <li key={makeKey(n)} className="py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            {isNew && <span className="h-2 w-2 rounded-full bg-indigo-500" />}
                            <Badge tone="indigo">{n.sourceCode}</Badge>
                            {today && <Badge tone="green">Today</Badge>}
                          </div>

                          <a
                            href={n.link}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 block text-sm font-semibold text-indigo-600 hover:underline line-clamp-2"
                          >
                            {n.title}
                          </a>

                          {n.summary ? (
                            <p className="mt-1 text-xs text-slate-500 line-clamp-2">{n.summary}</p>
                          ) : null}
                        </div>

                        <div className="shrink-0 text-right">
                          <div className="text-[11px] text-slate-500">
                            {t ? new Date(t).toLocaleString("en-IN") : ""}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </main>

        {/* Right: Today Panel */}
        <aside className="lg:col-span-3">
          <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">Today’s New</h2>
              <Badge tone={todayNotifications.length ? "green" : "slate"}>{todayNotifications.length}</Badge>
            </div>

            <p className="mt-1 text-[11px] text-slate-500">
              IST date: <span className="font-mono">{todayKey}</span>
            </p>

            <button
              onClick={downloadTodayExcel}
              disabled={!todayNotifications.length}
              className="mt-3 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              Download Today Excel
            </button>

            <div className="mt-4 space-y-3">
              {todayNotifications.slice(0, 12).map((n) => (
                <div key={makeKey(n)} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone="indigo">{n.sourceCode}</Badge>
                    <span className="text-[11px] text-slate-500">
                      {getDocTime(n) ? new Date(getDocTime(n)).toLocaleTimeString("en-IN") : ""}
                    </span>
                  </div>

                  <a
                    href={n.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block text-sm font-semibold text-indigo-700 hover:underline line-clamp-2"
                  >
                    {n.title}
                  </a>
                </div>
              ))}

              {todayNotifications.length > 12 && (
                <p className="text-xs text-slate-500">
                  Showing 12 of {todayNotifications.length}. Use the filters/search for full view.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Drawer: ManageSources */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-3xl bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Manage Sources</h3>
                <p className="text-xs text-slate-500">CRUD + pagination + search</p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="px-3 py-2 text-sm rounded-md border border-slate-300 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
            <ManageSources />
          </div>
        </div>
      )}
    </div>
  );
}
