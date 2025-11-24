// routes/sitemap.routes.js
import express from "express";
import { getSitemap } from "../controller/sitemap.controller.js";

const router = express.Router();

// GET /sitemap.xml
router.get("/sitemap.xml", getSitemap);

export default router;
