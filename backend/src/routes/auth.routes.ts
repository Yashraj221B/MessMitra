import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRegister, validateLogin, validateRefreshToken } from '../middleware/validation.middleware';
// import { registerLimiter, authLimiter } from '../middleware/rateLimit.middleware';

const router = Router();
const authController = new AuthController();

// Public routes with rate limiting and validation
router.post(
  '/register',
  // registerLimiter,
  validateRegister,
  authController.register
);

router.post(
  '/login',
  // authLimiter,
  validateLogin,
  authController.login
);

router.post(
  '/refresh',
  // authLimiter,
  validateRefreshToken,
  authController.refreshToken
);

// Protected routes
router.post('/logout', authenticate, authController.logout);

export default router;
