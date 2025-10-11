import { Router } from 'express';
import { MessController } from '../controllers/mess.controller';
import { authenticate, authorize, requireMessOwnership, requireMessMembership } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';

const router = Router();
const messController = new MessController();

// All routes require authentication
router.use(authenticate);

// Create mess (manager only)
router.post(
  '/',
  authorize('manager'),
  validateBody(['name', 'address', 'monthlyFee']),
  messController.createMess
);

// Get all messes
router.get('/', messController.getAllMesses);

// Get mess by ID
router.get('/:messId', messController.getMessById);

// Update mess (owner or admin)
router.put(
  '/:messId',
  authorize('manager', 'admin'),
  requireMessOwnership,
  messController.updateMess
);

// Delete mess (owner or admin)
router.delete(
  '/:messId',
  authorize('manager', 'admin'),
  requireMessOwnership,
  messController.deleteMess
);

// Regenerate QR code (owner or admin)
router.post(
  '/:messId/qr-code',
  authorize('manager', 'admin'),
  requireMessOwnership,
  messController.regenerateQRCode
);

// Join mess (member only)
router.post(
  '/join',
  authorize('member'),
  messController.joinMess
);

// Get mess members (owner or admin)
router.get(
  '/:messId/members',
  authorize('manager', 'admin'),
  requireMessOwnership,
  messController.getMessMembers
);

// Approve/reject join request (owner or admin)
router.put(
  '/:messId/members/:memberId/status',
  authorize('manager', 'admin'),
  requireMessOwnership,
  validateBody(['status']),
  messController.updateJoinRequest
);

export default router;
