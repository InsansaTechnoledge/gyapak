import puppeteer from "puppeteer";

/**
 * generateCriticalEventsBookletPDF(report)
 *
 * - report: result returned by generateReportData(period)
 * - returns: Buffer (PDF)
 *
 * Assumptions:
 * - report.upcomingEvents.urgent is an array of events; each event may include:
 *   name, end_date, daysRemaining, event_type, organization_id {name, abbreviation},
 *   apply_link, briefDetails (HTML string), imageUrl (optional)
 *
 * Usage:
 * const pdfBuffer = await generateCriticalEventsBookletPDF(report);
 */
export const generateCriticalEventsBookletPDF = async (report) => {
    const urgentEvents = report.upcomingEvents?.urgent || [];
const soonEvents = report.upcomingEvents?.soon || [];
const upcomingEvents = report.upcomingEvents?.upcoming || [];

  const criticalEvents = (report.upcomingEvents?.urgent || []).map((e) => {
    // normalize fields if necessary
    return {
      name: e.name || "Untitled",
      end_date: e.end_date || null,
      daysRemaining: e.daysRemaining ?? (() => {
        if (!e.end_date) return "-";
        const diff = Math.ceil((new Date(e.end_date) - new Date()) / (1000*60*60*24));
        return diff > 0 ? diff : 0;
      })(),
      event_type: e.event_type || "Opportunity",
      organization: (e.organization_id && (e.organization_id.name || "")) || "Unknown",
      abbreviation: (e.organization_id && e.organization_id.abbreviation) || "",
      apply_link: `https://gyapak.in`,
      briefDetails: e.briefDetails || "",
      imageUrl: e.imageUrl || null
    };
  });

  // summary to place on front (after cover)
  const totalEvents = criticalEvents.length;
  const nearestDeadline = criticalEvents.reduce((min, ev) => {
    if (!ev.end_date) return min;
    const d = new Date(ev.end_date).getTime();
    return min === null ? d : Math.min(min, d);
  }, null);
  const nearestDays = nearestDeadline ? Math.ceil((nearestDeadline - Date.now())/(1000*60*60*24)) : "-";

  // mapping event_type -> color (category tags + urgency colors)
  const typeColor = (type) => {
    const t = (type || "").toLowerCase();
    if (t.includes("critical") || t.includes("urgent")) return "#ef4444"; // red
    if (t.includes("high")) return "#f97316"; // orange
    if (t.includes("medium")) return "#f59e0b"; // amber
    return "#6C2BD9"; // gyapak purple fallback
  };

  // page numbering plan:
  // 1 = Cover
  // 2 = Summary
  // 3 = Table of Contents
  // 4.. = Events (one event per page)
  const coverPage = 1;
  const summaryPage = 2;
  const tocPage = 3;
  const eventsStartPage = 4;

  // build TOC entries (we assume events map to sequential pages starting at eventsStartPage)
  const tocEntries = criticalEvents.map((ev, idx) => {
    return {
      title: ev.name,
      page: eventsStartPage + idx
    };
  });

  // formatted date
  const generatedOn = new Date(report.reportGenerated || Date.now()).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric"
  });

  // Build the HTML body (cover, summary, TOC, event pages)
  // Important: HEADER/FOOTER will be provided by puppeteer headerTemplate/footerTemplate (so we DO NOT include header/footer inside body)
  const htmlParts = [];

  /* ---------- COVER PAGE (B: Gyapak Branding Style) ---------- */
  htmlParts.push(`
    <section class="cover" style="page-break-after: always;">
      <div class="cover-wrap">
        <div class="cover-content">
          <div class="logo">GYAPAK</div>
          <h1 class="cover-title">Critical Events Booklet</h1>
          <p class="cover-sub">Curated urgent opportunities & deadlines</p>

          <div class="cover-meta">
            <div><strong>Generated:</strong> ${generatedOn}</div>
            <div><strong>Period:</strong> ${report.period?.label ?? "Recent"}</div>
            <div><strong>Total Critical Events:</strong> ${totalEvents}</div>
          </div>
        </div>
      </div>
    </section>
  `);

  /* ---------- SUMMARY PAGE (after cover) - user asked summary on front */
  htmlParts.push(`
    <section class="summary" style="page-break-after: always;">
      <div class="summary-wrap">
        <h2>Summary</h2>
        <div class="summary-grid">
          <div class="summary-card">
            <div class="summary-number">${totalEvents}</div>
            <div class="summary-label">Total Critical Events</div>
          </div>

          <div class="summary-card">
            <div class="summary-number">${nearestDays === "-" ? "-" : nearestDays}</div>
            <div class="summary-label">Days until nearest deadline</div>
          </div>

          <div class="summary-card">
            <div class="summary-number">${report.insights?.criticalEventsCount ?? totalEvents}</div>
            <div class="summary-label">Critical events (reported)</div>
          </div>

          <div class="summary-card">
            <div class="summary-number">${report.summary?.totalEntries ?? "-"}</div>
            <div class="summary-label">Total entries (all sections)</div>
          </div>
        </div>

        <div class="summary-note">
          <p>Note: "Apply Now" links forward to the official Gyapak event page when available.</p>
        </div>
      </div>
    </section>
  `);

  /* ---------- TABLE OF CONTENTS (style B with dotted lines + category tags C) ---------- */
  const tocHtmlEntries = tocEntries.map((t, i) => {
    // also include a small color tag from corresponding event type
    const ev = criticalEvents[i];
    const color = typeColor(ev.event_type);
    return `
      <li class="toc-item">
        <span class="toc-left">
          <span class="toc-dot" style="background:${color}"></span>
          <span class="toc-title">${escapeHtmlText(ev.name)}</span>
        </span>
        <span class="toc-dots"></span>
        <span class="toc-page">Pg. ${t.page}</span>
      </li>
    `;
  }).join("");

  htmlParts.push(`
    <section class="toc" style="page-break-after: always;">
      <div class="toc-wrap">
        <h2>Table of Contents</h2>
        <ol class="toc-list">
          ${tocHtmlEntries || `<li style="color:#666">No items</li>`}
        </ol>
      </div>
    </section>
  `);

  /* ---------- EVENT PAGES: each event full-width on its own page ---------- */

