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

router.get("/scheduled-affair", fetchScheduledAffair);
router.get("/get-pdf", fetchPdf);
router.get("/all", fetchAllCurrentAffairs);
router.get("/today", fetchTodaysCurrentAffairs);
router.get("/month", fetchMonthlyCurrentAffairs);
router.get("/year", fetchYearlyCurrentAffairs);
router.get("/single/:date/:slug", getAffairWithQuestions);
router.post("/upload", uploadCurrentAffair);
router.post("/upload-pdf", addNewPdf);
router.put("/update/:id", updateCurrentAffair);
router.put("/scheduled-affair", updateScheduledCurrentAffair);
router.delete("/scheduled-affair", deleteScheduledCurrentAffair);
router.delete("/delete-pdf", deletePdfByID);
router.delete("/delete/:id", deleteCurrentAffair);

export default router;
