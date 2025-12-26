import mongoose from "mongoose";

const userActivitySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      eventType: {
        type: String,
        enum: [
          "Blog",
          "CurrentAffair",
          "DailyCurrentAffairPdf",
          "Event",
          "FAQ",
          "Organization",
          "Question",
          "EventType",
        ],
        required: true,
      },
      eventId: {
        type: mongoose.Types.ObjectId,
        refPath: "event.eventType",
        required: true,
      },
      eventStamp: {
        title: {
          type: String,
        },
      },
      action: {
        type: String,
        required: true,
        enum: ["created", "deleted", "updated"],
      },
      totalTime: {
        type: Number, // seconds
        required: true,
      },
    },
  },
  { timestamps: true }
);

const userActivity = mongoose.model("userActivity", userActivitySchema);

export default userActivity;
