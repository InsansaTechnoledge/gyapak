import express from "express";

import {
  uploadCurrentAffair,
  updateCurrentAffair,
  fetchAllCurrentAffairs,
  deleteCurrentAffair,
  fetchTodaysCurrentAffairs,
  fetchMonthlyCurrentAffairs,
  fetchYearlyCurrentAffairs,
  getAffairWithQuestions,
  fetchScheduledAffair,
  updateScheduledCurrentAffair,
  deleteScheduledCurrentAffair,
} from "../controllers/currentAffairs.controller.js";
import {
  addNewPdf,
  deletePdfByID,
  fetchPdf,
} from "../controllers/DailyCurrentAffair.controller.js";

const router = express.Router();

router.post("/upload", uploadCurrentAffair);
router.post("/upload-pdf", addNewPdf);
router.get("/get-pdf", fetchPdf);
router.get("/scheduled-affair", fetchScheduledAffair);
router.put("/scheduled-affair/:id", updateScheduledCurrentAffair);
router.delete("/scheduled-affair/:id", deleteScheduledCurrentAffair);
router.delete("/delete-pdf", deletePdfByID);
router.put("/update/:id", updateCurrentAffair);
router.get("/all", fetchAllCurrentAffairs);
router.delete("/delete/:id", deleteCurrentAffair);
router.get("/today", fetchTodaysCurrentAffairs);
router.get("/month", fetchMonthlyCurrentAffairs);
router.get("/year", fetchYearlyCurrentAffairs);
router.get("/single/:date/:slug", getAffairWithQuestions);

export default router;
