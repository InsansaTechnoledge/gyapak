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
} from "recharts";

// const API_URL = "http://localhost:3000/api/gsc/pages";

const DaysRanges = [
  { label: "Last 7 days", value: 7 },
  { label: "Last 30 days", value: 30 },
  { label: "Last 90 days", value: 90 },
  { label: "Last 180 days", value: 180 },
  { label: "Last 365 days", value: 365 },
];

const formatCompact = (n) =>
  new Intl.NumberFormat("en-IN", { notation: "compact" }).format(Number(n || 0));
const formatNumber = (n) => new Intl.NumberFormat("en-IN").format(Number(n || 0));
const pct = (v) => `${(Number(v || 0) * 100).toFixed(2)}%`;
const pos = (v) => Number(v || 0).toFixed(2);
const safeKey = (k) => (Array.isArray(k) ? k[0] : k) || "";

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

function getDateWindow(days) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - Number(days || 30));
  return { start, end };
}

function shortenUrl(u, max = 34) {
  try {
    const url = new URL(u);
    const path = (url.pathname || "/").replace(/\/$/, "") || "/";
    const short = `${url.hostname}${path}`;
    return short.length <= max ? short : short.slice(0, max) + "…";
  } catch {
    return !u ? "" : u.length <= max ? u : u.slice(0, max) + "…";
  }
}

