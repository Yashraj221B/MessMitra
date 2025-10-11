import prisma from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { CreateNotificationDTO, NotificationResponse } from '../types/notification.types';

export class NotificationService {

  async createNotification(data: CreateNotificationDTO): Promise<NotificationResponse> {
    const user = await prisma.users.findUnique({
      where: { id: data.userId }
    });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const notification = await prisma.notifications.create({
      data: {
        user_id: data.userId,
        mess_id: data.messId || null,
        type: data.type as any,
        title: data.title,
        message: data.message,
        metadata: null
      }
    });

    return {
      id: notification.id,
      userId: notification.user_id,
      messId: notification.mess_id || undefined,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      actionUrl: undefined,
      isRead: notification.is_read || false,
      createdAt: notification.created_at || new Date()
    };
  }

  async getUserNotifications(userId: string, unreadOnly: boolean = false): Promise<NotificationResponse[]> {
    const whereConditions: any = { user_id: userId };
    if (unreadOnly) {
      whereConditions.is_read = false;
    }

    const notifications = await prisma.notifications.findMany({
      where: whereConditions,
      orderBy: { created_at: 'desc' },
      take: 50 // Limit to 50 most recent
    });

    return notifications.map(notification => ({
      id: notification.id,
      userId: notification.user_id,
      messId: notification.mess_id || undefined,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      actionUrl: undefined,
      isRead: notification.is_read || false,
      createdAt: notification.created_at || new Date()
    }));
  }

  async markAsRead(notificationId: string, userId: string): Promise<NotificationResponse> {
    const notification = await prisma.notifications.findFirst({
      where: { id: notificationId, user_id: userId }
    });

    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    const updatedNotification = await prisma.notifications.update({
      where: { id: notificationId },
      data: {
        is_read: true,
        read_at: new Date()
      }
    });

    return {
      id: updatedNotification.id,
      userId: updatedNotification.user_id,
      messId: updatedNotification.mess_id || undefined,
      type: updatedNotification.type,
      title: updatedNotification.title,
      message: updatedNotification.message,
      actionUrl: undefined,
      isRead: updatedNotification.is_read || false,
      createdAt: updatedNotification.created_at || new Date()
    };
  }

  async markAllAsRead(userId: string): Promise<void> {
    await prisma.notifications.updateMany({
      where: { user_id: userId, is_read: false },
      data: {
        is_read: true,
        read_at: new Date()
      }
    });
  }

  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const notification = await prisma.notifications.findFirst({
      where: { id: notificationId, user_id: userId }
    });

    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    await prisma.notifications.delete({
      where: { id: notificationId }
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await prisma.notifications.count({
      where: { user_id: userId, is_read: false }
    });
  }
}
