import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const userController = new UserController();

// All routes require authentication
router.use(authenticate);

// Get current user profile
router.get('/profile', userController.getProfile);

// Update current user profile
router.put('/profile', userController.updateProfile);

// Change password
router.put('/password', userController.changePassword);

// Get all users (admin only)
router.get('/', authorize('admin'), userController.getAllUsers);

export default router;
