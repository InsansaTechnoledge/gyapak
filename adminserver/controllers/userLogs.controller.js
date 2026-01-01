import userActivity from "../models/activity.model.js";
import User from "../models/user.models.js";

const getAllUser = async (req, res) => {
  try {
    const pageNumber = Number(req.query.page) || 1;
    const pageSize = Number(req.query.limit) || 10;
    const userId = req.query.userId; // Optional filter by user
    const dateFilter = req.query.dateFilter; // "today", "yesterday", "last7days", "custom"
    const customDate = req.query.customDate; // ISO date string for custom filter

    // Build query filter
    const filter = {};
    
    // User filter
    if (userId) {
      filter.userId = userId;
    }

    // Date filter
    if (dateFilter) {
      let startDate, endDate;

      switch (dateFilter) {
        case "today":
          startDate = new Date();
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date();
          endDate.setHours(23, 59, 59, 999);
          break;

        case "yesterday":
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date();
          endDate.setDate(endDate.getDate() - 1);
          endDate.setHours(23, 59, 59, 999);
          break;

        case "last7days":
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 7);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date();
          endDate.setHours(23, 59, 59, 999);
          break;

        case "custom":
          if (customDate) {
            startDate = new Date(customDate);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(customDate);
            endDate.setHours(23, 59, 59, 999);
          }
          break;
      }

      if (startDate && endDate) {
        filter.createdAt = { $gte: startDate, $lte: endDate };
      }
    }

    // Get total count for pagination
    const totalCount = await userActivity.countDocuments(filter);

    // Fetch paginated data with explicit populate
    const data = await userActivity
      .find(filter)
      .populate({
        path: "userId",
        model: "User",
        select: "name email role"
      })
      .populate("event.eventId")
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .lean(); 

    res.status(200).json({
      success: true,
      count: data.length,
      total: totalCount,
      page: pageNumber,
      totalPages: Math.ceil(totalCount / pageSize),
      data,
    });
  } catch (err) {
    console.error("Error in getAllUser:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getUsersList = async (req, res) => {
  try {
    // Fetch all users from User model
    const users = await User.find({})
      .select("_id name email role")
      .sort({ name: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const exportLogsToExcel = async (req, res) => {
  try {
    const userId = req.query.userId; // Optional filter by user
    const dateFilter = req.query.dateFilter; // "today", "yesterday", "last7days", "custom"
    const customDate = req.query.customDate; // ISO date string for custom filter

    // Build query filter (same logic as getAllUser)
    const filter = {};
    
    // User filter
    if (userId) {
      filter.userId = userId;
    }

    // Date filter
    if (dateFilter) {
      let startDate, endDate;

      switch (dateFilter) {
        case "today":
          startDate = new Date();
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date();
          endDate.setHours(23, 59, 59, 999);
          break;

        case "yesterday":
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date();
          endDate.setDate(endDate.getDate() - 1);
          endDate.setHours(23, 59, 59, 999);
          break;

        case "last7days":
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 7);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date();
          endDate.setHours(23, 59, 59, 999);
          break;

        case "custom":
          if (customDate) {
            startDate = new Date(customDate);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(customDate);
            endDate.setHours(23, 59, 59, 999);
          }
          break;
      }

      if (startDate && endDate) {
        filter.createdAt = { $gte: startDate, $lte: endDate };
      }
    }

    // Fetch ALL data without pagination
    const data = await userActivity
      .find(filter)
      .populate({
        path: "userId",
        model: "User",
        select: "name email role"
      })
      .populate("event.eventId")
      .sort({ createdAt: -1 })
      .lean(); 

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error("Error in exportLogsToExcel:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export { getAllUser, getUsersList, exportLogsToExcel };

