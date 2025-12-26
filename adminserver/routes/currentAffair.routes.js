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
import { authorizeRoles, verifyToken } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/scheduled-affair", fetchScheduledAffair);
router.get("/get-pdf", fetchPdf);
router.get(
  "/all",
  verifyToken,
  authorizeRoles("admin", "data entry"),
  fetchAllCurrentAffairs
);
router.get(
  "/today",
  verifyToken,
  authorizeRoles("admin", "data entry"),
  fetchTodaysCurrentAffairs
);
router.get(
  "/month",
  verifyToken,
  authorizeRoles("admin", "data entry"),
  fetchMonthlyCurrentAffairs
);
router.get(
  "/year",
  verifyToken,
  authorizeRoles("admin", "data entry"),
  fetchYearlyCurrentAffairs
);
router.get(
  "/single/:date/:slug",
  verifyToken,
  authorizeRoles("admin", "data entry"),
  getAffairWithQuestions
);
router.post(
  "/upload",
  verifyToken,
  authorizeRoles("admin", "data entry"),
  uploadCurrentAffair
);
router.post(
  "/upload-pdf",
  verifyToken,
  authorizeRoles("admin", "data entry"),
  addNewPdf
);
router.put(
  "/update/:id",
  verifyToken,
  authorizeRoles("admin", "data entry"),
  updateCurrentAffair
);
router.put(
  "/scheduled-affair",
  verifyToken,
  authorizeRoles("admin", "data entry"),
  updateScheduledCurrentAffair
);
router.delete(
  "/scheduled-affair",
  verifyToken,
  authorizeRoles("admin", "data entry"),
  deleteScheduledCurrentAffair
);
router.delete(
  "/delete-pdf",
  verifyToken,
  authorizeRoles("admin", "data entry"),
  deletePdfByID
);
router.delete(
  "/delete/:id",
  verifyToken,
  authorizeRoles("admin", "data entry"),
  deleteCurrentAffair
);

export default router;