/* ---------- MULTI-CATEGORY EVENT PAGES (Urgent, Soon, Upcoming, Recently Added) ---------- */

function buildCategoryPages(title, color, list) {
  if (!list || list.length === 0) return "";

  return `
    <section style="page-break-before: always;"></section>

    <section class="category-heading">
      <h2 style="color:${color}; border-left:6px solid ${color}; padding-left:12px; font-size:22px; margin:40px 0 20px;">
        ${title}
      </h2>
    </section>

    ${list.map(ev => renderSingleEventPage(ev)).join("")}
  `;
}


function renderSingleEventPage(ev) {
  const color = typeColor(ev.event_type);
  const endDateStr = ev.end_date ? new Date(ev.end_date).toLocaleDateString("en-IN") : "N/A";
  const daysBadge = typeof ev.daysRemaining === "number" ? `${ev.daysRemaining} Days Remaining` : `${ev.daysRemaining}`;

  return `
    <section class="event-page">
      <article class="event-article">
        
        <div class="event-body">
          <div class="event-header">
            <h3 class="event-title">${escapeHtmlText(ev.name)}</h3>

            <div class="days-badge">
              ${daysBadge}
            </div>
          </div>

          <div class="event-meta">
            <span class="meta-org">
              <strong>Organization:</strong> ${escapeHtmlText(ev.organization_id.name)}${ev.organization_id.abbreviation ? ' ('+escapeHtmlText(ev.organization_id.abbreviation)+')' : ''}
            </span>

            <span class="meta-type" style="background:${color}; color:#fff; padding:4px 8px; border-radius:12px; margin-left:10px; font-size:12px;">
              ${escapeHtmlText(ev.event_type)}
            </span>

            <div class="meta-end"><strong>End Date:</strong> ${endDateStr}</div>
          </div>

          <div class="apply-wrap">
            <a class="apply-button" href="${ev.apply_link}" target="_blank">Apply Now</a>
          </div>

          <div class="event-details">
            ${ev.briefDetails}
          </div>
        </div>
      </article>
    </section>
  `;
}

