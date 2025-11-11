import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
    useCallback,
  } from "react";
  import {
    Share2,
    Copy,
    Check,
    ExternalLink,
    Loader2,
    AlertTriangle,
    Download,
  } from "lucide-react";

  function toDrivePreview(url) {
    try {
      const u = new URL(url);
      const host = u.hostname.replace("www.", "");
      if (!host.includes("drive.google.com")) return null;
  
      const path = u.pathname || "";
      const searchId = u.searchParams.get("id");
  
      let id = null;
      const m = path.match(/\/file\/d\/([^/]+)/);
      if (m && m[1]) id = m[1];
      if (!id && searchId) id = searchId;
  
      if (id) return `https://drive.google.com/file/d/${id}/preview`;
      return null;
    } catch {
      return null;
    }
  }
  
  function extractDriveId(url) {
    try {
      const u = new URL(url);
      const host = u.hostname.replace("www.", "");
      if (!host.includes("drive.google.com")) return null;
  
      const m = u.pathname.match(/\/file\/d\/([^/]+)/);
      if (m && m[1]) return m[1];
  
      const q = u.searchParams.get("id");
      if (q) return q;
  
      return null;
    } catch {
      return null;
    }
  }
  

function driveDownloadUrl(url) {
    const id = extractDriveId(url);
    return id ? `https://drive.google.com/uc?export=download&id=${id}` : null;
  }
  
  function looksLikePdf(url) {
    return /\.pdf(\?|$)/i.test(url);
  }
  
  /** Share route on your site rather than raw file */
  function buildWebsiteShareUrl(itemId, title) {
    const baseUrl = window.location.origin;
    return `${baseUrl}/daily-updates`;
  }
  

