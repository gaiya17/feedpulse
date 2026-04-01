import { Router } from 'express';
import { 
  createFeedback, 
  getAllFeedback, 
  updateFeedbackStatus 
} from '../controllers/feedbackController.js';

const router = Router();

// POST /api/feedback - Create (Done!)
router.post('/', createFeedback);

// GET /api/feedback - Read All
router.get('/', getAllFeedback);

// PATCH /api/feedback/:id - Update Status
router.patch('/:id', updateFeedbackStatus);

export default router;