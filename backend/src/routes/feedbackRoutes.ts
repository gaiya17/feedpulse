import { Router } from 'express';
import { createFeedback } from '../controllers/feedbackController.js';

const router = Router();

// This matches POST /api/feedback 
router.post('/', createFeedback);

export default router;