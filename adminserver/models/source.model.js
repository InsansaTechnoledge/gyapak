import mongoose from "mongoose";

const sourceScheme = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    baseUrl: {
        type: String,
        required: true
    },
    notificationUrl: {
        type: String,
        required: true
    },
    type: {
        type: String,
        ernum: ['html', 'rss' , 'json'],
        default: 'html'
    },
    selector: {
        type: String,
        default: null
    },
    intervalMinutes: {
        type: Number,
        default: 5
    },
    lastCheckedAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
})

export const Source = mongoose.model('Source', sourceScheme)