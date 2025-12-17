// routes/sitemap.routes.js
import express from "express";
import {
  generateAllSitemaps,
  serveSitemap,
} from "../controller/sitemap.controller.js";

const router = express.Router();

// Generate all sitemaps (call this API to create/update all sitemap files)
router.get("/generate-sitemaps", generateAllSitemaps);

// Serve sitemap files
router.get("/sitemap.xml", serveSitemap);
router.get("/sitemap-:filename.xml", (req, res) => {
  req.params.filename = `sitemap-${req.params.filename}.xml`;
  serveSitemap(req, res);
});

export default router;
