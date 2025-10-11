import { Router } from 'express';
import { MessController } from '../controllers/mess.controller';
import { authenticate, authorize, requireMessOwnership, requireMessMembership } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';

const router = Router();
const messController = new MessController();

// All routes require authentication
router.use(authenticate);

// Create mess (manager or admin)
router.post(
  '/',
  authorize('manager', 'admin'),
  validateBody(['name', 'address', 'monthlyFee']),
  messController.createMess
);

// Get all messes
router.get('/', messController.getAllMesses);

// Get mess by ID
router.get('/:messId', messController.getMessById);

// Update mess (manager or admin - admin can access any mess)
router.put(
  '/:messId',
  authorize('manager', 'admin'),
  messController.updateMess
);

// Delete mess (manager or admin - admin can access any mess)
router.delete(
  '/:messId',
  authorize('manager', 'admin'),
  messController.deleteMess
);

// Regenerate QR code (manager or admin - admin can access any mess)
router.post(
  '/:messId/qr-code',
  authorize('manager', 'admin'),
  messController.regenerateQRCode
);

// Join mess (member only)
router.post(
  '/join',
  authorize('member'),
  messController.joinMess
);

// Get mess members (manager or admin - admin can access any mess)
router.get(
  '/:messId/members',
  authorize('manager', 'admin'),
  messController.getMessMembers
);

// Approve/reject join request (manager or admin - admin can access any mess)
router.put(
  '/:messId/members/:memberId/status',
  authorize('manager', 'admin'),
  validateBody(['status']),
  messController.updateJoinRequest
);

export default router;
