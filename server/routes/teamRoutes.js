import express from 'express';
import {
    getMyTeams,
    getTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    addTeamMember,
    removeTeamMember,
    getTeamMembers,
    sendInvitation
} from '../controllers/teamController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.get('/', authMiddleware, getMyTeams);
router.post('/', authMiddleware, createTeam);
router.get('/:teamId', authMiddleware, getTeam);
router.put('/:teamId', authMiddleware, updateTeam);
router.delete('/:teamId', authMiddleware, deleteTeam);

// Team members routes
router.get('/:teamId/members', authMiddleware, getTeamMembers);
router.post('/:teamId/members', authMiddleware, addTeamMember);
router.delete('/:teamId/members/:userId', authMiddleware, removeTeamMember);

// Invitation routes
router.post('/:teamId/invitations', authMiddleware, sendInvitation);

export default router;
