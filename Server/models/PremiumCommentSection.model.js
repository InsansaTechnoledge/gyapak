import {Schema , model } from 'mongoose'

const PremiumCommentSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    examId : {
        type: String,
        required: true,
        index: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'PremiumComment',
        default: null
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {
    timestamps: true
})

PremiumCommentSchema.virtual('replies' , {
    ref: 'PremiumComment',
    localField: '_id',
    foreignField: 'parent'
});

PremiumCommentSchema.set('toJSON', { virtuals: true });
PremiumCommentSchema.set('toObject', { virtuals: true });

export const PremiumComment = model('PremiumComment', PremiumCommentSchema);
