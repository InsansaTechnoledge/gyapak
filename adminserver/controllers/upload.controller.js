import userActivity from "../models/activity.model.js";
import Event from "../models/EventModel.js";
import EventType from "../models/EventTypeModel.js";
import Organization from "../models/OrganizationModel.js";

export const uploadEvent = async (req, res) => {
  try {
    const { time } = req.query;
    // Create the new event in MongoDB
    const newEvent = new Event(req.body);
    await newEvent.save();

    // Update related EventType and Organization documents
    await Promise.all([
      EventType.findOneAndUpdate(
        { type: req.body.event_type },
        {
          $push: { events: newEvent._id },
          $set: { lastUpdated: Date.now() },
        }
      ),
      Organization.findByIdAndUpdate(req.body.organization_id, {
        $push: { events: newEvent._id },
      }),
      EventType.findOneAndUpdate(
        { type: "update" },
        {
          $set: { lastUpdated: Date.now() },
        }
      ),
    ]);

    const newUserActivity = userActivity({
      userId: req.user.id,
      event: {
        eventType: "Event",
        eventId: newEvent._id,
        action: "updated",
        totalTime: Number(time),
      },
    });
    await newUserActivity.save();
    return res.status(200).json({
      message: "✅ Event uploaded successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("❌ Error uploading event:", error);
    return res.status(500).json({ message: error.message });
  }
};
