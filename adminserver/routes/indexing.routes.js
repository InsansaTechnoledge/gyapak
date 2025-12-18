// routes/indexing.routes.js
import express from "express";
import { google } from "googleapis";
import { getIndexingClient } from "../config/indexingClient.js";

const router = express.Router();

// POST /api/indexing/publish  { url: "https://gyapak.in/jobs/xyz" }
router.post("/publish", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    const jwt = getIndexingClient();
    await jwt.authorize();

    const indexing = google.indexing({
      version: "v3",
      auth: jwt,
    });

    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url,
        type: "URL_UPDATED", // or URL_REMOVED
      },
    });

    return res.json({
      success: true,
      message: "Indexing notification sent (URL_UPDATED)",
      apiResponse: response.data,
    });
  } catch (err) {
    console.error("Indexing /publish error:", err?.response?.data || err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to publish URL to Indexing API",
      error: err?.response?.data || err.message,
    });
  }
});

// POST /api/indexing/remove  { url: "..." }
router.post("/remove", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    const jwt = getIndexingClient();
    await jwt.authorize();

    const indexing = google.indexing({
      version: "v3",
      auth: jwt,
    });

    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url,
        type: "URL_REMOVED",
      },
    });

    return res.json({
      success: true,
      message: "Indexing notification sent (URL_REMOVED)",
      apiResponse: response.data,
    });
  } catch (err) {
    console.error("Indexing /remove error:", err?.response?.data || err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to remove URL with Indexing API",
      error: err?.response?.data || err.message,
    });
  }
});

export default router;
