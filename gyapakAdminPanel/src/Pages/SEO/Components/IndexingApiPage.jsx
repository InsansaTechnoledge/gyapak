import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../api/axiosConfig";

// const API_BASE = "http://localhost:3000/api/index";

const API_BASE = "https://adminpanel.gyapak.in/api/index";
const LS_KEY = "gyapak_indexing_history_v1";

const isValidUrl = (value) => {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

const fmtDateTime = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function Badge({ tone = "gray", children }) {
  const cls =
    tone === "green"
      ? "border-green-200 bg-green-50 text-green-800"
      : tone === "red"
      ? "border-red-200 bg-red-50 text-red-800"
      : tone === "yellow"
      ? "border-yellow-200 bg-yellow-50 text-yellow-800"
      : tone === "purple"
      ? "border-purple-200 bg-purple-50 text-purple-800"
      : "border-gray-200 bg-gray-50 text-gray-700";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs border ${cls}`}
    >
      {children}
    </span>
  );
}

function normalizeInputToUrls(input) {
  // split by newline / comma / whitespace
  const tokens = input
    .split(/[\n,\s]+/g)
    .map((t) => t.trim())
    .filter(Boolean);

  // remove duplicates but keep order
  const seen = new Set();
  const unique = [];
  for (const t of tokens) {
    if (!seen.has(t)) {
      seen.add(t);
      unique.push(t);
    }
  }
  return unique;
}

export default function IndexingApiPage() {
  const [mode, setMode] = useState("single"); // single | bulk
  const [action, setAction] = useState("publish"); // publish | remove

  const [singleUrl, setSingleUrl] = useState("");
  const [bulkText, setBulkText] = useState("");

  const [loading, setLoading] = useState(false);

  // results
  const [results, setResults] = useState([]); // [{url, ok, message, apiResponse, at}]
  const [error, setError] = useState("");

  // history
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      if (Array.isArray(saved)) setHistory(saved);
    } catch {
      // ignore
    }
  }, []);

  const endpoint = useMemo(() => {
    // map action to endpoint + message labels
    return action === "publish" ? "/publish" : "/remove";
  }, [action]);

  const actionLabel = useMemo(() => {
    return action === "publish"
      ? "Publish (URL_UPDATED)"
      : "Remove (URL_REMOVED)";
  }, [action]);

  const humanSummary = useMemo(() => {
    if (action === "publish") {
      return "This sends a Google Indexing API notification: URL_UPDATED. Use it when you publish or update a job/post page and want Google to re-crawl faster.";
    }
    return "This sends a Google Indexing API notification: URL_REMOVED. Use it when a page is deleted or should be removed from Google results.";
  }, [action]);

  const urlsToProcess = useMemo(() => {
    if (mode === "single") return singleUrl.trim() ? [singleUrl.trim()] : [];
    return normalizeInputToUrls(bulkText);
  }, [mode, singleUrl, bulkText]);

  const validUrls = useMemo(
    () => urlsToProcess.filter(isValidUrl),
    [urlsToProcess]
  );
  const invalidUrls = useMemo(
    () => urlsToProcess.filter((u) => !isValidUrl(u)),
    [urlsToProcess]
  );

  const stats = useMemo(() => {
    const ok = results.filter((r) => r.ok).length;
    const fail = results.filter((r) => !r.ok).length;
    return { ok, fail, total: results.length };
  }, [results]);

  const saveToHistory = (entry) => {
    const next = [entry, ...history].slice(0, 20);
    setHistory(next);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      // ignore
    }
  };

  const run = async () => {
    setError("");
    setResults([]);

    if (urlsToProcess.length === 0) {
      setError("Please enter at least one URL.");
      return;
    }

    if (invalidUrls.length > 0) {
      setError(
        `Some URLs are invalid. Fix them first. Invalid count: ${invalidUrls.length}`
      );
      return;
    }

    setLoading(true);

    const out = [];
    for (const url of validUrls) {
      try {
        const res = await axiosInstance.post(`/api/index${endpoint}`, { url });
        out.push({
          url,
          ok: true,
          message: res.data?.message || "Success",
          apiResponse: res.data?.apiResponse || null,
          at: new Date().toISOString(),
        });
      } catch (e) {
        out.push({
          url,
          ok: false,
          message: e?.response?.data?.message || e?.message || "Failed",
          apiResponse: e?.response?.data?.error || null,
          at: new Date().toISOString(),
        });
      }
    }

    setResults(out);
    saveToHistory({
      at: new Date().toISOString(),
      action,
      mode,
      count: validUrls.length,
      ok: out.filter((r) => r.ok).length,
      fail: out.filter((r) => !r.ok).length,
      sample: out.slice(0, 3).map((r) => r.url),
    });

    setLoading(false);
  };

  return (
    <div className="px-6 sm:px-10 py-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Indexing API</h1>
          <p className="text-sm text-gray-500 mt-1">{humanSummary}</p>
        </div>
        <Badge tone="purple">POST {endpoint}</Badge>
      </div>

      {/* Controls */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-purple-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end sm:justify-between">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Action */}
              <div className="min-w-[220px]">
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                  Action
                </label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-purple-200 bg-white text-sm
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                >
                  <option value="publish">Publish (URL_UPDATED)</option>
                  <option value="remove">Remove (URL_REMOVED)</option>
                </select>
              </div>

              {/* Mode */}
              <div className="min-w-[180px]">
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                  Mode
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-purple-200 bg-white text-sm
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                >
                  <option value="single">Single URL</option>
                  <option value="bulk">Bulk URLs</option>
                </select>
              </div>
            </div>

            <button
              onClick={run}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium
                         hover:bg-purple-700 disabled:opacity-60"
            >
              {loading ? "Sending..." : actionLabel}
            </button>
          </div>

          {/* Inputs */}
          <div className="mt-4">
            {mode === "single" ? (
              <>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                  URL
                </label>
                <input
                  value={singleUrl}
                  onChange={(e) => setSingleUrl(e.target.value)}
                  placeholder="https://gyapak.in/jobs/xyz"
                  className="w-full px-3 py-2 rounded-lg border border-purple-200 bg-white text-sm
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                />
                <div className="mt-2 text-xs text-gray-500">
                  Tip: Use full canonical URL (https://…).
                </div>
              </>
            ) : (
              <>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                  URLs (paste one per line)
                </label>
                <textarea
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder={`https://gyapak.in/jobs/one\nhttps://gyapak.in/jobs/two`}
                  rows={7}
                  className="w-full px-3 py-2 rounded-lg border border-purple-200 bg-white text-sm
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                />
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <Badge tone={invalidUrls.length ? "red" : "green"}>
                    Valid: {validUrls.length}
                  </Badge>
                  <Badge tone={invalidUrls.length ? "red" : "gray"}>
                    Invalid: {invalidUrls.length}
                  </Badge>
                </div>

                {invalidUrls.length > 0 && (
                  <div className="mt-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                    Invalid URLs:
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {invalidUrls.slice(0, 10).map((u) => (
                        <li key={u} className="break-all">
                          {u}
                        </li>
                      ))}
                    </ul>
                    {invalidUrls.length > 10 && (
                      <div className="mt-1">
                        …and {invalidUrls.length - 10} more
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}
        </div>

        {/* Right side: Results stats + history */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">Run summary</h3>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="purple">Action: {action}</Badge>
            <Badge tone="gray">Mode: {mode}</Badge>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl border border-gray-200 p-3">
              <div className="text-xs text-gray-500">Total</div>
              <div className="text-lg font-semibold text-gray-900">
                {stats.total}
              </div>
            </div>
            <div className="rounded-xl border border-green-200 bg-green-50 p-3">
              <div className="text-xs text-green-800">Success</div>
              <div className="text-lg font-semibold text-green-900">
                {stats.ok}
              </div>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 p-3">
              <div className="text-xs text-red-800">Failed</div>
              <div className="text-lg font-semibold text-red-900">
                {stats.fail}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">
              History (last 20)
            </h4>
            <button
              onClick={clearHistory}
              className="text-xs font-medium text-gray-600 hover:text-gray-900"
            >
              Clear
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {history.length === 0 ? (
              <div className="text-xs text-gray-500">No history yet.</div>
            ) : (
              history.map((h, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-gray-200 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone="purple">{h.action}</Badge>
                    <div className="text-xs text-gray-500">
                      {fmtDateTime(h.at)}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-700">
                    {h.ok} ok / {h.fail} fail • {h.count} urls
                  </div>
                  {Array.isArray(h.sample) && h.sample.length > 0 && (
                    <div className="mt-2 text-[11px] text-gray-500 break-all">
                      Sample: {h.sample.join(" • ")}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Results table */}
      {results.length > 0 && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-gray-900">Results</h3>
            <div className="flex gap-2">
              <Badge tone="green">Success: {stats.ok}</Badge>
              <Badge tone="red">Failed: {stats.fail}</Badge>
            </div>
          </div>

          <div className="mt-4 overflow-auto">
            <table className="min-w-[1000px] w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b">
                  <th className="py-2">URL</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Message</th>
                  <th className="py-2">Published / Notified</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => {
                  const notifiedAt =
                    r?.apiResponse?.notifyTime ||
                    r?.apiResponse?.latestUpdate?.notifyTime;

                  return (
                    <tr key={r.url} className="border-b last:border-b-0">
                      <td className="py-3 pr-4">
                        <a
                          className="font-medium text-purple-700 hover:underline break-all"
                          href={r.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {r.url}
                        </a>
                      </td>
                      <td className="py-3">
                        {r.ok ? (
                          <Badge tone="green">OK</Badge>
                        ) : (
                          <Badge tone="red">FAIL</Badge>
                        )}
                      </td>
                      <td className="py-3">{r.message}</td>
                      <td className="py-3">{fmtDateTime(notifiedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Debug expandable */}
          <details className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer text-sm font-semibold text-gray-900">
              Raw API responses (debug)
            </summary>
            <pre className="mt-3 text-xs overflow-auto bg-gray-50 border border-gray-200 rounded-lg p-3">
              {JSON.stringify(results, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
