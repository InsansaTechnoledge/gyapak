import mongoose from "mongoose";

const UpcomingEventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    date_of_notification: {
      type: String,
      required: true,
    },
    document_links: [
      {
        type: String,
      },
    ],
    organization_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    event_type: {
      type: String,
      enum: ["Exam", "AdmitCard", "Result"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);