import mongoose from 'mongoose';

const SubscriberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    isSubscribed: { 
        type: Boolean,
        default: true 
    },
    unsubscribeToken: {
        type: String
    }
});

SubscriberSchema.pre('save', function (next) {
    if (!this.unsubscribeToken) {
        const crypto = require('crypto');
        this.unsubscribeToken = crypto.randomBytes(16).toString('hex');
    }
    next();
});

const Subscriber = mongoose.model('Subscriber', SubscriberSchema);
export default Subscriber;
