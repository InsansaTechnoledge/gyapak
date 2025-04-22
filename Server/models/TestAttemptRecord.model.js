import { Schema, model } from "mongoose";

const TestAttemptSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true]
    },
    eventId: {
        type: String,
        required: true
    },
    attempts: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
        expires: 21600 //6 hours
    }
});

export const TestAttemptRecordModel = model('testAttemptRecord', TestAttemptSchema);