import Event from '../models/EventModel.js'
import Organization from '../models/OrganizationModel.js';
import EventType from '../models/EventTypeModel.js';
import Authority from '../models/AuthorityModel.js';

export const getLatestUpdates = async (req, res) => {
  try {
    // Calculate date range for last year
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const exams = await Event.aggregate([
      {
        $match: {
          updatedAt: { $gte: oneYearAgo, $lte: now }
        }
      },
      {
        $lookup: {
          from: "organizations", // The name of the organization collection
          localField: "organization_id", // The field in the Event document that references the Organization
          foreignField: "_id", // The field in the Organization collection that is referenced (usually _id)
          as: "organizationDetails" // The field in the output that will contain the organization data
        }
      },
      {
        $unwind: "$organizationDetails" // To flatten the organizationDetails array into a single object
      },
      {
        $project: {
          _id: 1,
          name: 1, // Event name or other fields you want to include
          updatedAt: 1,
          apply_link: 1,
          organizationName: "$organizationDetails.abbreviation" // Including the organization name
        }
      }
    ]);

    res.status(201).json(exams);
  }
  catch (err) {
    console.log(err);
  }
};

export const getNewEvents = async (req, res) => {
  try {
    const { event_id } = req.params;

    const event = await Event.findById(event_id).select("isNewEvent name").lean();

    if (!event) return res.status(404).json({ isNewEvent: false });

    return res.status(200).json({
      isNewEvent: !!event.isNewEvent,
      name: event.name,
    });
  } catch (e) {
    return res.status(500).json({ message: "error", error: e?.message || e });
  }
};

export const getLatestEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ createdAt: -1 })
      .select('name _id ')
      .limit(10)
      .lean();

    return res.status(200).json({
      message: "Latest events fetched successfully",
      data: events,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Something went wrong",
      error: e?.message,
    });
  }
};




// GET /api/event/search?q=apprentice
export const searchEventsByName = async (req, res) => {
  try {
    const { q } = req.query;

    // basic validation
    if (!q || !q.trim()) {
      return res.status(400).json({
        message: "Query parameter 'q' is required",
      });
    }

    const query = q.trim();

    // escape regex special chars to avoid breaking the pattern
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i"); // i = case-insensitive

    // optional: if you want only "recent" / active events,
    // you can later add filters here (date_of_commencement, end_date, etc.)
    const results = await Event.aggregate([
      {
        $match: {
          name: { $regex: regex }, // partial match on name
        },
      },
      {
        $lookup: {
          from: "organizations",
          localField: "organization_id",
          foreignField: "_id",
          as: "organizationDetails",
        },
      },
      {
        $unwind: {
          path: "$organizationDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          event_type: 1,
          date_of_notification: 1,
          date_of_commencement: 1,
          end_date: 1,
          briefDetails: 1,
          apply_link: 1,
          organizationName: "$organizationDetails.abbreviation",
          organizationFullName: "$organizationDetails.name",
          organizationLogo: "$organizationDetails.logo",
        },
      },
      {
        $sort: {
          date_of_commencement: 1,
          createdAt: -1,
        },
      },
      {
        $limit: 20, // limit results for suggestions / search bar
      },
    ]);

    return res.status(200).json({
      status: 200,
      success: true,
      count: results.length,
      data: results,
    });
  } catch (err) {
    console.error("searchEventsByName error:", err);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Failed to search events",
      errors: [err.toString()],
    });
  }
};