function buildShareLinks(itemId, title = "Daily Update") {
    const websiteUrl = buildWebsiteShareUrl(itemId, title);
    const encoded = encodeURIComponent(websiteUrl);
    const text = encodeURIComponent(`${title}\n${websiteUrl}`);
    return {
      websiteUrl,
      whatsapp: `https://wa.me/?text=${text}`,
      telegram: `https://t.me/share/url?url=${encoded}&text=${encodeURIComponent(
        title
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodeURIComponent(
        title
      )}`,
    };
  }
  
  const IconBtn = ({ onClick, children, title, className = "" }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-full bg-white/95 hover:bg-white shadow-md hover:shadow-lg ring-1 ring-black/5 transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
  
  const ScrollHint = ({ className = "" }) => (
    <div
      className={[
        "pointer-events-none select-none",
        "flex items-center gap-2",
        "px-3 py-1 rounded-full",
        "bg-neutral-900/80 text-white ring-1 ring-white/15 backdrop-blur-sm",
        "shadow-md",
        "animate-bounce-slow",
        className,
      ].join(" ")}
    >
      <span className="hidden sm:inline font-medium tracking-wide">Scroll</span>
      <div className="flex -space-y-2">
        {/* <ChevronDown className="h-4 w-4" /> */}
        <ChevronDown className="h-4 w-4 opacity-70" />
      </div>
    </div>
  );

const ReelSlide = ({ item, isLast, minH }) => {
    const [copied, setCopied] = useState(false);
    const iframeWrapRef = useRef(null);
    const [showMore , setShowMore] = useState(false);
  
    const rawDesc = (item?.description ?? "").trim();
    const MAX_CHARS = 25; // tweak as you like
    const isLong = rawDesc.length > MAX_CHARS;
    const visibleText = showMore ? rawDesc : rawDesc.slice(0, MAX_CHARS);
  
    const previewUrl = useMemo(() => {
      const drive = toDrivePreview(item.pdfLink);
      if (drive) return drive;
      if (looksLikePdf(item.pdfLink)) return item.pdfLink;
      return null;
    }, [item.pdfLink]);
  
    // prevent parent page scroll when user scrolls inside the embed
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
    }, [previewUrl]);
  
    const share = useCallback(async () => {
      const websiteUrl = buildWebsiteShareUrl(item.id, item.title);
      const shareData = {
        title: item.title || "Daily Update",
        text: item.title || "Daily Update",
        url: websiteUrl,
      };
      if (navigator.share) {
        try {
          await navigator.share(shareData);
          return;
        } catch {
          /* fall back */
        }
      }
      // Fallback buttons are visible below.
    }, [item.id, item.title]);
  
    const copyLink = async () => {
      try {
        const websiteUrl = buildWebsiteShareUrl(item.id, item.title);
        await navigator.clipboard.writeText(websiteUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } catch {
        setCopied(false);
      }
    };
  
    const startDownload = () => {
      // Prefer Drive download if possible
      const dl = driveDownloadUrl(item.pdfLink);
      const isDirectPdf = looksLikePdf(item.pdfLink);
  
      const href = dl || (isDirectPdf ? item.pdfLink : null);
  
      if (!href) {
        // fallback: open original link (may be non-embeddable)
        window.open(item.pdfLink, "_blank", "noopener,noreferrer");
        return;
      }
  
      // Attempt to trigger a download/open. Cross-origin headers may force this to open a new tab.
      const a = document.createElement("a");
      a.href = href;
      a.target = "_blank"; // safest for cross-origin
      // Suggest a filename for direct PDFs (browsers may ignore for cross-origin)
      const safeTitle =
        (item.title || "daily-update").replace(/[^\w.-]+/g, "_") + ".pdf";
      if (!dl) {
        // only set download name for same-origin or direct PDFs; Drive url will handle download server-side
        a.setAttribute("download", safeTitle);
      }
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
  
    const { whatsapp, telegram, twitter } = useMemo(
      () => buildShareLinks(item.id, item.title),
      [item.id, item.title]
    );
  
    return (
      <section
    className="w-full snap-start relative flex items-center justify-center px-3 sm:px-4 py-8 sm:py-10 lg:py-12"
    style={{ minHeight: minH }}
  >
    <div
      className="relative mx-auto rounded-2xl overflow-hidden ... max-w-[92vw] md:max-w-[640px] lg:max-w-[720px]"
      style={{ height: "100%", aspectRatio: "9 / 16" }}
    >
  
          {/* BIGGER card:
              - Height-driven so it fills the viewport below the header
              - aspect-ratio keeps 9:16 and computes width from height
              - max width safety to avoid ultra-wide on very tall screens */}
          <div
            className="relative mx-auto rounded-2xl overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.28)] ring-1 ring-black/10 bg-neutral-950 max-w-[92vw] md:max-w-[640px] lg:max-w-[720px]"
            style={{ height: minH, aspectRatio: "9 / 16" }}
          >
            {/* loader */}
            <div className="absolute inset-0 grid place-items-center pointer-events-none z-10 bg-black/10">
              <Loader2
                className={`h-10 w-10 animate-spin text-white transition-opacity duration-300 ${
                  previewUrl ? "opacity-0" : "opacity-100"
                }`}
              />
            </div>
  
            {/* drive preview */}
            {previewUrl && toDrivePreview(item.pdfLink) && (
              <div ref={iframeWrapRef} className="h-full w-full overflow-auto">
                <iframe
                  src={previewUrl}
                  title={item.title || "Daily Update"}
                  className="h-full w-full min-h-full"
                  allow="autoplay; fullscreen"
                  style={{ pointerEvents: "auto" }}
                />
              </div>
            )}
  
            {/* direct pdf */}
            {previewUrl && looksLikePdf(previewUrl) && !toDrivePreview(item.pdfLink) && (
              <div ref={iframeWrapRef} className="h-full w-full overflow-auto">
                <object
                  data={previewUrl}
                  type="application/pdf"
                  className="h-full w-full min-h-full"
                  style={{ pointerEvents: "auto" }}
                >
                  <iframe
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                      previewUrl
                    )}&embedded=true`}
                    className="h-full w-full"
                    title={item.title || "Daily Update"}
                    style={{ pointerEvents: "auto" }}
                  />
                </object>
              </div>
            )}
  
            {/* not embeddable */}
            {!previewUrl && (
              <div className="h-full w-full flex flex-col items-center justify-center gap-6 p-8 bg-gradient-to-br from-neutral-900 to-neutral-800">
                <div className="bg-amber-500/10 p-4 rounded-2xl ring-1 ring-amber-500/20">
                  <AlertTriangle className="h-10 w-10 text-amber-400" />
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-2xl font-semibold text-white">
                    Preview Not Available
                  </h3>
                  <p className="text-white/70 text-sm px-4 leading-relaxed">
                    This content can’t be displayed here. Open it in a new tab.
                  </p>
                </div>
                <a
                  href={item.pdfLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium inline-flex items-center gap-2.5 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Link
                </a>
              </div>
            )}
  
            {/* bottom overlay */}
            <div className="absolute inset-x-0 bottom-0 p-3 z-20">
              <div className="rounded-xl bg-black/80 backdrop-blur-md px-4 py-3 ring-1 ring-white/10 shadow-xl">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg md:text-xl font-bold leading-tight text-white mb-0.5">
                      {item.title || "Daily Update"}
                    </h2>
                   
                    {item.date && (
                      <p className="text-xs md:text-sm text-white/70 font-medium">
                        {new Date(item.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    )}
  
                    {
                      item?.description && (
                        <div className="mt-4">
                      {/* text */}
                          <p className="text-sm md:text-base font-medium leading-snug text-white/80">
                            {rawDesc
                              ? (
                                <>
                                  {visibleText}
                                  {!showMore && isLong && "…"}
                                </>
                              )
                              : "Daily Update"}
                          </p>
  
                          {/* read more/less */}
                          {isLong && (
                            <button
                              type="button"
                              onClick={() => setShowMore((prev) => !prev)}
                              className="mt-1 text-blue-400 hover:text-blue-500 underline underline-offset-2 text-xs md:text-sm"
                              aria-expanded={showMore}
                            >
                              {showMore ? "Read less" : "Read more"}
                            </button>
                          )}
                        </div>
                      )
                    }
                    
  
                  </div>
                  <div className="flex items-center gap-1.5">
                    <IconBtn title="Download PDF" onClick={startDownload}>
                      <Download className="h-4 w-4 text-slate-700" />
                    </IconBtn>
                    <IconBtn
                      title="Open in new tab"
                      onClick={() => window.open(item.pdfLink, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 text-slate-700" />
                    </IconBtn>
                    <IconBtn title="Share" onClick={share}>
                      <Share2 className="h-4 w-4 text-slate-700" />
                    </IconBtn>
                  </div>
                </div>
  
                <div className="flex items-center pb-6 mb-2 flex-wrap gap-1.5">
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-slate-800 text-xs font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 ring-1 ring-black/5"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={telegram}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-slate-800 text-xs font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 ring-1 ring-black/5"
                  >
                    Telegram
                  </a>
                  {/* <a
                    href={twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-slate-800 text-xs font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 ring-1 ring-black/5"
                  >
                    X
                  </a> */}
                  <IconBtn
                    title="Copy link"
                    onClick={copyLink}
                    className="bg-white/95 hover:bg-white"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-slate-700" />
                    )}
                  </IconBtn>
                </div>
              </div>
            </div>
          </div>
  
          {/* Scroll hint (hidden on last) */}
          {/* Scroll hint — always visible except on last slide */}
          {!isLast && (
            <ScrollHint
              className="absolute bottom-4  left-1/2 -translate-x-1/2 z-30 text-xs sm:text-sm"
            />
          )}
  
        </div>
      </section>
    );
  };

export default ReelSlide
