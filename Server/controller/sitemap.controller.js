// controllers/sitemap.controller.js
import Event from "../models/EventModel.js";
import { buildUrlset } from "../Utility/sitemapBuilder.js";
import { slugGenerator } from "../Utility/slugGenerator.js";


const BASE_URL = "http://localhost:5173";

// 🔹 Convert an Event document into the correct frontend URL
// All event types (Exam, AdmitCard, Result) use the same detail page with slug-based URLs
const getEventUrl = (event) => {
  const id = event._id.toString();
  const slug = slugGenerator(event.name || "");
  // Using double hyphen (--) to separate slug from ID
  const path = `/top-exams-for-government-jobs-in-india/${slug}--${id}`;
  return `${BASE_URL}${path}`;
};

export const getSitemap = async (req, res) => {
  try {
    // 1) Static routes
    const staticUrls = [
      {
        loc: `${BASE_URL}/`,
        changefreq: "daily",
        priority: "1.0",
      },
      {
        loc: `${BASE_URL}/government-organisations-under-category`,
        changefreq: "weekly",
        priority: "0.6",
      },
      {
        loc: `${BASE_URL}/government-calendar`,
        changefreq: "daily",
        priority: "0.7",
      },
      {
        loc: `${BASE_URL}/current-affair`,
        changefreq: "daily",
        priority: "0.7",
      },
      {
        loc: `${BASE_URL}/daily-updates`,
        changefreq: "daily",
        priority: "0.7",
      },
      {
        loc: `${BASE_URL}/blog`,
        changefreq: "weekly",
        priority: "0.6",
      },
      {
        loc: `${BASE_URL}/privacy-policy`,
        changefreq: "yearly",
        priority: "0.3",
      },
      {
        loc: `${BASE_URL}/credits`,
        changefreq: "yearly",
        priority: "0.2",
      },
      
    ];

    // 2) Dynamic URLs from Event collection
    const events = await Event.find({})
      .select("name event_type updatedAt")
      .lean();

    const eventUrls = events.map((ev) => ({
      loc: getEventUrl(ev),
      lastmod: ev.updatedAt
        ? new Date(ev.updatedAt).toISOString()
        : undefined,
      changefreq: "daily",
      priority:
        ev.event_type === "Exam"
          ? "0.9"
          : ev.event_type === "Result"
          ? "0.8"
          : "0.7",
    }));

    // 3) Build sitemap XML
    const urls = [...staticUrls, ...eventUrls];
    const xml = buildUrlset(urls);

    res.header("Content-Type", "application/xml").send(xml);
  } catch (err) {
    console.error("Error building sitemap.xml", err);
    res.status(500).send("Error building sitemap");
  }
};
