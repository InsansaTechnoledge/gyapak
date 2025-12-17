// gscRoutes.js
import express from "express";
import { getGscClient } from "../config/gscClient.js";
import { google } from "googleapis";

// import { getGscClient } from "./config/gscClient.js"; // adjust path if config/ is elsewhere

const router = express.Router();

// GET /api/gsc/performance?range=7d|30d|90d
router.get("/performance", async (req, res) => {
  try {
    const { jwt, webmasters } = getGscClient();
    await jwt.authorize();

    const siteUrl = process.env.GSC_SITE_URL;
    if (!siteUrl) {
      return res.status(500).json({
        success: false,
        message: "GSC_SITE_URL env not set",
      });
    }

    const range = req.query.range || "30d";
    const endDate = new Date();
    const startDate = new Date();

    if (range === "7d") startDate.setDate(endDate.getDate() - 7);
    else if (range === "90d") startDate.setDate(endDate.getDate() - 90);
    else if(range === '1Y') startDate.setDate(endDate.getDate() - 365);
    else if(range === '6M') startDate.setDate(endDate.getDate() - 180);
    else startDate.setDate(endDate.getDate() - 30);

    const body = {
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
      dimensions: ["date"],
      rowLimit: 1000,
    };

    const response = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: body,
    });

    res.json({
      success: true,
      rows: response.data.rows || [],
    });
  } catch (err) {
    console.error("GSC /performance error:", err?.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch performance",
      error: err.message,
    });
  }
});

// optional: /api/gsc/queries
router.get("/queries", async (req, res) => {
  try {
    const { jwt, webmasters } = getGscClient();
    await jwt.authorize();

    const siteUrl = process.env.GSC_SITE_URL;
    const days = Number(req.query.days) || 30;
    const limit = Number(req.query.limit) || 50;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const body = {
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
      dimensions: ["query"],
      rowLimit: limit,
      orderBy: [{ fieldName: "clicks", descending: true }],
    };

    const response = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: body,
    });

    res.json({
      success: true,
      rows: response.data.rows || [],
    });
  } catch (err) {
    console.error("GSC /queries error:", err?.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch queries",
      error: err.message,
    });
  }
});

// optional: /api/gsc/pages
router.get("/pages", async (req, res) => {
  try {
    const { jwt, webmasters } = getGscClient();
    await jwt.authorize();

    const siteUrl = process.env.GSC_SITE_URL;
    const days = Number(req.query.days) || 30;
    const limit = Number(req.query.limit) || 50;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const body = {
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
      dimensions: ["page"],
      rowLimit: limit,
      orderBy: [{ fieldName: "clicks", descending: true }],
    };

    const response = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: body,
    });

    res.json({
      success: true,
      rows: response.data.rows || [],
    });
  } catch (err) {
    console.error("GSC /pages error:", err?.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pages",
      error: err.message,
    });
  }
});

// POST /api/gsc/sitemap/submit
router.post("/sitemap/submit", async (req, res) => {
    try {
      const { jwt, webmasters } = getGscClient();
      await jwt.authorize();
  
      const siteUrl = process.env.GSC_SITE_URL; // https://gyapak.in/
      const sitemapUrl =
        req.body.sitemapUrl || `${siteUrl.replace(/\/$/, "")}/sitemap.xml`;
  
      await webmasters.sitemaps.submit({
        siteUrl,
        feedpath: sitemapUrl,
      });
  
      res.json({
        success: true,
        message: "Sitemap submitted to Google Search Console",
        sitemapUrl,
      });
    } catch (err) {
      console.error("GSC /sitemap/submit error:", err?.response?.data || err.message);
      res.status(500).json({
        success: false,
        message: "Failed to submit sitemap",
        error: err.message,
      });
    }
});


router.post("/inspect", async (req, res) => {
    try {
      const { url } = req.body;
  
      if (!url) {
        return res.status(400).json({
          success: false,
          message: "URL is required",
        });
      }
  
      const { jwt } = getGscClient();
      await jwt.authorize();
  
      const siteUrl = process.env.GSC_SITE_URL; 
      // e.g. "https://gyapak.in/" or "sc-domain:gyapak.in"
      if (!siteUrl) {
        return res.status(500).json({
          success: false,
          message: "GSC_SITE_URL env not set",
        });
      }
  
      // Create URL Inspection client using same auth
      const searchconsole = google.searchconsole({
        version: "v1",
        auth: jwt,
      });
  
      const apiRes = await searchconsole.urlInspection.index.inspect({
        requestBody: {
          inspectionUrl: url,
          siteUrl,
          languageCode: "en-IN",
        },
      });
  
      const result = apiRes.data?.inspectionResult || {};
      const indexStatus = result.indexStatusResult || {};
  
      const isOnGoogle =
        indexStatus.verdict === "PASS" &&
        indexStatus.coverageState &&
        indexStatus.coverageState.toLowerCase().includes("indexed");
  
      return res.json({
        success: true,
        url,
        isOnGoogle,
        verdict: indexStatus.verdict,              // PASS / FAIL / NEUTRAL
        coverageState: indexStatus.coverageState,  // e.g. "Indexed, submitted and indexed"
        indexingState: indexStatus.indexingState,  // INDEXING_ALLOWED / BLOCKED_...
        lastCrawlTime: indexStatus.lastCrawlTime,
        pageFetchState: indexStatus.pageFetchState,
        robotsTxtState: indexStatus.robotsTxtState,
        googleCanonical: indexStatus.googleCanonical,
        userCanonical: indexStatus.userCanonical,
        sitemaps: indexStatus.sitemap || [],
        inspectionResultLink: result.inspectionResultLink,
        raw: result, // full object for debugging
      });
    } catch (err) {
      console.error("URL inspection error:", err?.response?.data || err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to inspect URL",
        error: err?.response?.data || err.message,
      });
    }
  });

export default router;
