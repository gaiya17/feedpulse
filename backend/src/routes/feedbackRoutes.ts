import { Router } from 'express';
import { createFeedback, deleteFeedback, getAllFeedback, getFeedbackById, updateFeedbackStatus, getAISummary } from '../controllers/feedbackController.js';
import { protect } from '../middleware/authMiddleware.js'; // Import our new gatekeeper

const router = Router();

// PUBLIC: Anyone can submit
router.post('/', createFeedback);

// PROTECTED: Only the admin with a valid token can see or update
router.get('/summary', protect, getAISummary);
router.get('/', protect, getAllFeedback);
router.patch('/:id', protect, updateFeedbackStatus);
router.get('/:id', protect, getFeedbackById);
router.delete('/:id', protect, deleteFeedback);

export default router;
