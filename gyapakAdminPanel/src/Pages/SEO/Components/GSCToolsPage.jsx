import React, { useMemo, useState } from "react";
import axios from "axios";

// const API_BASE = "http://localhost:3000/api/gsc";

const isValidUrl = (value) => {
  try {
    // allow only http(s)
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

const fmt = (v) => (v ? String(v) : "—");

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
  const toneCls =
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
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs border ${toneCls}`}>
      {children}
    </span>
  );
}

export default function GSCToolsPage({url}) {
  // Sitemap submit
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [sitemapLoading, setSitemapLoading] = useState(false);
  const [sitemapResp, setSitemapResp] = useState(null);
  const [sitemapErr, setSitemapErr] = useState("");

  // URL inspection
  const [inspectUrl, setInspectUrl] = useState("");
  const [inspectLoading, setInspectLoading] = useState(false);
  const [inspectResp, setInspectResp] = useState(null);
  const [inspectErr, setInspectErr] = useState("");

  const verdictTone = useMemo(() => {
    const v = inspectResp?.verdict;
    if (!v) return "gray";
    if (v === "PASS") return "green";
    if (v === "FAIL") return "red";
    return "yellow"; // NEUTRAL etc.
  }, [inspectResp]);

  const onGoogleTone = useMemo(() => {
    if (inspectResp?.isOnGoogle === true) return "green";
    if (inspectResp?.isOnGoogle === false) return "red";
    return "gray";
  }, [inspectResp]);

  const submitSitemap = async () => {
    setSitemapErr("");
    setSitemapResp(null);

    // optional validation
    if (sitemapUrl && !isValidUrl(sitemapUrl)) {
      setSitemapErr("Please enter a valid sitemap URL (http/https), or leave empty to use default.");
      return;
    }

    setSitemapLoading(true);
    try {
      const res = await axios.post(`${url}/gsc/sitemap/submit`, {
        sitemapUrl: sitemapUrl?.trim() || undefined,
      });
      setSitemapResp(res.data);
    } catch (e) {
      console.log(e);
      setSitemapErr(e?.response?.data?.message || e?.message || "Failed to submit sitemap");
    } finally {
      setSitemapLoading(false);
    }
  };

  const inspect = async () => {
    setInspectErr("");
    setInspectResp(null);

    if (!inspectUrl?.trim()) {
      setInspectErr("URL is required.");
      return;
    }
    if (!isValidUrl(inspectUrl.trim())) {
      setInspectErr("Please enter a valid URL (http/https).");
      return;
    }

    setInspectLoading(true);
    try {
      const res = await axios.post(`${url}/gsc/inspect`, { url: inspectUrl.trim() });
      setInspectResp(res.data);
    } catch (e) {
      console.log(e);
      setInspectErr(e?.response?.data?.message || e?.message || "Failed to inspect URL");
    } finally {
      setInspectLoading(false);
    }
  };

  return (
    <div className="px-6 sm:px-10 py-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">GSC Tools</h1>
        <p className="text-sm text-gray-500 mt-1">
          Submit sitemap to Search Console and inspect indexing status for any URL.
        </p>
      </div>

      {/* 2-column layout */}
      <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Sitemap submit */}
        <div className="rounded-2xl border border-purple-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Submit Sitemap</h2>
              <p className="text-xs text-gray-500 mt-1">
                If empty, backend uses default: <span className="font-medium">/sitemap.xml</span>
              </p>
            </div>
            <Badge tone="purple">POST /sitemap/submit</Badge>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
              Sitemap URL (optional)
            </label>
            <input
              value={sitemapUrl}
              onChange={(e) => setSitemapUrl(e.target.value)}
              placeholder="https://gyapak.in/sitemap.xml"
              className="w-full px-3 py-2 rounded-lg border border-purple-200 bg-white text-sm text-gray-800
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
            />
            <div className="mt-3 flex gap-2">
              <button
                onClick={submitSitemap}
                disabled={sitemapLoading}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium
                           hover:bg-purple-700 disabled:opacity-60"
              >
                {sitemapLoading ? "Submitting..." : "Submit Sitemap"}
              </button>
              <button
                onClick={() => {
                  setSitemapUrl("");
                  setSitemapResp(null);
                  setSitemapErr("");
                }}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50"
              >
                Reset
              </button>
            </div>

            {sitemapErr && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {sitemapErr}
              </div>
            )}

            {sitemapResp?.success && (
              <div className="mt-3 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-900">
                <div className="font-semibold">{sitemapResp.message}</div>
                <div className="mt-1 text-xs">
                  Submitted sitemap:{" "}
                  <a
                    href={sitemapResp.sitemapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium underline"
                  >
                    {sitemapResp.sitemapUrl}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* URL Inspection */}
        <div className="rounded-2xl border border-purple-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Inspect URL</h2>
              <p className="text-xs text-gray-500 mt-1">
                Checks if Google can index it, last crawl, canonical, robots status, etc.
              </p>
            </div>
            <Badge tone="purple">POST /inspect</Badge>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
              Page URL
            </label>
            <input
              value={inspectUrl}
              onChange={(e) => setInspectUrl(e.target.value)}
              placeholder="https://gyapak.in/some-page"
              className="w-full px-3 py-2 rounded-lg border border-purple-200 bg-white text-sm text-gray-800
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
            />

            <div className="mt-3 flex gap-2">
              <button
                onClick={inspect}
                disabled={inspectLoading}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium
                           hover:bg-purple-700 disabled:opacity-60"
              >
                {inspectLoading ? "Inspecting..." : "Inspect URL"}
              </button>
              <button
                onClick={() => {
                  setInspectUrl("");
                  setInspectResp(null);
                  setInspectErr("");
                }}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50"
              >
                Reset
              </button>
            </div>

            {inspectErr && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {inspectErr}
              </div>
            )}

            {/* Results */}
            {inspectResp?.success && (
              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge tone={onGoogleTone}>
                    {inspectResp.isOnGoogle ? "Indexed on Google" : "Not confirmed indexed"}
                  </Badge>
                  <Badge tone={verdictTone}>Verdict: {fmt(inspectResp.verdict)}</Badge>
                  <Badge tone={inspectResp.indexingState === "INDEXING_ALLOWED" ? "green" : "yellow"}>
                    {fmt(inspectResp.indexingState)}
                  </Badge>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Human explanation</div>

                  <div className="mt-2 text-sm text-gray-700 leading-relaxed space-y-2">
                    <p>
                      Google’s verdict is <span className="font-semibold">{fmt(inspectResp.verdict)}</span>.{" "}
                      {inspectResp.isOnGoogle
                        ? "This strongly indicates the page is indexed."
                        : "This does not guarantee indexing yet (or indexing could be blocked/limited)."}
                    </p>

                    <p>
                      Coverage: <span className="font-semibold">{fmt(inspectResp.coverageState)}</span>. Last crawl:{" "}
                      <span className="font-semibold">{fmtDateTime(inspectResp.lastCrawlTime)}</span>.
                    </p>

                    <p>
                      Robots status: <span className="font-semibold">{fmt(inspectResp.robotsTxtState)}</span>. Fetch state:{" "}
                      <span className="font-semibold">{fmt(inspectResp.pageFetchState)}</span>.
                    </p>

                    <p>
                      Canonical: Google chose{" "}
                      <span className="font-semibold break-all">{fmt(inspectResp.googleCanonical)}</span>
                      {inspectResp.userCanonical ? (
                        <>
                          {" "}
                          (you specified{" "}
                          <span className="font-semibold break-all">{fmt(inspectResp.userCanonical)}</span>)
                        </>
                      ) : null}
                      .
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Key fields</div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-xs text-gray-500">URL</div>
                      <div className="font-medium break-all">{inspectResp.url}</div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500">Coverage State</div>
                      <div className="font-medium">{fmt(inspectResp.coverageState)}</div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500">Indexing State</div>
                      <div className="font-medium">{fmt(inspectResp.indexingState)}</div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500">Last Crawl Time</div>
                      <div className="font-medium">{fmtDateTime(inspectResp.lastCrawlTime)}</div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500">Sitemaps</div>
                      <div className="font-medium break-all">
                        {Array.isArray(inspectResp.sitemaps) && inspectResp.sitemaps.length
                          ? inspectResp.sitemaps.join(", ")
                          : "—"}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500">Inspection Result Link</div>
                      {inspectResp.inspectionResultLink ? (
                        <a
                          href={inspectResp.inspectionResultLink}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-purple-700 hover:underline break-all"
                        >
                          Open in Search Console
                        </a>
                      ) : (
                        <div className="font-medium">—</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Raw JSON */}
                <details className="rounded-xl border border-gray-200 bg-white p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-gray-900">
                    Raw inspection JSON (debug)
                  </summary>
                  <pre className="mt-3 text-xs overflow-auto bg-gray-50 border border-gray-200 rounded-lg p-3">
                    {JSON.stringify(inspectResp.raw, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
