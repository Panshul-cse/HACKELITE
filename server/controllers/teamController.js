import Team from '../models/Team.js';
import User from '../models/User.js';

// Get all teams for current user
export const getMyTeams = async (req, res) => {
    try {
        const userId = req.user.userId;

        const teams = await Team.find({
            $or: [
                { createdBy: userId },
                { members: userId }
            ]
        })
        .populate('createdBy', '-password')
        .populate('members', '-password')
        .sort({ createdAt: -1 });

        return res.status(200).json(teams);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching teams', error: error.message });
    }
};

// Get team by ID
export const getTeam = async (req, res) => {
    try {
        const { teamId } = req.params;

        const team = await Team.findById(teamId)
            .populate('createdBy', '-password')
            .populate('members', '-password')
            .populate('invitations.user', '-password');

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        return res.status(200).json(team);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching team', error: error.message });
    }
};

// Create new team
export const createTeam = async (req, res) => {
    try {
        const { name, description, role, requiredSkills, targetSize } = req.body;
        const userId = req.user.userId;

        if (!name || !role) {
            return res.status(400).json({ message: 'Team name and role are required' });
        }

        const team = new Team({
            name,
            description,
            role,
            requiredSkills: requiredSkills ? requiredSkills.split(',').map(s => s.trim()) : [],
            targetSize: targetSize || 5,
            createdBy: userId,
            members: [userId]
        });

        await team.save();
        await team.populate('createdBy', '-password');
        await team.populate('members', '-password');

        // Add team to user's teams
        await User.findByIdAndUpdate(userId, {
            $push: { teams: team._id }
        });

        return res.status(201).json({
            message: 'Team created successfully',
            team
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating team', error: error.message });
    }
};

// Update team
export const updateTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { name, description, role, requiredSkills, targetSize, status } = req.body;
        const userId = req.user.userId;

        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        if (team.createdBy.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (name) team.name = name;
        if (description) team.description = description;
        if (role) team.role = role;
        if (requiredSkills) team.requiredSkills = requiredSkills.split(',').map(s => s.trim());
        if (targetSize) team.targetSize = targetSize;
        if (status) team.status = status;

        await team.save();
        await team.populate('createdBy', '-password');
        await team.populate('members', '-password');

        return res.status(200).json({
            message: 'Team updated successfully',
            team
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating team', error: error.message });
    }
};

// Delete team
export const deleteTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const userId = req.user.userId;

        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        if (team.createdBy.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Remove team from all members' teams array
        await User.updateMany(
            { _id: { $in: team.members } },
            { $pull: { teams: teamId } }
        );

        await Team.findByIdAndDelete(teamId);

        return res.status(200).json({ message: 'Team deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting team', error: error.message });
    }
};

// Add team member
export const addTeamMember = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { userId: newMemberId } = req.body;
        const userId = req.user.userId;

        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        if (team.createdBy.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (team.members.includes(newMemberId)) {
            return res.status(400).json({ message: 'User already in team' });
        }

        team.members.push(newMemberId);
        await team.save();
        await team.populate('members', '-password');

        // Add team to user's teams
        await User.findByIdAndUpdate(newMemberId, {
            $push: { teams: teamId }
        });

        return res.status(200).json({
            message: 'Team member added successfully',
            team
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error adding team member', error: error.message });
    }
};

// Remove team member
export const removeTeamMember = async (req, res) => {
    try {
        const { teamId, userId: memberToRemove } = req.params;
        const userId = req.user.userId;

        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        if (team.createdBy.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        team.members = team.members.filter(id => id.toString() !== memberToRemove);
        await team.save();
        await team.populate('members', '-password');

        // Remove team from user's teams
        await User.findByIdAndUpdate(memberToRemove, {
            $pull: { teams: teamId }
        });

        return res.status(200).json({
            message: 'Team member removed successfully',
            team
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error removing team member', error: error.message });
    }
};

// Get team members
export const getTeamMembers = async (req, res) => {
    try {
        const { teamId } = req.params;

        const team = await Team.findById(teamId)
            .populate('members', '-password');

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        return res.status(200).json({
            members: team.members,
            count: team.members.length
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching team members', error: error.message });
    }
};

// Send team invitation
export const sendInvitation = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { userId: inviteeId } = req.body;
        const userId = req.user.userId;

        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        if (team.createdBy.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Check if already invited or is member
        const alreadyInvited = team.invitations.some(inv => inv.user.toString() === inviteeId);
        if (alreadyInvited || team.members.includes(inviteeId)) {
            return res.status(400).json({ message: 'User already invited or is a member' });
        }

        team.invitations.push({ user: inviteeId });
        await team.save();

        return res.status(200).json({
            message: 'Invitation sent successfully',
            team
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error sending invitation', error: error.message });
    }
};
