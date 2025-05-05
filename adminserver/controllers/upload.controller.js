import Event from "../models/EventModel.js";
import EventType from "../models/EventTypeModel.js";
import Organization from "../models/OrganizationModel.js";

export const uploadEvent = async (req, res) => {
  try {
    // 🔍 Log incoming request data
    console.log("📥 Received Data:", req.body);

    // Check that briefDetails is actually coming in
    if (!req.body.briefDetails) {
      console.warn("⚠️ Warning: 'briefDetails' not provided in request body.");
    }

    // Create the new event in MongoDB
    const newEvent = await Event.create(req.body);

    // Update related EventType and Organization documents
    await Promise.all([
      EventType.findOneAndUpdate(
        { type: req.body.event_type },
        {
          $push: { events: newEvent._id },
          $set: { lastUpdated: Date.now() }
        }
      ),
      Organization.findByIdAndUpdate(req.body.organization_id, {
        $push: { events: newEvent._id }
      }),
      EventType.findOneAndUpdate(
        { type: "update" },
        {
          $set: { lastUpdated: Date.now() }
        }
      )
    ]);

    return res.status(200).json({
      message: "✅ Event uploaded successfully",
      event: newEvent,
    });

  } catch (error) {
    console.error("❌ Error uploading event:", error);
    return res.status(500).json({ message: error.message });
  }
};
