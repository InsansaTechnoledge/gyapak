// controllers/sitemap.controller.js
import Event from "../models/EventModel.js";
import Organization from "../models/OrganizationModel.js";
import Authority from "../models/AuthorityModel.js";
import { buildUrlset, buildSitemapIndex } from "../Utility/sitemapBuilder.js";
import { slugGenerator } from "../Utility/slugGenerator.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://gyapak.in";
const EVENTS_PER_PAGE = 1000;
const SITEMAP_DIR = path.join(__dirname, "../public/sitemaps");

// Ensure sitemap directory exists
if (!fs.existsSync(SITEMAP_DIR)) {
  fs.mkdirSync(SITEMAP_DIR, { recursive: true });
}

// Helper function to convert Event document to one or more URLs
// If `isNewEvent` is true -> return only the `--id` URL
// If `isNewEvent` is false -> return both `?id=` and `--id` URLs
const getEventUrls = (event) => {
  const isNewEvent = event.isNewEvent;
  const id = event._id ? event._id.toString() : "";
  const slug = slugGenerator(event.name || "");
  const basePath = `/top-exams-for-government-jobs-in-india/${slug}`;
  const dashedPath = `${basePath}--${id}`;
  const queryPath = `${basePath}?id=${id}`;

  if (isNewEvent) {
    return [`${BASE_URL}${dashedPath}`];
  }

  // For older events, include both forms for sitemap
  return [`${BASE_URL}${queryPath}`, `${BASE_URL}${dashedPath}`];
};

// Helper function to convert Organization document to URL
const getOrganizationUrl = (org) => {
  const id = org._id.toString();
  // const slug = slugGenerator(org.name || "");
  const path = `/organization/government-competitive-exams-after-12th/${encodeURIComponent(
    org.abbreviation
  )}`;
  return `${BASE_URL}${path}`;
};

// Helper function to convert State name to URL
const getStateUrl = (stateName) => {
  return `${BASE_URL}/state/government-jobs-in-${encodeURIComponent(
    stateName
  )}-for-12th-pass`;
};

// Helper function to write file
const writeFile = (filename, content) => {
  const filePath = path.join(SITEMAP_DIR, filename);
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`✅ Generated: ${filename}`);
};

