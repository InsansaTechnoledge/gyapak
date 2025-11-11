import { Schema, model } from 'mongoose';

const DailyPdfSchema = new Schema(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
      unique: [true, 'Duplicate entry of data not allowed'],
    },

    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },

    pdfLink: {
      type: String,
      required: [true, 'PDF link is required'],
      trim: true,
    },

    category: {
      type: String,
      enum: ['Current Affairs', 'Editorial', 'MCQs', 'Monthly Summary'],
      default: 'Current Affairs',
    },

    uploadedBy: {
      type: String, // or ObjectId if linked to a User model
      default: 'Admin',
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    tags: {
      type: [String], // e.g. ["Politics", "Economy", "Sports"]
      default: [],
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // auto-adds createdAt & updatedAt
);

export const DailyCurrentAffairPdf = model('DailyCurrentAffairPdf', DailyPdfSchema);
