import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        messageType: {
            type: String,
            enum: ['text', 'system'],
            default: 'text',
        },
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        readAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

// Add index for faster queries
messageSchema.index({ senderId: 1, recipientId: 1 });
messageSchema.index({ teamId: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
