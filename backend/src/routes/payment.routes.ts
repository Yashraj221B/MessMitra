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

// Get all payments for a mess (manager/admin - admin can access any mess)
router.get(
  '/mess/:messId',
  authorize('manager', 'admin'),
  getMessPayments
);

// Get overdue payments (manager/admin - admin can access any mess)
router.get(
  '/mess/:messId/overdue',
  authorize('manager', 'admin'),
  getOverduePayments
);

// Get payment statistics (manager/admin - admin can access any mess)
router.get(
  '/mess/:messId/stats',
  authorize('manager', 'admin'),
  getPaymentStats
);

// Get member payments (member can see their own)
router.get(
  '/member/:memberId',
  authorize('manager', 'admin', 'member'),
  getMemberPayments
);

router.get(
  '/:paymentId',
  authorize('manager', 'admin', 'member'),
  getPaymentById
);

export default router;