// ========================================
// Generate All Sitemaps (Main Function)
// ========================================
export const generateAllSitemaps = async (req, res) => {
  try {
    console.log("🚀 Starting sitemap generation...");
    const startTime = Date.now();

    // 1. Generate General Sitemap
    await generateGeneralSitemapFile();

    // 2. Generate Events Sitemaps (with pagination)
    const eventPages = await generateEventsSitemapFiles();

    // 3. Generate Organizations Sitemap
    await generateOrganizationsSitemapFile();

    // 4. Generate State Sitemap
    await generateStateSitemapFile();

    // 5. Generate Main Sitemap Index
    await generateMainSitemapIndex(eventPages);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ All sitemaps generated successfully in ${duration}s`);

    res.status(200).json({
      success: true,
      message: "All sitemaps generated successfully",
      duration: `${duration}s`,
      files: {
        main: "sitemap.xml",
        general: "sitemap-general.xml",
        events: `sitemap-events.xml (${eventPages} pages)`,
        organizations: "sitemap-organizations.xml",
        state: "sitemap-state.xml",
      },
      location: SITEMAP_DIR,
    });
  } catch (err) {
    console.error("❌ Error generating sitemaps:", err);
    res.status(500).json({
      success: false,
      error: "Error generating sitemaps",
      message: err.message,
    });
  }
};

// ========================================
// Generate Main Sitemap Index File
// ========================================
const generateMainSitemapIndex = async (eventPages) => {
  const now = new Date().toISOString();

  const sitemaps = [
    {
      loc: `${BASE_URL}/sitemap-general.xml`,
      lastmod: now,
    },
    {
      loc: `${BASE_URL}/sitemap-events.xml`,
      lastmod: now,
    },
    {
      loc: `${BASE_URL}/sitemap-organizations.xml`,
      lastmod: now,
    },
    {
      loc: `${BASE_URL}/sitemap-state.xml`,
      lastmod: now,
    },
  ];

  const xml = buildSitemapIndex(sitemaps);
  writeFile("sitemap.xml", xml);
};

// ========================================
// Generate General Sitemap File
// ========================================
const generateGeneralSitemapFile = async () => {
  const staticUrls = [
    {
      loc: `${BASE_URL}/government-calendar`,
      changefreq: "daily",
      priority: "0.7",
    },
    {
      loc: `${BASE_URL}/daily-updates`,
      changefreq: "daily",
      priority: "0.7",
    },
    {
      loc: `${BASE_URL}/privacy-policy`,
      changefreq: "yearly",
      priority: "0.7",
    },
    {
      loc: `${BASE_URL}/credits`,
      changefreq: "yearly",
      priority: "0.7",
    },
    {
      loc: `${BASE_URL}/contact-us`,
      changefreq: "yearly",
      priority: "0.7",
    },
    {
      loc: `${BASE_URL}/thank-you`,
      changefreq: "yearly",
      priority: "0.7",
    },
    {
      loc: `${BASE_URL}/overview`,
      changefreq: "weekly",
      priority: "0.7",
    },
    {
      loc: `${BASE_URL}/admit-card`,
      changefreq: "daily",
      priority: "0.7",
    },
    {
      loc: `${BASE_URL}/results`,
      changefreq: "daily",
      priority: "0.7",
    },
  ];

  const xml = buildUrlset(staticUrls);
  writeFile("sitemap-general.xml", xml);
};

// ========================================
// Generate Events Sitemap Files (with pagination)
// ========================================
const generateEventsSitemapFiles = async () => {
  const totalEvents = await Event.countDocuments();
  const eventPages = Math.ceil(totalEvents / EVENTS_PER_PAGE);

  console.log(`📊 Total events: ${totalEvents}, Pages: ${eventPages}`);

  // Generate each paginated events sitemap
  for (let page = 1; page <= eventPages; page++) {
    const skip = (page - 1) * EVENTS_PER_PAGE;

    const events = await Event.find({})
      .select("name event_type isNewEvent updatedAt ")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(EVENTS_PER_PAGE)
      .lean();

    // Build URL entries; some events may produce multiple URLs
    const urlEntries = [];
    events.forEach((ev) => {
      const urls = getEventUrls(ev);
      const lastmod = ev.updatedAt
        ? new Date(ev.updatedAt).toISOString()
        : undefined;
      urls.forEach((u) => {
        urlEntries.push({
          loc: u,
          lastmod,
          changefreq: "daily",
          priority: "0.9",
        });
      });
    });

    const xml = buildUrlset(urlEntries);
    writeFile(`sitemap-events-${page}.xml`, xml);
  }

  // Generate events sitemap index
  const now = new Date().toISOString();
  const eventSitemaps = [];
  for (let i = 1; i <= eventPages; i++) {
    eventSitemaps.push({
      loc: `${BASE_URL}/sitemap-events-${i}.xml`,
      lastmod: now,
    });
  }

  const eventsIndexXml = buildSitemapIndex(eventSitemaps);
  writeFile("sitemap-events.xml", eventsIndexXml);

  return eventPages;
};

// ========================================
// Generate Organizations Sitemap File
// ========================================
const generateOrganizationsSitemapFile = async () => {
  const organizations = await Organization.find({})
    .select("abbreviation")
    .lean();

  const orgUrls = organizations.map((org) => ({
    loc: getOrganizationUrl(org),
    changefreq: "weekly",
    priority: "0.8",
  }));

  const xml = buildUrlset(orgUrls);
  writeFile("sitemap-organizations.xml", xml);
};

// ========================================
// Generate State Sitemap File
// ========================================
const generateStateSitemapFile = async () => {
  const states = await Authority.find({ type: "State_Government" })
    .select("name")
    .lean();

  const stateUrls = states.map((state) => ({
    loc: getStateUrl(state.name),
    changefreq: "weekly",
    priority: "0.8",
  }));

  const xml = buildUrlset(stateUrls);
  writeFile("sitemap-state.xml", xml);
};

// ========================================
// Serve Sitemap Files (Static File Serving)
// ========================================
export const serveSitemap = (req, res) => {
  const filename = req.params.filename || "sitemap.xml";
  const filePath = path.join(SITEMAP_DIR, filename);

  if (fs.existsSync(filePath)) {
    res.header("Content-Type", "application/xml");
    res.sendFile(filePath);
  } else {
    res.status(404).send("Sitemap not found. Please generate sitemaps first.");
  }
};
