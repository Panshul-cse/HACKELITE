import User from '../models/User.js';
import Message from '../models/Message.js';

// Get potential matches
export const getMatches = async (req, res) => {
    try {
        const { skills, experience, location } = req.query;
        const userId = req.user.userId;

        let matches = await User.find();

        // Exclude current user
        matches = matches.filter(user => user.id !== userId);

        // Apply filters
        if (skills) {
            const skillArray = skills.split(',').map(s => s.trim());
            matches = matches.filter(user => 
                user.skills.some(skill => skillArray.includes(skill))
            );
        }

        if (experience) {
            matches = matches.filter(user => user.experience === experience);
        }

        if (location) {
            const locationRegex = new RegExp(location, 'i');
            matches = matches.filter(user => locationRegex.test(user.location));
        }

        // Limit results
        matches = matches.slice(0, 50);

        return res.status(200).json({
            data: matches,
            count: matches.length,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching matches', error: error.message });
    }
};

// Send match request
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

        // Check for existing request - for simplicity, assume no duplicate check for now
        // In production, you might want to add a table for match requests

        // Create match request message
        const matchRequest = new Message({
            sender_id: userId,
            recipient_id: targetUserId,
            content: 'match-request',
            message_type: 'system',
        });

        await matchRequest.save();

        return res.status(201).json({
            message: 'Match request sent successfully',
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error sending match request', error: error.message });
    }
};

// Get match requests
export const getMatchRequests = async (req, res) => {
    try {
        const userId = req.user.userId;

        // For simplicity, get messages where recipient is user and type is system
        // In a real app, you might want a separate table for match requests
        const requests = await Message.findBetweenUsers(userId, userId, 100); // This might not work, need to adjust

        // Filter for system messages that are match requests
        const matchRequests = requests.filter(msg => 
            msg.message_type === 'system' && 
            msg.content === 'match-request' && 
            msg.recipient_id === userId
        );

        return res.status(200).json({
            data: matchRequests,
            count: matchRequests.length,
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

        // For simplicity, assume requestId is the message id
        // In a real app, you'd have a proper match_requests table
        const request = await Message.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.recipient_id !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (status === 'accepted') {
            // Add connection
            const user = await User.findById(userId);
            await user.addConnection(request.sender_id);
        }

        // Mark as read
        await request.markAsRead();

        return res.status(200).json({
            message: `Request ${status} successfully`,
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

        let mutualMatches = await User.find();

        // Filter for users with common skills
        mutualMatches = mutualMatches.filter(match => 
            match.id !== userId && 
            match.skills.some(skill => user.skills.includes(skill))
        );

        // Limit results
        mutualMatches = mutualMatches.slice(0, 50);

        return res.status(200).json({
            data: mutualMatches,
            count: mutualMatches.length,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching mutual matches', error: error.message });
    }
};
