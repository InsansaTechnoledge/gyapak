// AdminBlogPage.jsx
import React, { useState, useEffect } from "react";
import AdminHeader from "./components/Adminheader";
import BlogPostList from "./components/BlogPostList";
import BlogPostForm from "./components/BlogPostForm";
import AdminSidebar from "./components/AdminSideBar";
import {
  fetchBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "./components/BlogService";
import { useRef } from "react";

const AdminBlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const startTime = useRef(null);

  useEffect(() => {
    loadPosts();
    startTime.current = Date.now();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const data = await fetchBlogPosts();
      setPosts(data);
    } catch (err) {
      setError("Failed to load blog posts. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = () => {
    setEditingPost(null);
    setIsCreating(true);
  };

  const handleEditPost = (post) => {
    setIsCreating(false);
    setEditingPost(post);
  };

  const handleCancelEdit = () => {
    setIsCreating(false);
    setEditingPost(null);
    setSuccessMessage("");
  };

  const handleSavePost = async (postData) => {
    try {
      setIsSaving(true);
      const totalTime = Math.floor((Date.now() - startTime.current) / 1000);
      if (isCreating) {
        await createBlogPost(postData, totalTime);
        setSuccessMessage("Blog post created successfully!");
      } else if (editingPost) {
        await updateBlogPost(editingPost.id, postData, totalTime);
        setSuccessMessage("Blog post updated successfully!");
      }

      await loadPosts();
      setIsCreating(false);
      setEditingPost(null);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setError(`Failed to save blog post: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this blog post? This action cannot be undone."
      )
    ) {
      try {
        const totalTime = Math.floor((Date.now() - startTime.current) / 1000);
        await deleteBlogPost(postId, totalTime);
        await loadPosts();
        setSuccessMessage("Blog post deleted successfully!");

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } catch (err) {
        setError(`Failed to delete blog post: ${err.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* <AdminHeader /> */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Blog Post Management
          </h1>
          {!isCreating && !editingPost && (
            <button
              onClick={handleCreatePost}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Create New Post
            </button>
          )}
        </div>

        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            {error}
            <button className="ml-4 underline" onClick={() => setError(null)}>
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-5/6 mb-4"></div>
                </div>
              </div>
            ) : isCreating || editingPost ? (
              <BlogPostForm
                post={editingPost}
                onSave={handleSavePost}
                onCancel={handleCancelEdit}
                isSaving={isSaving}
              />
            ) : (
              <BlogPostList
                posts={posts}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            )}
          </div>

          <AdminSidebar
            postCount={posts.length}
            categoryCounts={getCategoryCounts(posts)}
          />
        </div>
      </div>
    </div>
  );
};

// Helper function to get category counts
const getCategoryCounts = (posts) => {
  const counts = {};
  posts.forEach((post) => {
    counts[post.category] = (counts[post.category] || 0) + 1;
  });
  return Object.entries(counts).map(([name, count]) => ({ name, count }));
};

export default AdminBlogPage;