export const getEvent = async (req, res) => {
  try {

    const { eventId } = req.params;

    const exam = await Event.findOne({
      _id: eventId
    }
    );
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const organizationId = exam.organization_id;

    const organization = await Organization.findOne({ _id: organizationId });

    // Return the exam
    res.status(200).json({ exam, organization });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const lastupdated = async (req, res) => {
  try {
    const update = await EventType.findOne({ type: "update" });
    if (!update) {
      return res.status(201).json({ data: new Date() });
    }
    res.status(201).json({ data: update.lastUpdated });
  } catch (err) {
    console.log("error occured in fetching last updated date:", err);
    res.status(400).json({ message: "Error occured" });
  }
};

export const getEventsForCalendar = async (req, res) => {
  const { category, state } = req.query;
  try {
    let orgs = null;
    if (category && state) {
      orgs = await Authority.findById(state)
        .select('organizations');
      const events = await Promise.all(
        orgs.organizations.map(org =>
          Organization.findOne({ _id: org, category: category })
            .select('name abbreviation logo')
            .populate('events', 'name date_of_notification end_date event_type _id')
        )
      );
      const filtered = events.filter(e => e && e.events && e.events.length > 0);
      return res.status(200).json(filtered);
    }
    else if (category && !state) {
      orgs = await Organization.find({ category })
        .select('name abbreviation logo') // Only return these org fields
        .populate('events', 'name date_of_notification end_date event_type _id');
      const filtered = orgs.filter(e => e && e.events && e.events.length > 0);
      return res.status(200).json(filtered);
    }
    else if (!category && state) {
      orgs = await Authority.findById(state)
        .select('organizations');
      const events = await Promise.all(
        orgs.organizations.map(org =>
          Organization.findById(org)
            .select('name abbreviation logo')
            .populate('events', 'name date_of_notification end_date event_type _id')
        )
      );

      const filtered = events.filter(e => e && e.events && e.events.length > 0);
      return res.status(200).json(filtered);
    }
    else return res.status(400).json({ message: "Please provide category or state" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getEventTypes = async (req, res) => {
  try {
    const eventTypes = await EventType.find({ type: { $ne: "update" } }).select('type _id');
    res.status(200).json(eventTypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTodaysEvents = async (req, res) => {
  try {
    const todayStr = new Date().toLocaleString("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    console.log("getTodaysEvents date check =>", { todayStr });

    const events = await Event.find({
      date_of_commencement: { $gte: todayStr }, 
    })
      .sort({ date_of_commencement: 1, createdAt: -1 }) 
      .select("name _id event_type date_of_commencement");

    return res.status(200).json(events);
  } catch (err) {
    console.error("getTodaysEvents error:", err);
    return res.status(500).json({
      status: 500,
      message: "Failed to fetch today's events",
      success: false,
      errors: [err.toString()],
      data: null,
    });
  }
};

// GET /api/v1i2/event/by-month?year=2025&month=12
export const getEventsByMonth = async (req, res) => {
  try {
    let { year, month } = req.query;

    const now = new Date();

    // fallback to current year/month if not provided
    const y = parseInt(year, 10) || now.getFullYear();
    const m = parseInt(month, 10) || (now.getMonth() + 1); // 1–12

    // pad month to "MM"
    const mm = String(m).padStart(2, "0");

    // since date_of_commencement is "YYYY-MM-DD" (string),
    // we can safely use string ranges within that month
    const startStr = `${y}-${mm}-01`; // e.g. "2025-12-01"
    const endStr   = `${y}-${mm}-31`; // "2025-12-31" (31 is fine for string compare)

    console.log("getEventsByMonth =>", { y, m, startStr, endStr });

    const events = await Event.find({
      date_of_commencement: { $gte: startStr, $lte: endStr },
    })
      .sort({ date_of_commencement: 1, createdAt: -1 })
      .select(
        "name _id event_type date_of_commencement date_of_notification end_date"
      );

    return res.status(200).json(events);
  } catch (err) {
    console.error("getEventsByMonth error:", err);
    return res.status(500).json({
      status: 500,
      message: "Failed to fetch month-wise events",
      success: false,
      errors: [err.toString()],
      data: null,
    });
  }
};


// GET /api/event/with-salary?type=job&limit=200
export const getEventsWithSalary = async (req, res) => {
  try {
    const { type = "job", limit = 2000 } = req.query;
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 200, 1), 5000);

    // only consider these keys as salary-related
    const SALARY_KEY_REGEX =
      /salary|pay\s*scale|pay\s*level|remuneration|stipend|wage|ctc|consolidated|contract\s*period|emoluments/i;

    const pipeline = [
      {
        $match: {
          details: { $type: "object" },
          // ...(type ? { "details.Type": type } : {}),
        },
      },

      { $addFields: { detailsArr: { $objectToArray: "$details" } } },

      // ✅ STRICT: key must contain salary-related words
      {
        $addFields: {
          salaryCandidates: {
            $filter: {
              input: "$detailsArr",
              as: "d",
              cond: {
                $regexMatch: {
                  input: "$$d.k",
                  regex: SALARY_KEY_REGEX,
                },
              },
            },
          },
        },
      },

      { $match: { "salaryCandidates.0": { $exists: true } } },

      // safe convert candidate values to string
      {
        $addFields: {
          salaryCandidates: {
            $map: {
              input: "$salaryCandidates",
              as: "c",
              in: {
                key: "$$c.k",
                text: {
                  $convert: {
                    input: "$$c.v",
                    to: "string",
                    onError: "",
                    onNull: "",
                  },
                },
              },
            },
          },
        },
      },

      {
        $project: {
          _id: 1,
          name: 1,
          date_of_commencement: 1,
          apply_link: 1,
          salaryCandidates: 1,
        },
      },

      { $sort: { date_of_commencement: 1 } },
      { $limit: safeLimit },
    ];

    const rows = await Event.aggregate(pipeline);

    // Parse salaryMin/Max ONLY from salaryCandidates texts
    const extractNums = (text = "") => {
      if (!text || typeof text !== "string") return [];
      const matches = text.match(/\d[\d,]*/g) || [];
      return matches
        .map((m) => parseInt(m.replace(/,/g, ""), 10))
        .filter((n) => Number.isFinite(n) && n > 0);
    };

    const data = rows.map((e) => {
      const nums = e.salaryCandidates.flatMap((c) => extractNums(c.text));
      const salaryMin = nums.length ? Math.min(...nums) : null;
      const salaryMax = nums.length ? Math.max(...nums) : null;

      return {
        _id: e._id,
        name: e.name,
        date_of_commencement: e.date_of_commencement,
        apply_link: e.apply_link,
        salaryCandidates: e.salaryCandidates,
        salaryMin,
        salaryMax,
      };
    });

    return res.status(200).json({
      status: 200,
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error("getEventsWithSalaryStrict error:", err);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Failed to fetch salary events (strict)",
      errors: [err?.message || String(err)],
    });
  }
};


