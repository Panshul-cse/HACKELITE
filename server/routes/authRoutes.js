import express from 'express';
import { signup, login, getCurrentUser, logout } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);

export default router;
