// import { DailyCurrentAffairPdf } from "../models/DailyCurrentAffairPdf.js";

import { DailyCurrentAffairPdf } from "../models/DailyCurrentAfairPdf.js";

export const addNewPdf = async (req, res) => {
  try {
    const {
      date,
      pdfLink,
      title,
      category,
      description,
      tags,
      isScheduled,
      scheduledPublishDate,
    } = req.body;

    if (!pdfLink || !date) {
      return res
        .status(400)
        .json({ message: "PDF link or date not provided for adding PDF." });
    }

    // Validate scheduled publish date if scheduling is enabled
    if (isScheduled && !scheduledPublishDate) {
      return res.status(400).json({
        message:
          "Scheduled publish date is required when scheduling is enabled.",
      });
    }

    // const existing = await DailyCurrentAffairPdf.findOne({
    //   $and: [{ date: date }, { category: category }],
    // });
    // if (existing) {
    //   return res.status(409).json({
    //     message: `PDF for this date and category (${category}) already exists.`,
    //   });
    // }

    const pdfData = {
      date,
      pdfLink,
      title,
      category,
      description,
      tags,
      isScheduled: isScheduled || false,
      scheduledPublishDate: isScheduled ? new Date(scheduledPublishDate) : null,
      // If scheduled, set isPublished to false initially
      isPublished: isScheduled ? false : true,
    };

    const newPdf = new DailyCurrentAffairPdf(pdfData);

    await newPdf.save();

    return res.status(201).json({
      message: isScheduled
        ? "PDF scheduled successfully."
        : "PDF uploaded successfully.",
      data: newPdf,
    });
  } catch (e) {
    console.error("Error adding PDF:", e);
    return res.status(500).json({
      message: "Something went wrong while adding the PDF.",
      error: e,
    });
  }
};

// export const fetchPdf = async (req, res) => {
//     try{

//         const data = await DailyCurrentAffairPdf.find()
//         return res.status(200).json({
//             message: "fetched all the pdfs",
//             data:data
//         })

//     } catch(e) {
//         return res.status(500).json({message: "something went wrong while fetching pdf's"})
//     }
// }

// controller
export const fetchPdf = async (req, res) => {
  try {
    const {
      // time filters (all optional)
      date, // e.g. "2025-11-05"  -> whole day
      from,
      to, // e.g. "2025-11-01" .. "2025-11-30"
      month,
      year, // e.g. month=11&year=2025

      // facets
      category, // single OR CSV OR ?category=A&category=B
      tags, // CSV or repeated: ?tags=Politics,Sports
      published, // true/false/1/0/yes/no
      search, // text search in title/description

      // pagination & sorting
      page = "1",
      limit = "20",
      sort = "-date", // e.g. "-date,title"
    } = req.query;

    // ---------- build filter ----------
    const filter = {};

    // published flag - default to true (only show published content)
    // This ensures scheduled content doesn't appear before scheduled time
    if (published !== undefined) {
      const v = String(published).toLowerCase();
      filter.isPublished = ["true", "1", "yes"].includes(v);
    } else {
      // Default: only show published content
      filter.isPublished = true;
    }

    // category filter (accepts CSV or array)
    if (category) {
      const catList = Array.isArray(category)
        ? category
        : String(category)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
      if (catList.length) filter.category = { $in: catList };
    }

    // tags filter (any of the tags)
    if (tags) {
      const tagList = Array.isArray(tags)
        ? tags
        : String(tags)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
      if (tagList.length) filter.tags = { $in: tagList };
    }

    // date / range filters
    const startEndOfDay = (dStr) => {
      const d = new Date(dStr);
      if (isNaN(d)) return null;
      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    };

    let start = null,
      end = null;

    if (date) {
      const r = startEndOfDay(date);
      if (r) ({ start, end } = r);
    } else if (month && year) {
      // month: 1-12
      const y = Number(year),
        m = Number(month) - 1;
      const s = new Date(y, m, 1, 0, 0, 0, 0);
      const e = new Date(y, m + 1, 0, 23, 59, 59, 999);
      start = s;
      end = e;
    } else if (from || to) {
      if (from) {
        start = new Date(from);
        start.setHours(0, 0, 0, 0);
      }
      if (to) {
        end = new Date(to);
        end.setHours(23, 59, 59, 999);
      }
    }

    if (start || end) {
      filter.date = {};
      if (start) filter.date.$gte = start;
      if (end) filter.date.$lte = end;
    }

    // simple search on title/description (case-insensitive)
    if (search && String(search).trim()) {
      const safe = String(search)
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const rx = new RegExp(safe, "i");
      filter.$or = [{ title: rx }, { description: rx }];
    }

    // ---------- pagination & sorting ----------
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const sortSpec = {};
    String(sort)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((field) => {
        if (field.startsWith("-")) sortSpec[field.slice(1)] = -1;
        else sortSpec[field] = 1;
      });
    if (!Object.keys(sortSpec).length) sortSpec.date = -1;

    // ---------- handle scheduled publishing ----------
    // Auto-publish scheduled content whose time has passed
    //Code has been commented for now but is required for LATER

    // const now = new Date();
    // await DailyCurrentAffairPdf.updateMany(
    //   {
    //     isScheduled: true,
    //     isPublished: false,
    //     scheduledPublishDate: { $lte: now }
    //   },
    //   {
    //     $set: { isPublished: true }
    //   }
    // );

    // ---------- query ----------
    const [items, total] = await Promise.all([
      DailyCurrentAffairPdf.find(filter)
        .sort(sortSpec)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      DailyCurrentAffairPdf.countDocuments(filter),
    ]);

    return res.status(200).json({
      message: "ok",
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
      data: items,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ message: "something went wrong while fetching pdfs" });
  }
};

export const deletePdfByID = async (req, res) => {
  try {
    const { id } = req.body;

    console.log(id);

    if (!id) {
      return res
        .status(400)
        .json({ message: "PDF id not provided for deleting PDF." });
    }

    const deleted = await DailyCurrentAffairPdf.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "No PDF found with the given id." });
    }

    return res.status(200).json({
      message: "PDF deleted successfully",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Something went wrong while deleting the PDF",
      error: e.message,
    });
  }
};
