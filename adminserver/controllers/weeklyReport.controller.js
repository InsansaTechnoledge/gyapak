import Event from "../models/EventModel.js";
import { generateReportPDF } from "../utils/generatePdf.js";

const generateReport = async () => {
  try {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const fiveDaysFromNow = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const calculateDaysRemaining = (endDate) => {
      const diff = new Date(endDate) - now;
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };
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
      ]);

    const report = {
      reportGenerated: now,
      period: { from: oneWeekAgo, to: now },

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
    };
    generateReportPDF(report);
  } catch (err) {
    console.log(err);
  }
};

export default generateReport;
