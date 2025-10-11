import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import messRoutes from './mess.routes';
import menuRoutes from './menu.routes';
import attendanceRoutes from './attendance.routes';
import leaveRoutes from './leave.routes';
import paymentRoutes from './payment.routes';
import announcementRoutes from './announcement.routes';
import feedbackRoutes from './feedback.routes';
import notificationRoutes from './notification.routes';
import adminRoutes from './admin.routes';

const router = Router();

// Mount all routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/messes', messRoutes);
router.use('/menus', menuRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/leaves', leaveRoutes);
router.use('/payments', paymentRoutes);
router.use('/announcements', announcementRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
