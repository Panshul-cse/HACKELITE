import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: '',
        },
        role: {
            type: String,
            required: true,
        },
        requiredSkills: {
            type: [String],
            default: [],
        },
        targetSize: {
            type: Number,
            default: 5,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        invitations: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                status: {
                    type: String,
                    enum: ['pending', 'accepted', 'rejected'],
                    default: 'pending',
                },
                sentAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        status: {
            type: String,
            enum: ['active', 'completed', 'archived'],
            default: 'active',
        },
    },
    { timestamps: true }
);

const Team = mongoose.model('Team', teamSchema);

export default Team;
