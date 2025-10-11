import { Router } from 'express';
import {
  createFeedback,
  getFeedbackById,
  getMessFeedback,
  getFeedbackStats
} from '../controllers/feedback.controller';
import { authenticate, authorize, requireMessOwnership } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create feedback (members only)
router.post(
  '/',
  authorize('member'),
  validateBody(['rating']),
  createFeedback
);

// Get feedback by ID (manager/admin only)
router.get(
  '/:feedbackId',
  authorize('manager', 'admin'),
  getFeedbackById
);

// Get all feedback for a mess (manager/admin only)
router.get(
  '/mess/:messId',
  authorize('manager', 'admin'),
  requireMessOwnership,
  getMessFeedback
);

// Get feedback statistics (manager/admin only)
router.get(
  '/mess/:messId/stats',
  authorize('manager', 'admin'),
  requireMessOwnership,
  getFeedbackStats
);

export default router;
