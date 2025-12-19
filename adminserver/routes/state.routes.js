import express from "express";
import {
  getStateList,
  addState,
  upload,
} from "../controllers/state.controller.js";

const router = express.Router();

router.get("/all", getStateList);
router.post("/add-state", upload.single("logo"), addState);

export default router;
