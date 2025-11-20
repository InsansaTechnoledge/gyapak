import { Router } from "express";
import {
  getSources,
  createSource,
  updateSource,
  deleteSource,
} from "../controllers/source.controller.js";

const router = Router();

router.get("/", getSources);
router.post("/", createSource);
router.put("/:id", updateSource);
router.delete("/:id", deleteSource);

export default router;
