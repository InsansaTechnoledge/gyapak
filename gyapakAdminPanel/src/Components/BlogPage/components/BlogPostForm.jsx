import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Upload,
  Plus,
  Edit,
  BookOpen,
  Image,
  Clock,
  Tag,
  User,
  Award,
} from "lucide-react";

const BlogPostForm = ({ post, onSave, onCancel, isSaving }) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    readTime: 5,
    author: {
      name: "",
      avatar: "",
      bio: "",
    },
    tags: [],
    featuredPost: false,
  });

  const [currentTag, setCurrentTag] = useState("");
  const [activeSection, setActiveSection] = useState("basics");
  const startTime = useRef(null);

  useEffect(() => {
    startTime.current = Date.now();
    return () => {
      return console.log("user left without doing anything");
    };
  });
  // Initialize form if editing
  useEffect(() => {
    if (post) {
      const totalTime = Math.floor((Date.now() - startTime.current) / 1000);
      setFormData({
        ...post,
        tags: post.tags || [],
        author: {
          name: post.author?.name || "",
          avatar: post.author?.avatar || "",
          bio: post.author?.bio || "",
        },
        totalTime,
      });
    }
  }, [post]);

  // convenience flags for validation
  const isBasicsActive = activeSection === "basics";
  const isContentActive = activeSection === "content";
  const isMediaActive = activeSection === "media";
  const isMetadataActive = activeSection === "metadata";
  const isAuthorActive = activeSection === "author";

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name && name.startsWith("author.")) {
      const authorField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        author: {
          ...prev.author,
          [authorField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(currentTag.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, currentTag.trim()],
        }));
      }
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let submitData = { ...formData };

    // auto-generate slug if empty
    if (!submitData.slug || !submitData.slug.trim()) {
      submitData.slug = (submitData.title || "")
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");
    }

    // pass data up; AdminBlogPage decides create vs update
    onSave(submitData);
  };

  // Calculate progress through the form
  const calculateProgress = () => {
    const requiredFields = [
      formData.title,
      formData.excerpt,
      formData.content,
      formData.author.name,
    ];

    const filledFields = requiredFields.filter(
      (field) => field && field.trim() !== ""
    ).length;
    return Math.round((filledFields / requiredFields.length) * 100);
  };

  const progress = calculateProgress();

  // Navigation sections
  const sections = [
    { id: "basics", label: "Blog Basics", icon: <Edit className="h-5 w-5" /> },
    {
      id: "content",
      label: "Your Story",
      icon: <BookOpen className="h-5 w-5" />,
    },
    { id: "media", label: "Images", icon: <Image className="h-5 w-5" /> },
    {
      id: "metadata",
      label: "Tags & Details",
      icon: <Tag className="h-5 w-5" />,
    },
    { id: "author", label: "About You", icon: <User className="h-5 w-5" /> },
  ];

  return (
    <div className="bg-gray-50 rounded-xl shadow-xl overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-600 border-b border-purple-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center">
          {post ? "Edit Blog Post" : "Create Blog Post"}
        </h2>
        <button
          onClick={onCancel}
          type="button"
          className="text-white hover:text-purple-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-6 pt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-purple-700">
            Your progress
          </span>
          <span className="text-xs font-medium text-purple-700">
            {progress}%
          </span>
        </div>
        <div className="w-full bg-purple-100 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 pt-4">
        <div className="flex overflow-x-auto space-x-2 pb-2">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                activeSection === section.id
                  ? "bg-purple-600 text-white shadow-md transform scale-105"
                  : "bg-white text-purple-600 hover:bg-purple-100"
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              <span className="whitespace-nowrap">{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Basic Info Section */}
        <div
          className={`${
            isBasicsActive ? "block" : "hidden"
          } space-y-6 animate-fadeIn`}
        >
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-medium text-purple-800 mb-4 flex items-center">
              <Edit className="h-5 w-5 mr-2 text-purple-600" />
              Blog Essentials
            </h3>

            {/* Title */}
            <div className="mb-6 transform transition hover:scale-[1.01]">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Give your blog a catchy title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required={isBasicsActive}
                value={formData.title}
                onChange={handleChange}
                placeholder="My Awesome Blog Post (maximum 100 char)"
                className="block w-full border-2 border-purple-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>

            {/* Slug */}
            <div className="transform transition hover:scale-[1.01]">
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Custom URL slug (or leave empty to auto-generate)
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">/blog/</span>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="my-awesome-post"
                  className="block w-full border-2 border-purple-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div
          className={`${
            isContentActive ? "block" : "hidden"
          } space-y-6 animate-fadeIn`}
        >
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-medium text-purple-800 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
              Tell Your Story
            </h3>

            {/* Excerpt */}
            <div className="mb-6 transform transition hover:scale-[1.01]">
              <label
                htmlFor="excerpt"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Write a compelling excerpt (this appears in previews) *
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                placeholder="Give readers a taste of your amazing content... (maximum 500 char)"
                className="w-full p-3 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:ring-0 min-h-[120px] bg-white"
                maxLength={500}
                required={isContentActive}
              />
            </div>

            {/* Content */}
            <div className="transform transition hover:scale-[1.01]">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your awesome blog content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Share your thoughts, insights, and creativity here... (minimum 100 char)"
                className="w-full p-3 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:ring-0 min-h-[300px] bg-white resize-y"
                minLength={isContentActive ? 100 : undefined}
                required={isContentActive}
              />
            </div>
          </div>
        </div>

        {/* Media Section */}
        <div
          className={`${
            isMediaActive ? "block" : "hidden"
          } space-y-6 animate-fadeIn`}
        >
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-medium text-purple-800 mb-4 flex items-center">
              <Image className="h-5 w-5 mr-2 text-purple-600" />
              Add Eye-Catching Images
            </h3>

            {/* Featured image */}
            <div className="transform transition hover:scale-[1.01]">
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Featured Image URL (make it pop!)
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/your-image.jpg"
                  className="block w-full border-2 border-purple-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  className="ml-2 p-3 bg-purple-100 border-2 border-purple-300 rounded-lg shadow-sm text-purple-600 hover:bg-purple-200 transition"
                >
                  <Upload className="h-5 w-5" />
                </button>
              </div>
              {formData.imageUrl ? (
                <div className="mt-4 relative group">
                  <div className="relative overflow-hidden rounded-lg shadow-md">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover transition transform group-hover:scale-105 duration-300"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/600/400";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-8 border-2 border-dashed border-purple-300 rounded-lg flex flex-col items-center justify-center text-gray-400">
                  <Image className="h-12 w-12 mb-2" />
                  <p>Your featured image will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Metadata Section */}
        <div
          className={`${
            isMetadataActive ? "block" : "hidden"
          } space-y-6 animate-fadeIn`}
        >
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-medium text-purple-800 mb-4 flex items-center">
              <Tag className="h-5 w-5 mr-2 text-purple-600" />
              Tags & Details
            </h3>

            {/* Read Time */}
            <div className="mb-6 transform transition hover:scale-[1.01]">
              <label
                htmlFor="readTime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                How long will it take to read? (minutes) *
              </label>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-purple-500 mr-2" />
                <input
                  type="number"
                  id="readTime"
                  name="readTime"
                  required={isMetadataActive}
                  min="1"
                  value={formData.readTime}
                  onChange={handleChange}
                  className="block w-full border-2 border-purple-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6 transform transition hover:scale-[1.01]">
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Add some fun tags
              </label>
              <div className="mt-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.length > 0 ? (
                    formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200 shadow-sm transition-transform hover:scale-105"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-purple-600 hover:text-purple-900 focus:outline-none"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">
                      No tags yet. Add some below!
                    </span>
                  )}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    id="currentTag"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Add a tag and press Enter"
                    className="block w-full border-2 border-purple-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (currentTag.trim()) {
                        if (!formData.tags.includes(currentTag.trim())) {
                          setFormData((prev) => ({
                            ...prev,
                            tags: [...prev.tags, currentTag.trim()],
                          }));
                        }
                        setCurrentTag("");
                      }
                    }}
                    className="ml-2 p-3 bg-purple-100 border-2 border-purple-300 rounded-lg shadow-sm text-purple-600 hover:bg-purple-200 transition"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Post */}
            <div className="transform transition hover:scale-[1.01]">
              <div className="flex items-center bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-100">
                <input
                  type="checkbox"
                  id="featuredPost"
                  name="featuredPost"
                  checked={formData.featuredPost}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      featuredPost: e.target.checked,
                    }))
                  }
                  className="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label
                  htmlFor="featuredPost"
                  className="ml-3 block text-sm text-gray-700 flex items-center"
                >
                  <Award className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="font-medium">Make this a featured post</span>
                  <span className="ml-1 text-xs text-gray-500">
                    (shown prominently on your blog)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Author Section */}
        <div
          className={`${
            isAuthorActive ? "block" : "hidden"
          } space-y-6 animate-fadeIn`}
        >
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-medium text-purple-800 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-purple-600" />
              About the Author
            </h3>

            <div className="grid grid-cols-1 gap-6">
              <div className="transform transition hover:scale-[1.01]">
                <label
                  htmlFor="author.name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your name *
                </label>
                <input
                  type="text"
                  id="author.name"
                  name="author.name"
                  required={isAuthorActive}
                  value={formData.author.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className="block w-full border-2 border-purple-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
              </div>

              <div className="transform transition hover:scale-[1.01]">
                <label
                  htmlFor="author.avatar"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your profile picture URL
                </label>
                <div className="flex items-center">
                  {formData.author.avatar && (
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3 border-2 border-purple-300">
                      <img
                        src={formData.author.avatar}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.src = "/api/placeholder/100/100";
                        }}
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    id="author.avatar"
                    name="author.avatar"
                    value={formData.author.avatar}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="block w-full border-2 border-purple-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div className="transform transition hover:scale-[1.01]">
                <label
                  htmlFor="author.bio"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tell readers about yourself
                </label>
                <textarea
                  id="author.bio"
                  name="author.bio"
                  rows="3"
                  value={formData.author.bio}
                  onChange={handleChange}
                  placeholder="I'm a passionate writer who loves to share insights about..."
                  className="block w-full border-2 border-purple-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit buttons (always visible) */}
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border-2 border-purple-300 rounded-lg shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 border-2 border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {isSaving ? "Saving..." : post ? " Update Post" : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogPostForm;
