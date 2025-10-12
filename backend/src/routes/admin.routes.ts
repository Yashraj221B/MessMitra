import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const adminController = new AdminController();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

// Platform statistics
router.get('/stats', adminController.getPlatformStats);

// Utility endpoints
router.post('/sync-member-counts', adminController.syncMemberCounts);

// Mess management
router.get('/messes', adminController.getAllMesses);
router.post('/messes', adminController.createMess);
router.post('/messes/:messId/approve', adminController.approveMess);
router.post('/messes/:messId/suspend', adminController.suspendMess);
router.post('/messes/:messId/activate', adminController.activateMess);

// User management
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.get('/managers', adminController.getManagers);
router.get('/users/:userId', adminController.getUserById);
router.post('/users/:userId/suspend', adminController.suspendUser);
router.post('/users/:userId/activate', adminController.activateUser);
router.post('/users/:userId/enroll', adminController.enrollUserInMess);
router.post('/users/:userId/remove-from-mess', adminController.removeUserFromMess);
router.delete('/users/:userId', adminController.deleteUser);
router.patch('/users/:userId/role', adminController.changeUserRole);
router.patch('/users/:userId', adminController.updateUser);

export default router;
