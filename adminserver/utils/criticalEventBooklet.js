import puppeteer from "puppeteer";
import { getTemplateHtml } from './magazineTemplate.js'; // adjust path if needed


export const generateCriticalEventsBookletPDF = async (report) => {
  // ---------------- CONFIG ----------------
  const LOGO_URL = "https://res.cloudinary.com/dzdt11nsx/image/upload/v1762860816/Asset_2_5_i5wwrh.png";
  const SOCIAL = {
    website: "www.gyapak.in",
    telegram: "gyapakdaily",
    whatsapp: "Gyapak",
    instagram: "gyapak.in",
    x: "gyapak07",
  };

  // ---------------- normalize events ----------------
  const urgentRaw = report.upcomingEvents?.urgent || [];
  const soonRaw = report.upcomingEvents?.soon || [];
  const upcomingRaw = report.upcomingEvents?.upcoming || [];

  function computeDaysRemaining(endDate) {
    if (!endDate) return "-";
    const diff = Math.ceil((new Date(endDate) - new Date()) / (1000*60*60*24));
    return diff > 0 ? diff : 0;
  }
  function normalize(e) {
    return {
      raw: e,
      name: e.name || "Untitled",
      end_date: e.end_date || null,
      daysRemaining: typeof e.daysRemaining !== "undefined" ? e.daysRemaining : computeDaysRemaining(e.end_date),
      event_type: e.event_type || "Opportunity",
      orgName: (e.organization_id && (e.organization_id.name || "")) || "Unknown",
      abbreviation: (e.organization_id && e.organization_id.abbreviation) || "",
      apply_link: e.apply_link || "https://gyapak.in",
      briefDetails: (e.briefDetails && String(e.briefDetails).trim() !== "") ? e.briefDetails : null,
      imageUrl: e.imageUrl || e.heroImage || null
    };
  }

  const urgentList = urgentRaw.map(normalize);
  const soonList = soonRaw.map(normalize);
  const upcomingList = upcomingRaw.map(normalize);
  const allEvents = [...urgentList, ...soonList, ...upcomingList];

  // ---------------- helpers ----------------
  const typeColor = (type) => {
    const t = String(type || "").toLowerCase();
    if (t.includes("critical") || t.includes("urgent")) return "#ef4444";
    if (t.includes("high")) return "#f97316";
    if (t.includes("medium")) return "#f59e0b";
    return "#6C2BD9";
  };
  const generatedOn = new Date(report.reportGenerated || Date.now()).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric"
  });


  let logoDataUri = LOGO_URL; // default fallback (remote)
  try {
    if (typeof fetch === 'undefined') {
      throw new Error('global fetch not available');
    }
    const resp = await fetch(LOGO_URL);
    if (resp && resp.ok) {
      const arr = await resp.arrayBuffer();
      const contentType = resp.headers.get('content-type') || 'image/png';
      const b64 = Buffer.from(arr).toString('base64');
      logoDataUri = `data:${contentType};base64,${b64}`;
    } else {
      // fallback remains remote LOGO_URL
      console.warn('Logo fetch failed, using remote URL fallback', resp && resp.status);
    }
  } catch (err) {
    // If fetch is not available or fails (e.g., environment restrictions), fallback to remote URL
    console.warn('Could not fetch/encode logo to base64; using remote URL fallback. Error:', err && err.message);
    logoDataUri = LOGO_URL;
  }

  // ---------------- base html template (magazine) ----------------
  // getTemplateHtml() must return magazine skeleton with placeholders or contain enough structure
  let html = getTemplateHtml();

  // Replace some common placeholders; template may differ — fallback injections handled later
  html = html
    .replaceAll("{{coverTitle}}", "WEEKLY JOB POSTINGS BOOKLET")
    .replaceAll("{{coverSub}}", "Expiring Soon • Urgent • Upcoming Opportunities")
    .replaceAll("{{generatedOn}}", generatedOn)
    .replaceAll("{{periodLabel}}", escapeHtml(report.period?.label || "This Week"));

  // --------------- Build TOC (heuristic: cover=1, toc=2, events start=3) ---------------
  const tocItemsHtml = allEvents.map((ev, i) => {
    const color = typeColor(ev.event_type);
    return `
      <li style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px dashed #eee;">
        <div style="display:flex;align-items:center;gap:10px;max-width:72%;">
          <span style="width:11px;height:11px;border-radius:999px;display:inline-block;background:${color};"></span>
          <span style="font-weight:600;color:#111;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(ev.name)}</span>
        </div>
        <div style="color:#666;width:70px;text-align:right;">Pg. ${3 + i}</div>
      </li>
    `;
  }).join("");

  // Inject TOC into template — support several placeholder conventions
  if (html.includes('<ul id="toc"></ul>')) {
    html = html.replace('<ul id="toc"></ul>', `<ul id="toc" style="list-style:none;padding-left:0;margin:0;">${tocItemsHtml}</ul>`);
  } else if (html.includes('<!-- TOC -->')) {
    html = html.replace('<!-- TOC -->', `<ul style="list-style:none;padding-left:0;margin:0;">${tocItemsHtml}</ul>`);
  } else if (html.includes('<section id="articles"></section>')) {
    html = html.replace('<section id="articles"></section>', `
      <section style="page-break-after: always;padding:30px 24px;">
        <div style="max-width:900px;margin:0 auto;">
          <h2 style="color:#6C2BD9;font-size:22px;margin-bottom:10px;">Table of Contents</h2>
          <ol style="list-style:none;padding-left:0;margin:0;">${tocItemsHtml || '<li style="color:#666">No items</li>'}</ol>
        </div>
      </section>
      <section id="articles"></section>
    `);
  } else {
    // fallback: prepend TOC in body
    html = html.replace('<body>', `<body><section style="page-break-after: always;padding:30px 24px;"><div style="max-width:900px;margin:0 auto;"><h2 style="color:#6C2BD9;font-size:22px;margin-bottom:10px;">Table of Contents</h2><ol style="list-style:none;padding-left:0;margin:0;">${tocItemsHtml || '<li style="color:#666">No items</li>'}</ol></div></section>`);
  }

  // ---------------- Render category article HTML ----------------
  function renderArticle(ev) {
    const colorHex = typeColor(ev.event_type);
    const imageHtml = ev.imageUrl ? `<div style="margin:12px 0;"><img src="${escapeAttr(ev.imageUrl)}" alt="${escapeHtml(ev.name)}" style="width:100%;height:auto;border-radius:12px;object-fit:cover;" /></div>` : '';
    const daysText = (typeof ev.daysRemaining === "number") ? `${ev.daysRemaining} Days Remaining` : `${ev.daysRemaining}`;
    const orgLine = escapeHtml(ev.orgName) + (ev.abbreviation ? ` (${escapeHtml(ev.abbreviation)})` : "");
    const detailsHtml = ev.briefDetails ? ev.briefDetails : `<p style="color:#6b7280;font-size:14px;margin:0;">(No additional details available. Visit Gyapak for full info.)</p>`;

    return `
      <article style="background:#fff;border:1px solid #e6e6e6;border-radius:12px;padding:20px;margin-bottom:28px;box-sizing:border-box;page-break-inside:avoid;">
        <header style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:12px;font-size:13px;color:#4b5563;">
          <div style="font-weight:700;">${orgLine}</div>
          <div style="display:flex;gap:10px;align-items:center;">
            <span style="background:${colorHex};color:#fff;padding:6px 10px;border-radius:999px;font-weight:700;font-size:12px;">${escapeHtml(ev.event_type)}</span>
            <span style="background:#EAF5FF;color:#0F3A85;border:1px solid #0F3A85;padding:6px 10px;border-radius:8px;font-weight:800;font-size:13px;">${escapeHtml(daysText)}</span>
          </div>
        </header>

        ${imageHtml}

        <h3 style="font-size:20px;margin:8px 0 12px 0;font-weight:800;line-height:1.2;border-left:4px solid ${colorHex};padding-left:12px;">
          ${escapeHtml(ev.name)}
        </h3>

        <div style="font-size:15px;color:#374151;line-height:1.6;">
          ${detailsHtml}
        </div>

       <div style="text-align:center;margin-top:16px;">
  <a href="${escapeAttr('https://gyapak.in')}"
     style="
       display:inline-block;
       padding:8px 14px;
       background:#F1E9FF;             /* Light soft purple */
       border:1px solid #C7A8F3;        /* Subtle purple border */
       border-radius:6px;
       color:#4B2CA0;                   /* Darker purple for text */
       font-size:13px;
       font-weight:600;
       text-decoration:none;
     ">
    Apply / Read on Gyapak
  </a>
</div>


      </article>
    `;
  }

  function renderCategory(title, color, list) {
    if (!list || list.length === 0) return '';
    return `
      <div style="page-break-before: always;"></div>
      <section style="padding:24px 16px;">
        <div style="max-width:900px;margin:0 auto;">
          <h2 style="font-size:22px;font-weight:900;color:${color};margin:0 0 6px 0;">${escapeHtml(title)}</h2>
          <div style="color:#6b7280;margin-bottom:12px;">Latest ${escapeHtml(title.toLowerCase())}</div>
          ${list.map(renderArticle).join("\n")}
        </div>
      </section>
    `;
  }

  const categoriesHtml = [
    renderCategory("🚨 Urgent Events", "#ef4444", urgentList),
    renderCategory("⏳ Ending Soon", "#f97316", soonList),
    renderCategory("📅 Upcoming Events", "#2563EB", upcomingList),
  ].join("\n\n");

  // Inject categories into template
  if (html.includes('<section id="articles"></section>')) {
    html = html.replace('<section id="articles"></section>', `<section id="articles">${categoriesHtml}</section>`);
  } else if (html.includes('<!-- ARTICLES -->')) {
    html = html.replace('<!-- ARTICLES -->', categoriesHtml);
  } else {
    html = html.replace('</body>', `${categoriesHtml}</body>`);
  }

  // ---------------- Puppeteer header/footer ----------------
  // Use the logoDataUri (base64) or fallback remote URL
  const headerTemplate = `
    <div style="width:100%;padding:8px 12px;box-sizing:border-box;font-family:Inter,Arial,sans-serif;">
      <div style="display:flex;align-items:center;justify-content:space-between;width:100%;">
        <img src="${logoDataUri}" style="height:14px;width:auto; display:block;" />
        <div style="font-size:9px;color:#888">${escapeHtml(SOCIAL.website)}</div>
      </div>
    </div>
  `;

  // Inline brand-colored SVGs
  const whatsappSVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.698 2.302a11.983 11.983 0 00-17 0c-4.688 4.688-4.688 12.29 0 16.978L2 22l2.72-2.234A11.983 11.983 0 0021.698 2.302z" fill="#25D366"/><path d="M15.56 14.406c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.42-1.34-1.66-.14-.24-.015-.36.1-.47.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.44-.38-.38-.54-.38-.14 0-.3-.02-.46-.02-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2.02 0 1.2.86 2.36.98 2.52.12.16 1.68 2.56 4.06 3.48 2.38.92 2.38.62 2.82.58.44-.04 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" fill="#075E54"/></svg>`;

  const telegramSVG = `<svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.486 2 2 6.486 2 12c0 5.513 4.486 10 10 10s10-4.487 10-10c0-5.514-4.486-10-10-10zm4.64 8.215l-1.676 7.584c-.127.518-.459.645-.935.402l-2.589-1.91-1.249 1.203c-.138.138-.254.254-.52.254l.186-2.655 4.819-4.349c.209-.186-.046-.289-.323-.103l-5.944 3.735-2.564-.801c-.556-.173-.566-.556.116-.822L16.65 7.03c.476-.168.892.108.737.427z" fill="#0088cc"/></svg>`;

  const instagramSVG = `<svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><linearGradient id="g1" x1="0" x2="1"><stop offset="0" stop-color="#feda75"/><stop offset="0.5" stop-color="#d62976"/><stop offset="1" stop-color="#962fbf"/></linearGradient><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z" fill="url(#g1)"/><circle cx="12" cy="12" r="3.2" fill="#fff"/><circle cx="17.5" cy="6.5" r="1" fill="#fff"/></svg>`;

  const xSVG = `<svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 3.3c-.4.2-.9.4-1.3.5.5-.3 1-.8 1.2-1.4-.5.3-1.1.6-1.7.8C19.5 2.4 18.7 2 17.9 2c-1.2 0-2.1.9-2.5 1.9-.6 1.6-.1 3.5 1.1 4.5-.9 0-1.7-.3-2.4-.8-.2.7-.1 1.6.4 2.2.6.8 1.5 1.3 2.4 1.4-.4.2-.9.3-1.4.3-.3 0-.6 0-.8-.1.6 1.9 2.4 3.2 4.4 3.2-1.6 1.3-3.6 2-5.6 2-.4 0-.7 0-1.1-.1 2 1.2 4.3 1.9 6.8 1.9 8.2 0 12.7-6.9 12.7-12.9v-.6c.9-.6 1.6-1.3 2.2-2.2-.8.4-1.7.7-2.6.8z" fill="#1DA1F2"/></svg>`;

  const footerTemplate = `
    <div style="width:100%;padding:8px 12px;box-sizing:border-box;font-family:Inter,Arial,sans-serif;">
      <div style="display:flex;align-items:center;justify-content:space-between;width:100%;font-size:10px;color:#666;">
        <div style="font-size:9px;color:#888;">Generated: ${generatedOn}</div>

        <div style="display:flex;align-items:center;gap:12px;">
          <div style="display:flex;align-items:center;gap:6px;">
            ${whatsappSVG}
            <span style="font-size:11px;color:#111;">${escapeHtml(SOCIAL.whatsapp)}</span>
          </div>

          <div style="display:flex;align-items:center;gap:6px;">
            ${telegramSVG}
            <span style="font-size:11px;color:#111;">${escapeHtml(SOCIAL.telegram)}</span>
          </div>

          <div style="display:flex;align-items:center;gap:6px;">
            ${instagramSVG}
            <span style="font-size:11px;color:#111;">${escapeHtml(SOCIAL.instagram)}</span>
          </div>

          <div style="display:flex;align-items:center;gap:6px;">
            ${xSVG}
            <span style="font-size:11px;color:#111;">X: ${escapeHtml(SOCIAL.x)}</span>
          </div>

          <div style="font-size:9px;color:#888; margin-left:10px;">
            Page <span class="pageNumber"></span> of <span class="totalPages"></span>
          </div>
        </div>
      </div>
    </div>
  `;

  // ---------------- Launch puppeteer and render ----------------
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 60000 });

    // ensure images load
    await page.evaluate(async () => {
      const imgs = Array.from(document.images);
      await Promise.all(imgs.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(res => { img.onload = res; img.onerror = res; });
      }));
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate,
      footerTemplate,
      margin: { top: "110px", bottom: "110px", left: "40px", right: "40px" }
    });

    await page.close();
    return pdfBuffer;
  } finally {
    await browser.close();
  }

  // ---------------- utilities ----------------
  function escapeHtml(str = "") {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
  function escapeAttr(str = "") {
    return String(str)
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
};
