import { Router } from 'express';
import {
  createPayment,
  recordPayment,
  getPaymentById,
  getMessPayments,
  getMemberPayments,
  getOverduePayments,
  getPaymentStats
} from '../controllers/payment.controller';
import { authenticate, authorize, requireMessOwnership } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create payment (manager/admin only)
router.post(
  '/',
  authorize('manager', 'admin'),
  validateBody(['messId', 'memberId', 'month', 'year', 'amount']),
  createPayment
);

// Record payment (manager/admin only)
router.put(
  '/:paymentId/record',
  authorize('manager', 'admin'),
  validateBody(['paidAmount', 'paymentMethod']),
  recordPayment
);

// Get payment by ID (all authenticated users)
router.get('/:paymentId', getPaymentById);

// Get all payments for a mess (manager/admin only)
router.get(
  '/mess/:messId',
  authorize('manager', 'admin'),
  requireMessOwnership,
  getMessPayments
);

// Get overdue payments (manager/admin only)
router.get(
  '/mess/:messId/overdue',
  authorize('manager', 'admin'),
  requireMessOwnership,
  getOverduePayments
);

// Get payment statistics (manager/admin only)
router.get(
  '/mess/:messId/stats',
  authorize('manager', 'admin'),
  requireMessOwnership,
  getPaymentStats
);

// Get member payments (member can see their own)
router.get('/member/:memberId', getMemberPayments);

export default router;
