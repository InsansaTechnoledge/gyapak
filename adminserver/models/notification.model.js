import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    sourceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Source',
        required: true
    },
    sourceCode: {
        type: String,
        required: true,
        index: true
    },

    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        default: null
    },
    rawText: {
        type: String,
        default: null
    },
    publishedAt: { type: Date, default: null },
    firstSeenAt: { type: Date, default: () => new Date() },

    itemHash: { type: String, required: true },
} , {
    timestamps: true
})

NotificationSchema.index({ sourceCode: 1, link: 1 }, { unique: true });
NotificationSchema.index({ sourceCode: 1, itemHash: 1 }, { unique: true });

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;