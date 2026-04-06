import express from 'express';
import {
    getMatches,
    sendMatchRequest,
    getMatchRequests,
    respondToRequest,
    getMutualMatches
} from '../controllers/matchController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.get('/', authMiddleware, getMatches);
router.get('/mutual', authMiddleware, getMutualMatches);
router.post('/send', authMiddleware, sendMatchRequest);
router.get('/requests', authMiddleware, getMatchRequests);
router.post('/:requestId/respond', authMiddleware, respondToRequest);

export default router;
