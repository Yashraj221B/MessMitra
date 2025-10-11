import { Router } from 'express';
import {
  createMenu,
  getMenuById,
  getMenuByDate,
  getWeeklyMenu,
  getMonthlyMenu,
  updateMenu,
  deleteMenu
} from '../controllers/menu.controller';
import { authenticate, authorize, requireMessOwnership } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create menu for a mess (manager/admin - admin can access any mess)
router.post(
  '/:messId',
  authorize('manager', 'admin'),
  validateBody(['date', 'meals']),
  createMenu
);

// Get menu by ID (all authenticated users)
router.get('/:menuId', getMenuById);

// Get menu by date (all authenticated users)
router.get('/:messId/date', getMenuByDate);

// Get weekly menu (all authenticated users)
router.get('/:messId/weekly', getWeeklyMenu);

// Get monthly menu (all authenticated users)
router.get('/:messId/monthly', getMonthlyMenu);

// Update menu (manager/admin only)
router.put(
  '/:menuId',
  authorize('manager', 'admin'),
  updateMenu
);

// Delete menu (manager/admin only)
router.delete(
  '/:menuId',
  authorize('manager', 'admin'),
  deleteMenu
);

export default router;
