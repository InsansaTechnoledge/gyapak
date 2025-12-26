import express from "express";
import { getAllUser, getUsersList } from "../controllers/userLogs.controller.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protect routes with authentication and admin authorization
router.get("/all", verifyToken, authorizeRoles("admin"), getAllUser);
router.get("/users", verifyToken, authorizeRoles("admin"), getUsersList);

export default router;
