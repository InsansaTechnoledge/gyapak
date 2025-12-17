import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";

// const API_URL = "http://localhost:3000/api/gsc/queries";

const Ranges = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
  { label: "6 Months", value: "6M" },
  { label: "1 Year", value: "1Y" },
];

const formatCompact = (n) =>
  new Intl.NumberFormat("en-IN", { notation: "compact" }).format(Number(n || 0));

const formatNumber = (n) =>
  new Intl.NumberFormat("en-IN").format(Number(n || 0));

const pct = (v) => `${(Number(v || 0) * 100).toFixed(2)}%`;
const pos = (v) => Number(v || 0).toFixed(2);

const safeKey = (k) => (Array.isArray(k) ? k[0] : k) || "";

function calcQualityLabel({ ctr, position, impressions }) {
  const c = Number(ctr || 0);
  const p = Number(position || 0);
  const i = Number(impressions || 0);

  // rough buckets (editable)
  if (i < 10) return "Low data";
  if (c >= 0.12 && p <= 5) return "Strong";
  if (c < 0.02 && p <= 10) return "Needs better title/meta";
  if (p > 10 && i >= 30) return "Needs ranking boost";
  return "Average";
}

export default function GSCQueriesPage({url}) {
  const [range, setRange] = useState("7d");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // table controls
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("clicks"); 
  const [sortDir, setSortDir] = useState("desc"); 
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchQueries = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await axios.get(`${url}/gsc/queries?range=${range}`);
        const raw = Array.isArray(res.data?.rows) ? res.data.rows : [];
        const normalized = raw.map((r, idx) => {
          const query = safeKey(r.keys);
          const clicks = Number(r.clicks || 0);
          const impressions = Number(r.impressions || 0);
          const ctr = Number(r.ctr ?? (impressions ? clicks / impressions : 0));
          const position = Number(r.position || 0);

          return {
            id: `${query}-${idx}`,
            query,
            clicks,
            impressions,
            ctr,
            position,
            quality: calcQualityLabel({ ctr, position, impressions }),
          };
        });
        setRows(normalized);
        setPage(1);
      } catch (e) {
        console.log(e);
        setErr(e?.response?.data?.message || e?.message || "Failed to load query data");
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, [range]);

  const stats = useMemo(() => {
    if (!rows.length) return null;

    const totalClicks = rows.reduce((s, r) => s + r.clicks, 0);
    const totalImpr = rows.reduce((s, r) => s + r.impressions, 0);
    const avgCtr = totalImpr ? totalClicks / totalImpr : 0;

    // weighted average position by impressions (more meaningful)
    const weightedPos =
      totalImpr > 0
        ? rows.reduce((s, r) => s + r.position * r.impressions, 0) / totalImpr
        : rows.reduce((s, r) => s + r.position, 0) / rows.length;

    const topClick = rows.reduce((best, r) => (r.clicks > best.clicks ? r : best), rows[0]);
    const topImpr = rows.reduce((best, r) => (r.impressions > best.impressions ? r : best), rows[0]);

    const opportunities = rows
      .filter((r) => r.impressions >= 100 && r.ctr < 0.02)
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 3);

    return {
      totalClicks,
      totalImpr,
      avgCtr,
      weightedPos,
      topClick,
      topImpr,
      opportunities,
    };
  }, [rows]);

  const filteredSorted = useMemo(() => {
    const queryLower = q.trim().toLowerCase();

    const filtered = queryLower
      ? rows.filter((r) => r.query.toLowerCase().includes(queryLower))
      : rows;

    const dir = sortDir === "asc" ? 1 : -1;

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "query") return a.query.localeCompare(b.query) * dir;
      return (Number(a[sortBy]) - Number(b[sortBy])) * dir;
    });

    return sorted;
  }, [rows, q, sortBy, sortDir]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredSorted.slice(start, start + pageSize);
  }, [filteredSorted, page]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / pageSize));

  const topClicksChart = useMemo(() => {
    return [...rows]
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 12)
      .map((r) => ({
        query: r.query.length > 22 ? r.query.slice(0, 22) + "…" : r.query,
        clicks: r.clicks,
        impressions: r.impressions,
      }));
  }, [rows]);

  const topCtrChart = useMemo(() => {
    // show CTR for queries with at least some impressions, else CTR becomes misleading
    return rows
      .filter((r) => r.impressions >= 20)
      .sort((a, b) => b.ctr - a.ctr)
      .slice(0, 12)
      .map((r) => ({
        query: r.query.length > 22 ? r.query.slice(0, 22) + "…" : r.query,
        ctr: Number((r.ctr * 100).toFixed(2)),
        position: Number(r.position.toFixed(2)),
      }));
  }, [rows]);

  const toggleSort = (key) => {
    if (sortBy !== key) {
      setSortBy(key);
      setSortDir("desc");
      return;
    }
    setSortDir((d) => (d === "desc" ? "asc" : "desc"));
  };

  return (
    <div className="px-6 sm:px-10 py-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">GSC Query Performance</h1>
          <p className="text-sm text-gray-500 mt-1">
            Shows how your site performs per search query (Clicks, Impressions, CTR, Position).
          </p>
        </div>

        <div className="relative inline-block min-w-[220px]">
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
            Date Range
          </label>

          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="w-full appearance-none px-3 py-2 rounded-lg border border-purple-200 bg-white text-sm text-gray-800
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                       pr-9 shadow-sm"
          >
            {Ranges.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center mt-4 sm:mt-[26px]">
            <svg
              className="h-4 w-4 text-purple-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="mt-6 rounded-xl border border-purple-100 bg-purple-50 p-4 text-sm text-purple-900">
          Loading query data…
        </div>
      )}

      {err && !loading && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {err}
        </div>
      )}

      {!loading && !err && rows.length === 0 && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
          No rows found for this range.
        </div>
      )}

      {/* Summary + Insight */}
      {!loading && !err && stats && (
        <>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-purple-200 bg-white p-4 shadow-sm">
              <div className="text-xs text-gray-500">Total Clicks</div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">
                {formatCompact(stats.totalClicks)}
              </div>
            </div>

            <div className="rounded-2xl border border-purple-200 bg-white p-4 shadow-sm">
              <div className="text-xs text-gray-500">Total Impressions</div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">
                {formatCompact(stats.totalImpr)}
              </div>
            </div>

            <div className="rounded-2xl border border-purple-200 bg-white p-4 shadow-sm">
              <div className="text-xs text-gray-500">Average CTR</div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">
                {pct(stats.avgCtr)}
              </div>
            </div>

            <div className="rounded-2xl border border-purple-200 bg-white p-4 shadow-sm">
              <div className="text-xs text-gray-500">Weighted Avg Position</div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">
                {pos(stats.weightedPos)}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-purple-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">summary</h3>
            <div className="mt-2 text-sm text-gray-700 leading-relaxed space-y-2">
              <p>
                In this range, your queries generated{" "}
                <span className="font-semibold">{formatNumber(stats.totalClicks)}</span> clicks from{" "}
                <span className="font-semibold">{formatNumber(stats.totalImpr)}</span> impressions,
                giving an overall CTR of <span className="font-semibold">{pct(stats.avgCtr)}</span>.
              </p>

              <p>
                Your strongest query by clicks is{" "}
                <span className="font-semibold">“{stats.topClick.query}”</span>{" "}
                ({formatNumber(stats.topClick.clicks)} clicks).
                The query with the highest visibility is{" "}
                <span className="font-semibold">“{stats.topImpr.query}”</span>{" "}
                ({formatNumber(stats.topImpr.impressions)} impressions).
              </p>

              {stats.opportunities.length > 0 ? (
                <div className="rounded-xl bg-purple-50 border border-purple-100 p-3 text-xs text-purple-900">
                  <div className="font-semibold mb-1">Quick wins (high impressions, low CTR)</div>
                  <ul className="list-disc pl-5 space-y-1">
                    {stats.opportunities.map((o) => (
                      <li key={o.id}>
                        <span className="font-semibold">{o.query}</span> — {formatNumber(o.impressions)} impressions,{" "}
                        {pct(o.ctr)} CTR
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2">
                    Fix: rewrite title/meta to match intent + add FAQ schema + improve snippet clarity.
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-purple-50 border border-purple-100 p-3 text-xs text-purple-900">
                  No major “high impressions + low CTR” opportunities detected in this dataset.
                </div>
              )}
            </div>
          </div>

          {/* Charts */}
          <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-purple-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Top Queries by Clicks</h3>
              <p className="text-xs text-gray-500 mt-1">Top 12 queries sorted by clicks.</p>
              <div className="mt-4 h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topClicksChart} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="query" interval={0} angle={-18} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="clicks" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-purple-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Best CTR Queries</h3>
              <p className="text-xs text-gray-500 mt-1">
                Only queries with 20+ impressions (to avoid misleading 1/1 CTR).
              </p>
              <div className="mt-4 h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={topCtrChart} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="query" interval={0} angle={-18} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="ctr" dot={false} strokeWidth={2} />
                    <Line type="monotone" dataKey="position" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="text-base font-semibold text-gray-900">All Queries</h3>

              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <input
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search query…"
                  className="w-full sm:w-[280px] px-3 py-2 rounded-lg border border-gray-200 text-sm
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />

                <select
                  value={`${sortBy}:${sortDir}`}
                  onChange={(e) => {
                    const [sb, sd] = e.target.value.split(":");
                    setSortBy(sb);
                    setSortDir(sd);
                  }}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="clicks:desc">Clicks ↓</option>
                  <option value="clicks:asc">Clicks ↑</option>
                  <option value="impressions:desc">Impressions ↓</option>
                  <option value="impressions:asc">Impressions ↑</option>
                  <option value="ctr:desc">CTR ↓</option>
                  <option value="ctr:asc">CTR ↑</option>
                  <option value="position:asc">Position ↑ (better)</option>
                  <option value="position:desc">Position ↓</option>
                  <option value="query:asc">Query A→Z</option>
                  <option value="query:desc">Query Z→A</option>
                </select>
              </div>
            </div>

            <div className="mt-4 overflow-auto">
              <table className="min-w-[900px] w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b">
                    <th className="py-2">Query</th>
                    <th className="py-2 cursor-pointer" onClick={() => toggleSort("clicks")}>
                      Clicks
                    </th>
                    <th className="py-2 cursor-pointer" onClick={() => toggleSort("impressions")}>
                      Impressions
                    </th>
                    <th className="py-2 cursor-pointer" onClick={() => toggleSort("ctr")}>
                      CTR
                    </th>
                    <th className="py-2 cursor-pointer" onClick={() => toggleSort("position")}>
                      Position
                    </th>
                    <th className="py-2">Insight</th>
                  </tr>
                </thead>

                <tbody>
                  {paged.map((r) => (
                    <tr key={r.id} className="border-b last:border-b-0">
                      <td className="py-3 pr-4">
                        <div className="font-medium text-gray-900 break-words">{r.query}</div>
                      </td>
                      <td className="py-3">{formatNumber(r.clicks)}</td>
                      <td className="py-3">{formatNumber(r.impressions)}</td>
                      <td className="py-3">{pct(r.ctr)}</td>
                      <td className="py-3">{pos(r.position)}</td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs border
                          ${
                            r.quality === "Strong"
                              ? "border-green-200 bg-green-50 text-green-800"
                              : r.quality === "Needs better title/meta"
                              ? "border-yellow-200 bg-yellow-50 text-yellow-800"
                              : r.quality === "Needs ranking boost"
                              ? "border-red-200 bg-red-50 text-red-800"
                              : "border-gray-200 bg-gray-50 text-gray-700"
                          }`}
                        >
                          {r.quality}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="text-gray-500">
                Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredSorted.length)} of{" "}
                {filteredSorted.length}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-50"
                >
                  Prev
                </button>

                <div className="text-gray-700">
                  Page <span className="font-semibold">{page}</span> / {totalPages}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
