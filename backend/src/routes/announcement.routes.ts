import { Router } from 'express';
import {
  createAnnouncement,
  getAnnouncementById,
  getMessAnnouncements,
  updateAnnouncement,
  deleteAnnouncement
} from '../controllers/announcement.controller';
import { authenticate, authorize, requireMessOwnership } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create announcement (manager/admin - admin can access any mess)
router.post(
  '/:messId',
  authorize('manager', 'admin'),
  validateBody(['title', 'message']),
  createAnnouncement
);

// Get announcement by ID (all authenticated users)
router.get('/:announcementId', getAnnouncementById);

// Get all announcements for a mess (all authenticated users in the mess)
router.get('/mess/:messId', getMessAnnouncements);

// Update announcement (manager/admin only)
router.put(
  '/:announcementId',
  authorize('manager', 'admin'),
  updateAnnouncement
);

// Delete announcement (manager/admin only)
router.delete(
  '/:announcementId',
  authorize('manager', 'admin'),
  deleteAnnouncement
);

export default router;
