import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';
import { successResponse } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';
import { CreateNotificationDTO } from '../types/notification.types';

const notificationService = new NotificationService();

export const createNotification = asyncHandler(async (req: Request, res: Response) => {
  const data: CreateNotificationDTO = req.body;

  const notification = await notificationService.createNotification(data);
  res.status(201).json(successResponse('Notification created successfully', notification));
});

export const getUserNotifications = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user!;
  const { unreadOnly } = req.query;

  const notifications = await notificationService.getUserNotifications(
    userId,
    unreadOnly === 'true'
  );
  res.json(successResponse('Notifications retrieved successfully', notifications));
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { notificationId } = req.params;
  const { userId } = req.user!;

  const notification = await notificationService.markAsRead(notificationId, userId);
  res.json(successResponse('Notification marked as read', notification));
});

export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user!;

  await notificationService.markAllAsRead(userId);
  res.json(successResponse('All notifications marked as read', null));
});

export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  const { notificationId } = req.params;
  const { userId } = req.user!;

  await notificationService.deleteNotification(notificationId, userId);
  res.json(successResponse('Notification deleted successfully', null));
});

export const getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user!;

  const count = await notificationService.getUnreadCount(userId);
  res.json(successResponse('Unread count retrieved successfully', { count }));
});
