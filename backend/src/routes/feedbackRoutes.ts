import { Router } from 'express';
import { 
  createFeedback, 
  getAllFeedback, 
  updateFeedbackStatus, 
  getAISummary, 
  reanalyzeFeedback
} from '../controllers/feedbackController.js';
import { protect } from '../middleware/authMiddleware.js';
import { feedbackRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Requirement 1.1: PUBLIC - Anyone can submit
router.post('/', createFeedback); 
router.post('/', feedbackRateLimiter, createFeedback);

// Requirement 4.3: PROTECTED - Only Admin can see/edit
router.get('/', protect, getAllFeedback);
router.get('/summary', protect, getAISummary);
router.patch('/:id', protect, updateFeedbackStatus);
router.post('/:id/analyze', protect, reanalyzeFeedback);

export default router;