// ============================================
// File: controllers/reportController.js
// ============================================
import Authority from "../models/AuthorityModel.js";
import { Blog } from "../models/BlogPost.model.js";
import Category from "../models/CategoryModel.js";
import { CurrentAffair } from "../models/currentAffairs.models.js";
import Event from "../models/EventModel.js";
import FAQ from "../models/FAQ.model.js";
import Organization from "../models/OrganizationModel.js";
import Question from "../models/QuestionsModel.js";

export const getWeeklyReport = async (req, res) => {
  try {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const fiveDaysFromNow = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Weekly Entry Counts
    const [
      authoritiesCount,
      blogsCount,
      categoriesCount,
      currentAffairsCount,
      eventsCount,
      faqsCount,
      organizationsCount,
      questionsCount,
    ] = await Promise.all([
      Authority.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      Blog.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      Category.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      CurrentAffair.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      Event.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      FAQ.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      Organization.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      Question.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
    ]);

    console.log("Weekly Report Data:", {
      authoritiesCount,
      blogsCount,
      categoriesCount,
      currentAffairsCount,
      eventsCount,
      faqsCount,
      organizationsCount,
      questionsCount,
    });

    // Upcoming Events Analysis
    const [urgentEvents, soonEvents, upcomingEvents, recentlyAddedEvents] =
      await Promise.all([
        Event.find({ end_date: { $gte: now, $lte: twoDaysFromNow } })
          .populate("organization_id", "name abbreviation")
          .select(
            "name date_of_commencement end_date event_type organization_id apply_link briefDetails isNewEvent"
          )
          .sort({ end_date: 1 })
          .limit(10),

        Event.find({ end_date: { $gt: twoDaysFromNow, $lte: fiveDaysFromNow } })
          .populate("organization_id", "name abbreviation")
          .select(
            "name date_of_commencement end_date event_type organization_id apply_link briefDetails isNewEvent"
          )
          .sort({ end_date: 1 })
          .limit(10),

        Event.find({
          end_date: { $gt: fiveDaysFromNow, $lte: sevenDaysFromNow },
        })
          .populate("organization_id", "name abbreviation")
          .select(
            "name date_of_commencement end_date event_type organization_id isNewEvent"
          )
          .sort({ end_date: 1 })
          .limit(10),

        Event.find({ createdAt: { $gte: oneWeekAgo } })
          .populate("organization_id", "name abbreviation")
          .select("name event_type createdAt organization_id isNewEvent")
          .sort({ createdAt: -1 })
          .limit(10),
      ]);

    // Blog Analytics
    const [recentBlogs, featuredBlogs, topAuthors] = await Promise.all([
      Blog.find({ createdAt: { $gte: oneWeekAgo } })
        .select("title author.name createdAt readTime tags")
        .sort({ createdAt: -1 })
        .limit(5),

      Blog.countDocuments({
        createdAt: { $gte: oneWeekAgo },
        featuredPost: true,
      }),

      Blog.aggregate([
        { $match: { createdAt: { $gte: oneWeekAgo } } },
        { $group: { _id: "$author.name", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    // Current Affairs Analytics
    const affairsBreakdown = await CurrentAffair.aggregate([
      { $match: { createdAt: { $gte: oneWeekAgo } } },
      { $unwind: "$affairs" },
      { $group: { _id: "$affairs.category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Question Analytics
    const questionStats = await Question.aggregate([
      { $match: { createdAt: { $gte: oneWeekAgo } } },
      { $group: { _id: "$difficulty", count: { $sum: 1 } } },
    ]);

    // FAQ by State
    const faqByState = await FAQ.aggregate([
      { $match: { createdAt: { $gte: oneWeekAgo } } },
      { $group: { _id: "$state", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Event Type Distribution
    const eventTypeDistribution = await Event.aggregate([
      { $match: { createdAt: { $gte: oneWeekAgo } } },
      { $group: { _id: "$event_type", count: { $sum: 1 } } },
    ]);

    // Organization Activity
    const organizationActivity = await Organization.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "organization_id",
          as: "events",
        },
      },
      {
        $match: {
          "events.createdAt": { $gte: oneWeekAgo },
        },
      },
      {
        $project: {
          name: 1,
          abbreviation: 1,
          eventCount: { $size: "$events" },
        },
      },
      { $sort: { eventCount: -1 } },
      { $limit: 10 },
    ]);

    const calculateDaysRemaining = (endDate) => {
      const diff = new Date(endDate) - now;
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    const report = {
      reportGenerated: now,
      period: { from: oneWeekAgo, to: now },
      summary: {
        totalEntries:
          authoritiesCount +
          blogsCount +
          categoriesCount +
          currentAffairsCount +
          eventsCount +
          faqsCount +
          organizationsCount +
          questionsCount,
        bySection: {
          authorities: authoritiesCount,
          blogs: blogsCount,
          categories: categoriesCount,
          currentAffairs: currentAffairsCount,
          events: eventsCount,
          faqs: faqsCount,
          organizations: organizationsCount,
          questions: questionsCount,
        },
      },
      upcomingEvents: {
        urgent: urgentEvents.map((e) => ({
          ...e.toObject(),
          daysRemaining: calculateDaysRemaining(e.end_date),
          urgencyLevel: "critical",
        })),
        soon: soonEvents.map((e) => ({
          ...e.toObject(),
          daysRemaining: calculateDaysRemaining(e.end_date),
          urgencyLevel: "high",
        })),
        upcoming: upcomingEvents.map((e) => ({
          ...e.toObject(),
          daysRemaining: calculateDaysRemaining(e.end_date),
          urgencyLevel: "medium",
        })),
        recentlyAdded: recentlyAddedEvents,
      },
      blogAnalytics: {
        recentBlogs,
        featuredCount: featuredBlogs,
        topAuthors,
      },
      currentAffairsBreakdown: affairsBreakdown,
      questionStatistics: {
        byDifficulty: questionStats,
        total: questionsCount,
      },
      faqAnalytics: {
        byState: faqByState,
        total: faqsCount,
      },
      eventTypeDistribution,
      organizationActivity,
      insights: {
        mostActiveSection: Object.entries({
          Authorities: authoritiesCount,
          Blogs: blogsCount,
          Categories: categoriesCount,
          "Current Affairs": currentAffairsCount,
          Events: eventsCount,
          FAQs: faqsCount,
          Organizations: organizationsCount,
          Questions: questionsCount,
        }).reduce((a, b) => (a[1] > b[1] ? a : b))[0],
        criticalEventsCount: urgentEvents.length,
        growthIndicator:
          eventsCount + blogsCount + questionsCount > 10 ? "High" : "Moderate",
      },
    };

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Error generating weekly report:", error);
    res.status(500).json({
      success: false,
      message: "Error generating weekly report",
      error: error.message,
    });
  }
};

// export const getWeeklyComparison = async (req, res) => {
//   try {
//     const now = new Date();
//     const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//     const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

//     const [currentWeek, previousWeek] = await Promise.all([
//       Promise.all([
//         Event.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
//         Blog.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
//         Question.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
//         CurrentAffair.countDocuments({ createdAt: { $gte: oneWeekAgo } })
//       ]),
//       Promise.all([
//         Event.countDocuments({ createdAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo } }),
//         Blog.countDocuments({ createdAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo } }),
//         Question.countDocuments({ createdAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo } }),
//         CurrentAffair.countDocuments({ createdAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo } })
//       ])
//     ]);

//     const calculateGrowth = (current, previous) => {
//       if (previous === 0) return current > 0 ? 100 : 0;
//       return ((current - previous) / previous * 100).toFixed(1);
//     };

//     res.status(200).json({
//       success: true,
//       data: {
//         events: {
//           current: currentWeek[0],
//           previous: previousWeek[0],
//           growth: calculateGrowth(currentWeek[0], previousWeek[0])
//         },
//         blogs: {
//           current: currentWeek[1],
//           previous: previousWeek[1],
//           growth: calculateGrowth(currentWeek[1], previousWeek[1])
//         },
//         questions: {
//           current: currentWeek[2],
//           previous: previousWeek[2],
//           growth: calculateGrowth(currentWeek[2], previousWeek[2])
//         },
//         currentAffairs: {
//           current: currentWeek[3],
//           previous: previousWeek[3],
//           growth: calculateGrowth(currentWeek[3], previousWeek[3])
//         }
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error generating comparison',
//       error: error.message
//     });
//   }
// };
