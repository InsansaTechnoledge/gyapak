import { Blog } from "../models/BlogPost.model.js";
import { APIResponse } from "../../Server/Utility/ApiResponse.js";
import { APIError } from "../../Server/Utility/ApiError.js";
import userActivity from "../models/activity.model.js";

export const createBlog = async (req, res) => {
  try {
    let { time } = req.query;
    console.log("📝 Blog Create Payload:", req.body); // DEBUG
    const blog = new Blog(req.body);
    await blog.save();

    const newUserActivity = new userActivity({
      userId: req.user.id,
      event: {
        eventType: "Blog",
        eventId: blog._id,
        eventStamp: {
          title: blog.title,
        },
        action: "created",
        totalTime: Number(time),
      },
    });

    await newUserActivity.save();
    return new APIResponse(201, blog, "Blog post created").send(res);
  } catch (err) {
    console.error("❌ Blog creation failed:", err); // DEBUG
    return new APIError(500, [
      err.message || "Failed to create blog post",
    ]).send(res);
  }
};

// export const getAllBlogs = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, tag } = req.query;
//     const query = tag ? { tags: tag } : {};
//     const blogs = await Blog.find(query)
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(Number(limit));

//     const total = await Blog.countDocuments(query);

//     return new APIResponse(200, { blogs, total }, 'Fetched all blog posts').send(res);
//   } catch (err) {
//     return new APIError(500, [err.message || 'Failed to fetch blog posts']).send(res);
//   }
// };

export const getAllBlogs = async (req, res) => {
  try {
    const { tag } = req.query;
    const query = tag ? { tags: tag } : {};

    const blogs = await Blog.find(query).sort({ createdAt: -1 });

    return new APIResponse(200, blogs, "Fetched all blog posts").send(res);
  } catch (err) {
    return new APIError(500, [
      err.message || "Failed to fetch blog posts",
    ]).send(res);
  }
};

// GET blog by slug
export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return new APIError(404, ["Blog post not found"]).send(res);
    }

    return new APIResponse(200, blog, "Fetched blog post").send(res);
  } catch (err) {
    return new APIError(500, [err.message || "Failed to get blog post"]).send(
      res
    );
  }
};

// UPDATE a blog post by ID
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { time } = req.query;
    const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });

    if (!blog) {
      return new APIError(404, ["Blog post not found"]).send(res);
    }

    const newUserActivity = userActivity({
      userId: req.user.id,
      event: {
        eventType: "Blog",
        eventId: blog._id,
        eventStamp: {
          title: blog.title,
        },
        action: "updated",
        totalTime: Number(time),
      },
    });

    await newUserActivity.save();

    return new APIResponse(200, blog, "Blog post updated").send(res);
  } catch (err) {
    return new APIError(400, [
      err.message || "Failed to update blog post",
    ]).send(res);
  }
};

// DELETE a blog post by ID
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { time } = req.query;
    const deleted = await Blog.findByIdAndDelete(id);

    if (!deleted) {
      return new APIError(404, ["Blog post not found"]).send(res);
    }

    const newUserActivity = userActivity({
      userId: req.user.id,
      event: {
        eventType: "Blog",
        eventId: deleted._id,
        eventStamp: {
          title: deleted.title,
        },
        action: "deleted",
        totalTime: Number(time),
      },
    });

    await newUserActivity.save();

    return new APIResponse(200, deleted, "Blog post deleted").send(res);
  } catch (err) {
    return new APIError(500, [
      err.message || "Failed to delete blog post",
    ]).send(res);
  }
};

// GET featured posts
export const getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ featuredPost: true }).sort({
      createdAt: -1,
    });
    return new APIResponse(200, blogs, "Fetched featured posts").send(res);
  } catch (err) {
    return new APIError(500, [
      err.message || "Failed to fetch featured posts",
    ]).send(res);
  }
};

// SEARCH blogs by keyword (title, excerpt, content, tags)
export const searchBlogs = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return new APIError(400, ["Search keyword is required"]).send(res);
    }

    const blogs = await Blog.find({
      $or: [
        { title: new RegExp(keyword, "i") },
        { excerpt: new RegExp(keyword, "i") },
        { content: new RegExp(keyword, "i") },
        { tags: new RegExp(keyword, "i") },
      ],
    });

    return new APIResponse(200, blogs, "Search results").send(res);
  } catch (err) {
    return new APIError(500, [err.message || "Search failed"]).send(res);
  }
};

export const getRelatedBlogs = async (req, res) => {
  try {
    const { slug } = req.params;

    const currentBlog = await Blog.findOne({ slug });

    if (!currentBlog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    // Normalize tags to lowercase
    const normalizedTags = (currentBlog.tags || []).map((tag) =>
      tag.toLowerCase()
    );

    // Create regex array for case-insensitive match
    const regexTags = normalizedTags.map((tag) => new RegExp(`^${tag}$`, "i"));

    const related = await Blog.find({
      slug: { $ne: slug }, // Exclude current blog
      tags: { $in: regexTags },
    })
      .sort({ createdAt: -1 })
      .limit(4);

    return res.status(200).json({ success: true, data: related });
  } catch (err) {
    console.error("❌ Error fetching related blogs:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
