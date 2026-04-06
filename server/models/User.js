import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: /.+\@.+\..+/,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },
        skills: {
            type: [String],
            default: [],
        },
        bio: {
            type: String,
            default: '',
        },
        role: {
            type: String,
            default: 'Developer',
        },
        location: {
            type: String,
            default: '',
        },
        experience: {
            type: String,
            enum: ['beginner', 'intermediate', 'expert'],
            default: 'intermediate',
        },
        profileViews: {
            type: Number,
            default: 0,
        },
        teams: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Team',
            },
        ],
        connections: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (passwordToCompare) {
    return bcryptjs.compare(passwordToCompare, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const User = mongoose.model('User', userSchema);

export default User;
