import User from '../models/User.js';

// Get all users with filters
export const getAllUsers = async (req, res) => {
    try {
        const { skills, experience, location } = req.query;

        let users = await User.find();

        // Apply filters
        if (skills) {
            const skillArray = skills.split(',').map(s => s.trim());
            users = users.filter(user => 
                user.skills.some(skill => skillArray.includes(skill))
            );
        }

        if (experience) {
            users = users.filter(user => user.experience === experience);
        }

        if (location) {
            const locationRegex = new RegExp(location, 'i');
            users = users.filter(user => locationRegex.test(user.location));
        }

        // Limit results
        users = users.slice(0, 50);

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

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get connections and teams
        const [connections, teams] = await Promise.all([
            user.getConnections(),
            user.getTeams()
        ]);

        const userWithRelations = {
            ...user,
            connections,
            teams
        };

        return res.status(200).json(userWithRelations);
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

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.update(updateData);

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
        const connections = await user.getConnections();
        if (connections.some(conn => conn.id === targetUserId)) {
            return res.status(400).json({ message: 'Already connected' });
        }

        await user.addConnection(targetUserId);

        return res.status(200).json({
            message: 'Connection added successfully',
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

        await user.removeConnection(targetUserId);

        return res.status(200).json({
            message: 'Connection removed successfully',
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error removing connection', error: error.message });
    }
};

// Get user connections
export const getConnections = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const connections = await user.getConnections();

        return res.status(200).json({
            connections,
            count: connections.length,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching connections', error: error.message });
    }
};

// Increment profile views
export const incrementProfileViews = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const profileViews = await user.incrementProfileViews();

        return res.status(200).json({
            message: 'Profile views updated',
            profileViews,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating profile views', error: error.message });
    }
};
