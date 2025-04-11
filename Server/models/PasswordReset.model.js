import mongoose from 'mongoose';

const resetTokenSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'User' 
    },
    token: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now(), 
        expires: 3600 
    } // 1 hour TTL
});

const PasswordResetToken = mongoose.model('PasswordResetToken', resetTokenSchema);
export default PasswordResetToken;