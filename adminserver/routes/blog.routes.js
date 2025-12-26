import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  getFeaturedBlogs,
  searchBlogs,
  getRelatedBlogs,
} from "../controllers/BlogPost.controller.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.middleware.js";
const router = express.Router();

// Create a new blog post
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "data entry"),
  createBlog
);

// Get all blog posts (optionally filtered by tag, no pagination)
router.get("/", getAllBlogs);

// Get a single blog post by slug
router.get("/slug/:slug", getBlogBySlug);

// Update a blog post by ID
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "data entry"),
  updateBlog
);

// Delete a blog post by ID
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "data entry"),
  deleteBlog
);

// Get featured blog posts
router.get("/featured", getFeaturedBlogs);

// Search blog posts by keyword
router.get("/search", searchBlogs);

router.get("/related/:slug", getRelatedBlogs);

export default router;
