import User from '../models/User.js';
import Message from '../models/Message.js';

// Model for match requests - using Message model with special type
export const getMatches = async (req, res) => {
    try {
        const { skills, experience, location } = req.query;
        const userId = req.user.userId;

        const filters = { 
            isActive: true,
            _id: { $ne: userId }
        };

        if (skills) {
            filters.skills = { $in: skills.split(',').map(s => s.trim()) };
        }

        if (experience) {
            filters.experience = experience;
        }

        if (location) {
            filters.location = { $regex: location, $options: 'i' };
        }

        const matches = await User.find(filters)
            .select('-password')
            .limit(50);

        return res.status(200).json({
            data: matches,
            count: matches.length,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching matches', error: error.message });
    }
};

// Send match request (using Message model)
export const sendMatchRequest = async (req, res) => {
    try {
        const { targetUserId } = req.body;
        const userId = req.user.userId;

        if (userId === targetUserId) {
            return res.status(400).json({ message: 'Cannot send request to yourself' });
        }

        // Check if users exist
        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!user || !targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check for existing request
        const existingRequest = await Message.findOne({
            senderId: userId,
            recipientId: targetUserId,
            messageType: 'system',
            content: 'match-request'
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Request already sent' });
        }

        // Create match request message
        const matchRequest = new Message({
            senderId: userId,
            recipientId: targetUserId,
            content: 'match-request',
            messageType: 'system',
        });

        await matchRequest.save();

        return res.status(201).json({
            message: 'Match request sent successfully',
            request: matchRequest,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error sending match request', error: error.message });
    }
};

// Get match requests
export const getMatchRequests = async (req, res) => {
    try {
        const userId = req.user.userId;

        const requests = await Message.find({
            recipientId: userId,
            messageType: 'system',
            content: 'match-request'
        })
        .populate('senderId', '-password')
        .sort({ createdAt: -1 });

        return res.status(200).json({
            data: requests,
            count: requests.length,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching match requests', error: error.message });
    }
};

// Respond to match request
export const respondToRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body; // 'accepted' or 'rejected'
        const userId = req.user.userId;

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const request = await Message.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.recipientId.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (status === 'accepted') {
            // Add both users to each other's connections
            const [user, requester] = await Promise.all([
                User.findById(userId),
                User.findById(request.senderId)
            ]);

            if (user && requester) {
                if (!user.connections.includes(request.senderId)) {
                    user.connections.push(request.senderId);
                }
                if (!requester.connections.includes(userId)) {
                    requester.connections.push(userId);
                }

                await Promise.all([user.save(), requester.save()]);
            }
        }

        // Mark request as read/handled
        request.isRead = true;
        request.readAt = new Date();
        await request.save();

        return res.status(200).json({
            message: `Request ${status} successfully`,
            request,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error responding to request', error: error.message });
    }
};

// Get mutual matches (users with common skills)
export const getMutualMatches = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const mutualMatches = await User.find({
            _id: { $ne: userId },
            isActive: true,
            skills: { $in: user.skills }
        })
        .select('-password')
        .limit(50);

        return res.status(200).json({
            data: mutualMatches,
            count: mutualMatches.length,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching mutual matches', error: error.message });
    }
};