const eventPagesHtml = `
  ${buildCategoryPages("--> Urgent Events", "#DC2626", urgentEvents)}
  ${buildCategoryPages("--> Ending Soon", "#D97706", soonEvents)}
  ${buildCategoryPages("--> Upcoming Events", "#2563EB", upcomingEvents)}
`;


  htmlParts.push(eventPagesHtml);

  /* ---------- CSS (global) ---------- */
  const css = `
    <style>
      :root {
        --gyapak-purple: #6C2BD9;
        --muted: #666;
        --card-border: #e5e7eb;
      }

      html,body { margin:0; padding:0; -webkit-font-smoothing:antialiased; font-family: "Inter", Arial, sans-serif; color:#111; }

      /* Cover */
      .cover { display:flex; align-items:center; justify-content:center; height:100vh; background: linear-gradient(180deg, #ffffff 0%, #f7f5ff 100%); }
      .cover-wrap { width:100%; max-width:880px; margin:0 auto; text-align:center; padding:80px 20px; box-sizing:border-box; }
      .logo { font-size:48px; font-weight:900; color:var(--gyapak-purple); letter-spacing:2px; }
      .cover-title { font-size:34px; margin-top:18px; color:#111; }
      .cover-sub { font-size:16px; color:var(--muted); margin-top:8px; }
      .cover-meta { margin-top:28px; display:flex; gap:20px; justify-content:center; flex-wrap:wrap; color:var(--muted); }
      .cover-meta div { font-size:14px; }

      /* Summary */
      .summary-wrap { width:100%; max-width:880px; margin:30px auto; padding:30px; box-sizing:border-box; }
      .summary-wrap h2 { font-size:22px; color:var(--gyapak-purple); margin-bottom:18px; text-align:left; }
      .summary-grid { display:flex; gap:18px; flex-wrap:wrap; }
      .summary-card { flex:1 1 200px; background:#fff; border:1px solid var(--card-border); border-radius:12px; padding:18px; text-align:center; }
      .summary-number { font-size:28px; font-weight:800; color:var(--gyapak-purple); }
      .summary-label { font-size:13px; color:var(--muted); margin-top:8px; }

      .summary-note { margin-top:18px; color:var(--muted); font-size:13px; }

      /* TOC */
      .toc-wrap { width:100%; max-width:880px; margin:30px auto; padding:10px 6px; box-sizing:border-box; }
      .toc-wrap h2 { font-size:22px; color:var(--gyapak-purple); margin-bottom:12px; }
      .toc-list { list-style:none; padding:0; margin:0; }
      .toc-item { display:flex; align-items:center; gap:12px; padding:8px 0; font-size:14px; color:#222; border-bottom:1px dashed #f0f0f0; }
      .toc-left { display:flex; align-items:center; gap:10px; flex: 1 1 auto; }
      .toc-dot { width:12px; height:12px; border-radius:50%; display:inline-block; }
      .toc-title { font-weight:600; max-width:72%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .toc-dots { flex:1 1 auto; border-bottom: 1px dotted #ddd; margin-right:10px; margin-left:10px; height:0; }
      .toc-page { width:70px; text-align:right; color:var(--muted); }

      /* Event page */
      .event-page { width:100%; box-sizing:border-box; padding:0 10px; }
      .event-article { width:100%; max-width:900px; margin: 0 auto 10px auto; }
      .hero-image-wrap { width:100%; overflow:hidden; border-radius:12px; margin-bottom:14px; }
      .hero-image { width:100%; height:auto; display:block; object-fit:cover; border-radius:12px; }

      .event-body { background:#fff; border:1px solid var(--card-border); border-radius:12px; padding:20px; box-sizing:border-box; }
      .event-header { display:flex; justify-content:space-between; align-items:flex-start; gap:12px; }
      .event-title { font-size:20px; margin:0; font-weight:800; color:#111; line-height:1.15; }
      .days-badge {
  background: #E0EDFF;
  color: #1E3A8A;
  border: 1px solid #1E3A8A;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  white-space: nowrap;
}

      .event-meta { margin-top:12px; display:flex; gap:12px; align-items:center; flex-wrap:wrap; font-size:13px; color:#444; }
      .meta-end { margin-left:6px; }

      .apply-wrap { margin-top:14px; }
      .apply-button {
        display:inline-block;
        background:var(--gyapak-purple);
        color:#fff;
        padding:10px 16px;
        border-radius:8px;
        text-decoration:none;
        font-weight:700;
      }

      .event-details { margin-top:18px; font-size:14px; color:#333; line-height:1.6; }

      /* prevent breaking inside event */
      .event-article, .event-body { page-break-inside: avoid; break-inside: avoid; -webkit-column-break-inside: avoid; -webkit-page-break-inside: avoid; }

      /* small helpers */
      .muted { color:var(--muted); font-size:13px; }
    </style>
  `;

  /* ---------- full HTML ---------- */
  const fullHtml = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        ${css}
      </head>
      <body>
        ${htmlParts.join("\n")}
      </body>
    </html>
  `;

  // Puppeteer header/footer templates (fixed)
  const headerTemplate = `
    <div style="width:100%; font-family: Inter, Arial, sans-serif; font-size:10px; color:#666; padding:6px 10px; box-sizing:border-box;">
      <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
        <div style="font-weight:700; color: #6C2BD9;">GYAPAK</div>
        <div style="font-size:9px; color:#888;">gyapak.in</div>
      </div>
    </div>
  `;

  const footerTemplate = `
    <div style="width:100%; font-family: Inter, Arial, sans-serif; font-size:10px; color:#666; padding:6px 10px; box-sizing:border-box;">
      <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
        <div style="font-size:9px; color:#888;">Generated: ${generatedOn}</div>
        <div style="font-size:9px; color:#888;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>
      </div>
    </div>
  `;

  // Launch puppeteer and render PDF buffer
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();

    // increase default timeout for heavy pages / images
    await page.setContent(fullHtml, { waitUntil: "networkidle0", timeout: 60000 });

    // ensure images are loaded (optional small wait)
    await page.evaluate(async () => {
      const imgs = Array.from(document.images);
      await Promise.all(imgs.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((res, rej) => { img.onload = res; img.onerror = res; });
      }));
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate,
      footerTemplate,
      margin: { top: "90px", bottom: "90px", left: "40px", right: "40px" }
    });

    await page.close();
    return pdfBuffer;
  } finally {
    await browser.close();
  }

  /* ---------- helper functions ---------- */

  function escapeHtmlText(str = "") {
    // escape for small inline text (TOC and titles in TOC)
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // lightenColor(hex, factor): very small utility to create pale background for days badge
  function lightenColor(hex, factor = 0.9) {
    try {
      const c = hex.replace("#", "");
      const num = parseInt(c,16);
      let r = (num >> 16) & 255;
      let g = (num >> 8) & 255;
      let b = num & 255;
      r = Math.round(r + (255 - r) * (1 - factor));
      g = Math.round(g + (255 - g) * (1 - factor));
      b = Math.round(b + (255 - b) * (1 - factor));
      return `rgb(${r},${g},${b})`;
    } catch {
      return "#fff0f0";
    }
  }
};

function renderEventSection(title, color, events) {
  if (!events || events.length === 0) return "";

  return `
    <h2 class="section-title" style="color:${color}">${title}</h2>

    ${events
      .map(ev => renderEventBlock(ev))
      .join("")}
  `;
}

