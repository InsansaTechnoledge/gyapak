// src/services/blog.service.js
import axios from "axios";
import { API_BASE_URL } from "../../../config";


// const API_BASE_URI = API_BASE_URL ;
const API_BASE_URI = "http://localhost:3000"
const API_BASE = `${API_BASE_URI}/api/v1i2/blog`;

// Helper: unwrap your APIResponse { statusCode, data, message }
const unwrap = (res) => res?.data?.data ?? res.data;

export const fetchBlogPosts = async ({ tag } = {}) => {
  const params = {};
  if (tag) params.tag = tag;

  const res = await axios.get(API_BASE, { params });
  return unwrap(res); // -> array of Blog docs
};

/**
 * GET /api/v1/blogs/slug/:slug
 * Uses getBlogBySlug
 */
export const fetchBlogPostBySlug = async (slug) => {
  const res = await axios.get(`${API_BASE}/slug/${slug}`);
  return unwrap(res); // -> single Blog doc
};

/**
 * POST /api/v1/blogs/
 * Uses createBlog
 */
export const createBlogPost = async (postData) => {
  const res = await axios.post(API_BASE, postData);
  return unwrap(res);
};

/**
 * PUT /api/v1/blogs/:id
 * Uses updateBlog
 */
export const updateBlogPost = async (id, postData) => {
  const res = await axios.put(`${API_BASE}/${id}`, postData);
  return unwrap(res);
};

/**
 * DELETE /api/v1/blogs/:id
 * Uses deleteBlog
 */
export const deleteBlogPost = async (id) => {
  const res = await axios.delete(`${API_BASE}/${id}`);
  return unwrap(res);
};

/**
 * GET /api/v1/blogs/featured
 * Uses getFeaturedBlogs
 */
export const fetchFeaturedBlogPosts = async () => {
  const res = await axios.get(`${API_BASE}/featured`);
  return unwrap(res);
};

/**
 * GET /api/v1/blogs/search?keyword=...
 * Uses searchBlogs
 */
export const searchBlogPosts = async (keyword) => {
  const res = await axios.get(`${API_BASE}/search`, {
    params: { keyword },
  });
  return unwrap(res);
};

/**
 * GET /api/v1/blogs/related/:slug
 * Uses getRelatedBlogs
 * (Note: this route returns { success, data }, not APIResponse)
 */
export const fetchRelatedBlogPosts = async (slug) => {
  const res = await axios.get(`${API_BASE}/related/${slug}`);
  return res?.data?.data ?? res.data;
};

export default {
  fetchBlogPosts,
  fetchBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  fetchFeaturedBlogPosts,
  searchBlogPosts,
  fetchRelatedBlogPosts,
};
