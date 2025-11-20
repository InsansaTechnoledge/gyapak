import {Source} from "../models/source.model.js";

// GET /api/sources
export const getSources = async (req, res) => {
  try {
    const sources = await Source.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: sources });
  } catch (err) {
    console.error("getSources error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/sources
export const createSource = async (req, res) => {
  try {
    const {
      code,
      name,
      baseUrl,
      notificationUrl,
      type = "html",
      selector = null,
      intervalMinutes = 5,
    } = req.body;

    if (!code || !name || !baseUrl || !notificationUrl) {
      return res
        .status(400)
        .json({ success: false, message: "code, name, baseUrl, notificationUrl are required" });
    }

    const exists = await Source.findOne({ code });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "Source with this code already exists" });
    }

    const source = await Source.create({
      code,
      name,
      baseUrl,
      notificationUrl,
      type,
      selector,
      intervalMinutes,
    });

    res.status(201).json({ success: true, data: source });
  } catch (err) {
    console.error("createSource error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/sources/:id
export const updateSource = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      name,
      baseUrl,
      notificationUrl,
      type,
      selector,
      intervalMinutes,
      isActive,
    } = req.body;

    const source = await Source.findById(id);
    if (!source) {
      return res.status(404).json({ success: false, message: "Source not found" });
    }

    if (code) source.code = code;
    if (name) source.name = name;
    if (baseUrl) source.baseUrl = baseUrl;
    if (notificationUrl) source.notificationUrl = notificationUrl;
    if (type) source.type = type;
    if (selector !== undefined) source.selector = selector;
    if (intervalMinutes !== undefined) source.intervalMinutes = intervalMinutes;
    if (isActive !== undefined) source.isActive = isActive;

    await source.save();

    res.json({ success: true, data: source });
  } catch (err) {
    console.error("updateSource error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/sources/:id  (hard delete)
export const deleteSource = async (req, res) => {
  try {
    const { id } = req.params;
    const source = await Source.findByIdAndDelete(id);

    if (!source) {
      return res.status(404).json({ success: false, message: "Source not found" });
    }

    res.json({ success: true, message: "Source deleted" });
  } catch (err) {
    console.error("deleteSource error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
