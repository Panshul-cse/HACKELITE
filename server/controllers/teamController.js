import Team from '../models/Team.js';
import User from '../models/User.js';

// Get all teams for current user
export const getMyTeams = async (req, res) => {
    try {
        const userId = req.user.userId;

        const teams = await Team.findByUser(userId);

        return res.status(200).json(teams);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching teams', error: error.message });
    }
};

// Get team by ID
export const getTeam = async (req, res) => {
    try {
        const { teamId } = req.params;

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        const [members, invitations] = await Promise.all([
            team.getMembers(),
            team.getInvitations()
        ]);

        const teamWithRelations = {
            ...team,
            members,
            invitations
        };

        return res.status(200).json(teamWithRelations);
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
            required_skills: requiredSkills ? requiredSkills.split(',').map(s => s.trim()) : [],
            target_size: targetSize || 5,
            created_by: userId
        });

        await team.save();
        await team.addMember(userId);

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

        if (team.created_by !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (role) updateData.role = role;
        if (requiredSkills) updateData.required_skills = requiredSkills.split(',').map(s => s.trim());
        if (targetSize) updateData.target_size = targetSize;
        if (status) updateData.status = status;

        await team.update(updateData);

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

        if (team.created_by !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await team.delete();

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

        if (team.created_by !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const members = await team.getMembers();
        if (members.some(member => member.id === newMemberId)) {
            return res.status(400).json({ message: 'User already in team' });
        }

        await team.addMember(newMemberId);

        return res.status(200).json({
            message: 'Team member added successfully'
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

        if (team.created_by !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await team.removeMember(memberToRemove);

        return res.status(200).json({
            message: 'Team member removed successfully'
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error removing team member', error: error.message });
    }
};

// Get team members
export const getTeamMembers = async (req, res) => {
    try {
        const { teamId } = req.params;

        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        const members = await team.getMembers();

        return res.status(200).json({
            members,
            count: members.length
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

        if (team.created_by !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Check if already invited or is member
        const members = await team.getMembers();
        const invitations = await team.getInvitations();
        const alreadyInvited = invitations.some(inv => inv.user_id === inviteeId);
        const isMember = members.some(member => member.id === inviteeId);

        if (alreadyInvited || isMember) {
            return res.status(400).json({ message: 'User already invited or is a member' });
        }

        await team.sendInvitation(inviteeId);

        return res.status(200).json({
            message: 'Invitation sent successfully'
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error sending invitation', error: error.message });
    }
};
