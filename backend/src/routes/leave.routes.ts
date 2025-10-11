import { Router } from 'express';
import {
  createLeave,
  getLeaveById,
  getMessLeaves,
  getMemberLeaves,
  getMyLeaves,
  updateLeaveStatus,
  cancelLeave,
  getLeaveStats
} from '../controllers/leave.controller';
import { authenticate, authorize, requireMessOwnership } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create leave request (members only)
router.post(
  '/',
  authorize('member'),
  validateBody(['startDate', 'endDate', 'reason']),
  createLeave
);

// Get my leaves (member can see their own)
router.get('/my-leaves', getMyLeaves);

// Get leave by ID (all authenticated users)
router.get('/:leaveId', getLeaveById);

// Get all leaves for a mess (manager/admin - admin can access any mess)
router.get(
  '/mess/:messId',
  authorize('manager', 'admin'),
  getMessLeaves
);

// Get leaves statistics (manager/admin - admin can access any mess)
router.get(
  '/mess/:messId/stats',
  authorize('manager', 'admin'),
  getLeaveStats
);

// Get member leaves (manager can see all, member can see their own)
router.get('/member/:memberId', getMemberLeaves);

// Update leave status (approve/reject) - manager/admin only
router.put(
  '/:leaveId/status',
  authorize('manager', 'admin'),
  validateBody(['status']),
  updateLeaveStatus
);

// Cancel leave (member can cancel their own)
router.put('/:leaveId/cancel', cancelLeave);

export default router;
