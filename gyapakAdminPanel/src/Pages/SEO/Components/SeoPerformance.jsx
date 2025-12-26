import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import axiosInstance from "../../../api/axiosConfig";

const Ranges = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
  { label: "6 Months", value: "6M" },
  { label: "1 Year", value: "1Y" },
];

const formatCompact = (n) => {
  const num = Number(n || 0);
  return new Intl.NumberFormat("en-IN", { notation: "compact" }).format(num);
};

const formatNumber = (n) =>
  new Intl.NumberFormat("en-IN").format(Number(n || 0));

const safePct = (v) => {
  const num = Number(v || 0);
  return `${(num * 100).toFixed(2)}%`;
};

const to2 = (v) => Number(v || 0).toFixed(2);

const prettyDate = (d) => {
  // expects YYYY-MM-DD
  if (!d || typeof d !== "string") return "";
  const [y, m, day] = d.split("-").map(Number);
  if (!y || !m || !day) return d;
  return new Date(y, m - 1, day).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

function normalizeGscRows(payload) {
  const rows = Array.isArray(payload?.rows)
    ? payload.rows
    : Array.isArray(payload)
    ? payload
    : [];
  const normalized = rows
    .map((r) => {
      const clicks = Number(r?.clicks ?? 0);
      const impressions = Number(r?.impressions ?? 0);
      const ctr = Number(r?.ctr ?? (impressions ? clicks / impressions : 0));
      const position = Number(r?.position ?? 0);

      // Find date
      let date =
        r?.date ||
        (Array.isArray(r?.keys)
          ? r.keys.find(
              (k) => typeof k === "string" && /^\d{4}-\d{2}-\d{2}$/.test(k)
            )
          : null);

      // fallback: if key exists as string
      if (
        !date &&
        typeof r?.key === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(r.key)
      )
        date = r.key;

      return {
        date: date || "NA",
        label: date ? prettyDate(date) : "NA",
        clicks,
        impressions,
        ctr,
        position,
      };
    })
    .filter((x) => x.date !== "NA");

  // sort by date asc
  normalized.sort((a, b) => (a.date > b.date ? 1 : a.date < b.date ? -1 : 0));
  return normalized;
}

const SeoPerformance = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [range, setRange] = useState("7d");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getPerformanceData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axiosInstance.get(
          `/api/gsc/performance?range=${range}`
        );
        const normalized = normalizeGscRows(response.data);
        setPerformanceData(normalized);
      } catch (e) {
        console.log(e);
        setError(
          e?.response?.data?.message ||
            e?.message ||
            "Failed to load performance data."
        );
        setPerformanceData([]);
      } finally {
        setLoading(false);
      }
    };

    getPerformanceData();
  }, [range]);

  const insights = useMemo(() => {
    const rows = performanceData;
    if (!rows.length) return null;

    const totalClicks = rows.reduce((s, r) => s + r.clicks, 0);
    const totalImpr = rows.reduce((s, r) => s + r.impressions, 0);
    const avgCtr = totalImpr ? totalClicks / totalImpr : 0;
    const avgPos =
      rows.reduce(
        (s, r) => s + (Number.isFinite(r.position) ? r.position : 0),
        0
      ) / rows.length;

    const bestClicksDay = rows.reduce(
      (best, r) => (r.clicks > best.clicks ? r : best),
      rows[0]
    );
    const bestImprDay = rows.reduce(
      (best, r) => (r.impressions > best.impressions ? r : best),
      rows[0]
    );

    // Simple “trend”: compare first half vs second half average clicks
    const mid = Math.floor(rows.length / 2);
    const firstHalf = rows.slice(0, Math.max(1, mid));
    const secondHalf = rows.slice(Math.max(1, mid));
    const avgClicksFirst =
      firstHalf.reduce((s, r) => s + r.clicks, 0) / firstHalf.length;
    const avgClicksSecond =
      secondHalf.reduce((s, r) => s + r.clicks, 0) / secondHalf.length;
    const clicksDeltaPct =
      avgClicksFirst > 0
        ? ((avgClicksSecond - avgClicksFirst) / avgClicksFirst) * 100
        : avgClicksSecond > 0
        ? 100
        : 0;

    const trendWord =
      clicksDeltaPct > 5
        ? "up"
        : clicksDeltaPct < -5
        ? "down"
        : "roughly stable";

    return {
      totalClicks,
      totalImpr,
      avgCtr,
      avgPos,
      bestClicksDay,
      bestImprDay,
      avgClicksFirst,
      avgClicksSecond,
      clicksDeltaPct,
      trendWord,
      fromDate: rows[0]?.date,
      toDate: rows[rows.length - 1]?.date,
    };
  }, [performanceData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const byKey = Object.fromEntries(payload.map((p) => [p.dataKey, p.value]));
    return (
      <div className="rounded-xl border border-purple-200 bg-white p-3 shadow-md">
        <div className="text-sm font-semibold text-gray-900">{label}</div>
        <div className="mt-2 space-y-1 text-xs text-gray-700">
          <div>
            Clicks:{" "}
            <span className="font-semibold">{formatNumber(byKey.clicks)}</span>
          </div>
          <div>
            Impressions:{" "}
            <span className="font-semibold">
              {formatNumber(byKey.impressions)}
            </span>
          </div>
          <div>
            CTR: <span className="font-semibold">{safePct(byKey.ctr)}</span>
          </div>
          <div>
            Avg Position:{" "}
            <span className="font-semibold">{to2(byKey.position)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-10 px-16">
      <h1 className="text-3xl font-semibold">SEO Performance</h1>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Choose Date Range
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Filter Google Search performance for a specific time period.
          </p>
        </div>

        <div className="relative inline-block min-w-[220px]">
          <label
            htmlFor="date-range"
            className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide"
          >
            Date Range
          </label>

          <select
            id="date-range"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="w-full appearance-none px-3 py-2 rounded-lg border border-purple-200 bg-white text-sm text-gray-800
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                       pr-9 shadow-sm"
          >
            {Ranges.map((date) => (
              <option key={date.value} value={date.value}>
                {date.label}
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="mt-8 rounded-xl border border-purple-100 bg-purple-50 p-4 text-sm text-purple-900">
          Loading performance data…
        </div>
      )}

      {error && !loading && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {!loading && !error && performanceData.length === 0 && (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
          No performance rows found for this range.
        </div>
      )}

      {/* Graph */}
      {!loading && !error && performanceData.length > 0 && (
        <div className="mt-8">
          <div className="rounded-2xl border border-purple-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Performance Trend
                </h3>
                {insights?.fromDate && insights?.toDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    {insights.fromDate} → {insights.toDate}
                  </p>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Tip: clicks & impressions move together; CTR improves when
                clicks grow faster than impressions.
              </div>
            </div>

            <div className="mt-4 h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData}
                  margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tickMargin={8} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />

                  {/* Left axis: volume */}
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="clicks"
                    dot={false}
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="impressions"
                    dot={false}
                    strokeWidth={2}
                  />

                  {/* Right axis: rate/position */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="ctr"
                    dot={false}
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="position"
                    dot={false}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-purple-200 bg-white p-4 shadow-sm">
              <div className="text-xs text-gray-500">Total Clicks</div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">
                {formatCompact(insights.totalClicks)}
              </div>
            </div>
            <div className="rounded-2xl border border-purple-200 bg-white p-4 shadow-sm">
              <div className="text-xs text-gray-500">Total Impressions</div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">
                {formatCompact(insights.totalImpr)}
              </div>
            </div>
            <div className="rounded-2xl border border-purple-200 bg-white p-4 shadow-sm">
              <div className="text-xs text-gray-500">Average CTR</div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">
                {safePct(insights.avgCtr)}
              </div>
            </div>
            <div className="rounded-2xl border border-purple-200 bg-white p-4 shadow-sm">
              <div className="text-xs text-gray-500">Average Position</div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">
                {to2(insights.avgPos)}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-purple-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              What this means
            </h3>

            <div className="mt-2 text-sm text-gray-700 leading-relaxed space-y-2">
              <p>
                In the selected period, gyapak received{" "}
                <span className="font-semibold">
                  {formatNumber(insights.totalClicks)}
                </span>{" "}
                clicks from{" "}
                <span className="font-semibold">
                  {formatNumber(insights.totalImpr)}
                </span>{" "}
                impressions. That’s an average CTR of{" "}
                <span className="font-semibold">
                  {safePct(insights.avgCtr)}
                </span>
                , with an average search position of{" "}
                <span className="font-semibold">{to2(insights.avgPos)}</span>.
              </p>

              <p>
                Your best click day was{" "}
                <span className="font-semibold">
                  {prettyDate(insights.bestClicksDay.date)}
                </span>{" "}
                with{" "}
                <span className="font-semibold">
                  {formatNumber(insights.bestClicksDay.clicks)}
                </span>{" "}
                clicks. The highest visibility (impressions) was on{" "}
                <span className="font-semibold">
                  {" "}
                  {prettyDate(insights.bestImprDay.date)}
                </span>{" "}
                with{" "}
                <span className="font-semibold">
                  {formatNumber(insights.bestImprDay.impressions)}
                </span>{" "}
                impressions.
              </p>

              <p>
                Trend check: compared to the first half of the period, your
                average clicks are{" "}
                <span className="font-semibold">{insights.trendWord}</span> (
                {insights.clicksDeltaPct >= 0 ? "+" : ""}
                <span className="font-semibold">
                  {to2(insights.clicksDeltaPct)}%
                </span>
                ).
              </p>

              <div className="mt-3 rounded-xl bg-purple-50 border border-purple-100 p-3 text-xs text-purple-900">
                Quick tip: If impressions rise but clicks don’t, focus on
                improving CTR (better titles/meta, matching intent, rich
                snippets). If position is high (worse number), focus on content
                + internal links + topical coverage.
              </div>
            </div>
          </div>

          {/* Optional: small raw table */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900">
              Daily breakdown
            </h3>
            <div className="mt-3 overflow-auto">
              <table className="min-w-[720px] w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b">
                    <th className="py-2">Date</th>
                    <th className="py-2">Clicks</th>
                    <th className="py-2">Impressions</th>
                    <th className="py-2">CTR</th>
                    <th className="py-2">Position</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.map((r) => (
                    <tr key={r.date} className="border-b last:border-b-0">
                      <td className="py-2">{r.date}</td>
                      <td className="py-2">{formatNumber(r.clicks)}</td>
                      <td className="py-2">{formatNumber(r.impressions)}</td>
                      <td className="py-2">{safePct(r.ctr)}</td>
                      <td className="py-2">{to2(r.position)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeoPerformance;
