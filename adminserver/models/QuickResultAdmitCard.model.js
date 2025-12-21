import mongoose from "mongoose";

const quickResultAdmitCardSchema = new mongoose.Schema({
    kind: {
        type: [String],
        enum: ['result', 'admit_card'],
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    resultDate: {
        type: String,
        default: null
    },
    isTentative: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

export const QuickResultAdmitCard = mongoose.model('QuickResultAdmitCard', quickResultAdmitCardSchema);