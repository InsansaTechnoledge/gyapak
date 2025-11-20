import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const { sourceCode, limit = 50 } = req.query;
    const q = {};
    if (sourceCode) q.sourceCode = sourceCode;

    const docs = await Notification.find(q)
      .sort({ firstSeenAt: -1 })
      .limit(Number(limit))
      .lean();

    res.json({ success: true, data: docs });
  } catch (err) {
    console.error("getNotifications error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