export default function GSCPagesPage({url}) {
  const [days, setDays] = useState(30);
  const [limit, setLimit] = useState(50);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const { start, end } = useMemo(() => getDateWindow(days), [days]);

  useEffect(() => {
    const fetchPages = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await axios.get(`${url}/gsc/pages?days=${days}&limit=${limit}`);
        const raw = Array.isArray(res.data?.rows) ? res.data.rows : [];

        const normalized = raw.map((r, idx) => {
          const pageUrl = safeKey(r.keys);
          const clicks = Number(r.clicks || 0);
          const impressions = Number(r.impressions || 0);
          const ctr = Number(r.ctr ?? (impressions ? clicks / impressions : 0));
          const position = Number(r.position || 0);

          return {
            id: `${pageUrl}-${idx}`,
            pageUrl,
            pageShort: shortenUrl(pageUrl),
            clicks,
            impressions,
            ctr,
            position,
          };
        });

        setRows(normalized);
      } catch (e) {
        console.log(e);
        setErr(e?.response?.data?.message || e?.message || "Failed to load pages data");
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [days, limit]);

  const stats = useMemo(() => {
    if (!rows.length) return null;

    const totalClicks = rows.reduce((s, r) => s + r.clicks, 0);
    const totalImpr = rows.reduce((s, r) => s + r.impressions, 0);
    const avgCtr = totalImpr ? totalClicks / totalImpr : 0;

    const weightedPos =
      totalImpr > 0
        ? rows.reduce((s, r) => s + r.position * r.impressions, 0) / totalImpr
        : rows.reduce((s, r) => s + r.position, 0) / rows.length;

    const topClick = rows.reduce((best, r) => (r.clicks > best.clicks ? r : best), rows[0]);
    const topImpr = rows.reduce((best, r) => (r.impressions > best.impressions ? r : best), rows[0]);

    const ctrOpp = rows
      .filter((r) => r.impressions >= 300 && r.ctr < 0.01)
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 4);

    return { totalClicks, totalImpr, avgCtr, weightedPos, topClick, topImpr, ctrOpp };
  }, [rows]);

  const topClicksChart = useMemo(() => {
    return [...rows]
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 12)
      .map((r) => ({
        page: r.pageShort,
        clicks: r.clicks,
      }));
  }, [rows]);

  return (
    <div className="px-6 sm:px-10 py-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">GSC Pages Performance</h1>
          <p className="text-sm text-gray-500 mt-1">
            Window: <span className="font-semibold">{fmtDate(start)}</span> →{" "}
            <span className="font-semibold">{fmtDate(end)}</span>
          </p>
        </div>

        {/* ✅ DAYS selector (not “date range”) */}
        <div className="flex gap-3 flex-col sm:flex-row sm:items-end">
          <div className="min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
              Days window
            </label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full appearance-none px-3 py-2 rounded-lg border border-purple-200 bg-white text-sm text-gray-800
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
            >
              {DaysRanges.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-[160px]">
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
              Row limit
            </label>
            <input
              type="number"
              value={limit}
              min={10}
              max={250}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-purple-200 bg-white text-sm text-gray-800
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className="mt-6 rounded-xl border border-purple-100 bg-purple-50 p-4 text-sm text-purple-900">
          Loading pages data…
        </div>
      )}

      {err && !loading && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {err}
        </div>
      )}

      {!loading && !err && stats && (
        <>
          {/* Summary cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-purple-200 bg-white p-4 shadow-sm">
              <div className="text-xs text-gray-500">Total Clicks</div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">{formatCompact(stats.totalClicks)}</div>
            </div>
            <div className="rounded-2xl border border-purple-200 bg-white p-4 shadow-sm">
              <div className="text-xs text-gray-500">Total Impressions</div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">{formatCompact(stats.totalImpr)}</div>
            </div>
            <div className="rounded-2xl border border-purple-200 bg-white p-4 shadow-sm">
              <div className="text-xs text-gray-500">Average CTR</div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">{pct(stats.avgCtr)}</div>
            </div>
            <div className="rounded-2xl border border-purple-200 bg-white p-4 shadow-sm">
              <div className="text-xs text-gray-500">Weighted Avg Position</div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">{pos(stats.weightedPos)}</div>
            </div>
          </div>

          {/* Human language */}
          <div className="mt-6 rounded-2xl border border-purple-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">summary</h3>
            <div className="mt-2 text-sm text-gray-700 space-y-2">
              <p>
                In the last <span className="font-semibold">{days}</span> days, your pages got{" "}
                <span className="font-semibold">{formatNumber(stats.totalClicks)}</span> clicks from{" "}
                <span className="font-semibold">{formatNumber(stats.totalImpr)}</span> impressions,
                which is an overall CTR of <span className="font-semibold">{pct(stats.avgCtr)}</span>.
              </p>
              <p>
                The top page by clicks is{" "}
                <a className="font-semibold text-purple-700 hover:underline break-all" href={stats.topClick.pageUrl} target="_blank" rel="noreferrer">
                  {stats.topClick.pageUrl}
                </a>{" "}
                ({formatNumber(stats.topClick.clicks)} clicks).
              </p>

              {stats.ctrOpp?.length > 0 && (
                <div className="rounded-xl bg-purple-50 border border-purple-100 p-3 text-xs text-purple-900">
                  <div className="font-semibold mb-1">CTR opportunities (high impressions, low CTR)</div>
                  <ul className="list-disc pl-5 space-y-1">
                    {stats.ctrOpp.map((r) => (
                      <li key={r.id}>
                        <span className="font-semibold">{shortenUrl(r.pageUrl, 60)}</span> —{" "}
                        {formatNumber(r.impressions)} impr, {pct(r.ctr)} CTR
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2">
                    Fix: rewrite title/meta, add FAQ schema, and improve snippet clarity for these pages.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chart */}
          <div className="mt-6 rounded-2xl border border-purple-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Top Pages by Clicks</h3>
            <p className="text-xs text-gray-500 mt-1">Top 12 pages sorted by clicks.</p>

            <div className="mt-4 h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topClicksChart} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="page" interval={0} angle={-18} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="clicks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900">Pages list</h3>

            <div className="mt-3 overflow-auto">
              <table className="min-w-[1000px] w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b">
                    <th className="py-2">Page</th>
                    <th className="py-2 cursor-pointer" onClick={() => {}}>Clicks</th>
                    <th className="py-2">Impressions</th>
                    <th className="py-2">CTR</th>
                    <th className="py-2">Position</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 500).map((r) => (
                    <tr key={r.id} className="border-b last:border-b-0">
                      <td className="py-3 pr-4">
                        <a className="font-medium text-purple-700 hover:underline break-all" href={r.pageUrl} target="_blank" rel="noreferrer">
                          {r.pageUrl}
                        </a>
                        <div className="text-xs text-gray-500 mt-1">{r.pageShort}</div>
                      </td>
                      <td className="py-3">{formatNumber(r.clicks)}</td>
                      <td className="py-3">{formatNumber(r.impressions)}</td>
                      <td className="py-3">{pct(r.ctr)}</td>
                      <td className="py-3">{pos(r.position)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
