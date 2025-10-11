import { Router } from 'express';
import {
  markAttendance,
  getAttendanceById,
  getAttendanceReport,
  getMemberAttendance,
  getAttendanceStats
} from '../controllers/attendance.controller';
import { authenticate, authorize, requireMessOwnership } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Mark attendance (manager/admin or member marking their own)
router.post(
  '/',
  validateBody(['messId', 'memberId', 'date', 'mealType', 'scanMethod']),
  markAttendance
);

// Get attendance by ID (all authenticated users)
router.get('/:attendanceId', getAttendanceById);

// Get attendance report for a mess (manager/admin - admin can access any mess)
router.get(
  '/mess/:messId/report',
  authorize('manager', 'admin'),
  getAttendanceReport
);

// Get member attendance (member can see their own, manager/admin can see all)
router.get(
  '/mess/:messId/member/:memberId',
  getMemberAttendance
);

// Get attendance statistics (manager/admin - admin can access any mess)
router.get(
  '/mess/:messId/stats',
  authorize('manager', 'admin'),
  getAttendanceStats
);

export default router;
