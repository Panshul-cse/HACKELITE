import express from 'express';
import {
    getAllUsers,
    getUserById,
    updateUser,
    addConnection,
    removeConnection,
    getConnections,
    incrementProfileViews
} from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.get('/', authMiddleware, getAllUsers);
router.get('/:userId', authMiddleware, getUserById);
router.put('/:userId', authMiddleware, updateUser);

// Connection routes
router.post('/:userId/connections', authMiddleware, addConnection);
router.delete('/:userId/connections/:targetUserId', authMiddleware, removeConnection);
router.get('/:userId/connections', authMiddleware, getConnections);

// Profile views
router.post('/:userId/views', authMiddleware, incrementProfileViews);

export default router;
