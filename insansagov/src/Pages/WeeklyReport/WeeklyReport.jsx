import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { 
  Download, 
  Loader2, 
  AlertCircle, 
  ExternalLink,
  Share2,
  Copy,
  Check
} from "lucide-react";
import { useApi } from "../../Context/ApiContext";

const IconBtn = ({ onClick, children, title, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-1.5 sm:p-2 rounded-full bg-white/95 hover:bg-white shadow-md hover:shadow-lg ring-1 ring-black/5 transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
  >
    {children}
  </button>
);

const WeeklyReport = () => {
  const { apiBaseUrl } = useApi();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [copied, setCopied] = useState(false);
  const iframeWrapRef = useRef(null);
  const headerRef = useRef(null);
  const [headerH, setHeaderH] = useState(0);

  // Measure header height for full-screen display
  useEffect(() => {
    const measure = () => setHeaderH(headerRef.current?.offsetHeight || 0);
    measure();
    const ro = new ResizeObserver(measure);
    if (headerRef.current) ro.observe(headerRef.current);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  const minSlideH = `calc(100vh - ${headerH}px)`;

  useEffect(() => {
    const fetchWeeklyReport = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${apiBaseUrl}/api/v1i2/reports/fetch`);
        
        if (response.data && response.data.data) {
          setReportData(response.data.data);
        } else {
          setError("No report data available");
        }
      } catch (err) {
        console.error("Error fetching weekly report:", err);
        setError(err.response?.data?.message || "Failed to load weekly report. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyReport();
  }, [apiBaseUrl]);

  // Prevent parent page scroll when user scrolls inside the embed
  useEffect(() => {
    const el = iframeWrapRef.current;
    if (!el) return;

    const stop = (e) => e.stopPropagation();
    el.addEventListener("wheel", stop, { passive: false });
    el.addEventListener("touchmove", stop, { passive: false });
    return () => {
      el.removeEventListener("wheel", stop);
      el.removeEventListener("touchmove", stop);
    };
  }, [reportData?.pdfUrl]);

  const handleDownload = () => {
    if (!reportData?.pdfUrl) return;
    const link = document.createElement("a");
    link.href = reportData.pdfUrl;
    link.download = "weekly_events_report.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    const shareData = {
      title: "Weekly Events Report",
      text: "Check out the latest weekly events report",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Fall back to copy
      }
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
          <p className="text-lg main-site-text-color">Loading weekly report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-red-200 p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Error Loading Report</h2>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full mt-10">
      {/* Header */}
      <header
        ref={headerRef}
        className="sticky top-0 z-40 pt-8 sm:pt-10 border-b main-site-border-color"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 mt-16 md:mt-20 text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl font-bold main-site-text-color mb-3 relative inline-block">
                <span className="relative z-10">Weekly Events Report</span>
                <span className="absolute -bottom-2 left-0 w-full h-2 light-site-color-2 transform -rotate-1 rounded z-0"></span>
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mt-1 max-w-xl mx-auto md:mx-0">
                Last Date to Apply for Online &amp; Offline Government Jobs Applications
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* PDF Viewer - Reel Style */}
      <main className="w-full overflow-y-auto">
        <section
          className="w-full relative flex items-center justify-center px-2 sm:px-3 md:px-4 py-4 sm:py-6 md:py-8 lg:py-10"
          style={{ minHeight: minSlideH }}
        >
          <div
            className="relative mx-auto rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.24)] sm:shadow-[0_12px_48px_rgba(0,0,0,0.28)] ring-1 ring-black/10 bg-neutral-950 w-full max-w-[96vw] sm:max-w-[90vw] md:max-w-[640px] lg:max-w-[720px]"
            style={{ 
              height: `calc(${minSlideH} - 2rem)`,
              aspectRatio: "9 / 16",
              maxHeight: "85vh"
            }}
          >
            {/* PDF Viewer */}
            {reportData?.pdfUrl && (
              <div ref={iframeWrapRef} className="h-full w-full overflow-auto">
                <iframe
                  src={reportData.pdfUrl}
                  title="Weekly Report PDF"
                  className="h-full w-full min-h-full"
                  style={{ pointerEvents: "auto" }}
                />
              </div>
            )}

            {/* Bottom overlay */}
            <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 z-20">
              <div className="rounded-lg sm:rounded-xl bg-black/80 backdrop-blur-md px-3 sm:px-4 py-2.5 sm:py-3 ring-1 ring-white/10 shadow-xl">
                <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base sm:text-lg md:text-xl font-bold leading-tight text-white mb-0.5">
                      Weekly Events Report
                    </h2>
                    <p className="text-xs sm:text-sm text-white/70 font-medium">
                      Last Date to Apply for Government Jobs
                    </p>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <IconBtn title="Download PDF" onClick={handleDownload}>
                      <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-700" />
                    </IconBtn>
                    <IconBtn
                      title="Open in new tab"
                      onClick={() => window.open(reportData?.pdfUrl, "_blank")}
                    >
                      <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-700" />
                    </IconBtn>
                    <IconBtn title="Share" onClick={handleShare}>
                      <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-700" />
                    </IconBtn>
                  </div>
                </div>

                <div className="flex items-center pb-4 sm:pb-6 mb-1 sm:mb-2 flex-wrap gap-1 sm:gap-1.5">
                  <IconBtn
                    title="Copy link"
                    onClick={copyLink}
                    className="bg-white/95 hover:bg-white"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-700" />
                    )}
                  </IconBtn>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default WeeklyReport;
