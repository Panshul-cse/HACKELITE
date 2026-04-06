import User from '../models/User.js';

// Get all users with filters
export const getAllUsers = async (req, res) => {
    try {
        const { skills, experience, location } = req.query;
        const filters = { isActive: true };

        if (skills) {
            filters.skills = { $in: skills.split(',').map(s => s.trim()) };
        }

        if (experience) {
            filters.experience = experience;
        }

        if (location) {
            filters.location = { $regex: location, $options: 'i' };
        }

        const users = await User.find(filters)
            .select('-password')
            .limit(50);

        return res.status(200).json({
            data: users,
            count: users.length,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId)
            .populate('teams')
            .populate('connections');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

// Update user profile
export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, bio, role, location, experience, skills } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (bio) updateData.bio = bio;
        if (role) updateData.role = role;
        if (location) updateData.location = location;
        if (experience) updateData.experience = experience;
        if (skills) updateData.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());

        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: 'User updated successfully',
            user,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// Add connection
export const addConnection = async (req, res) => {
    try {
        const { userId } = req.params;
        const { targetUserId } = req.body;

        if (userId === targetUserId) {
            return res.status(400).json({ message: 'Cannot connect with yourself' });
        }

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!user || !targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already connected
        if (user.connections.includes(targetUserId)) {
            return res.status(400).json({ message: 'Already connected' });
        }

        user.connections.push(targetUserId);
        await user.save();

        return res.status(200).json({
            message: 'Connection added successfully',
            user,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error adding connection', error: error.message });
    }
};

// Remove connection
export const removeConnection = async (req, res) => {
    try {
        const { userId, targetUserId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.connections = user.connections.filter(id => id.toString() !== targetUserId);
        await user.save();

        return res.status(200).json({
            message: 'Connection removed successfully',
            user,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error removing connection', error: error.message });
    }
};

// Get user connections
export const getConnections = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate('connections');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            connections: user.connections,
            count: user.connections.length,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching connections', error: error.message });
    }
};

// Increment profile views
export const incrementProfileViews = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByIdAndUpdate(
            userId,
            { $inc: { profileViews: 1 } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: 'Profile views updated',
            profileViews: user.profileViews,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating profile views', error: error.message });
    }
};
