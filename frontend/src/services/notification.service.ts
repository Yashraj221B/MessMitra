// Notification Service - Uses announcements as notifications
import { announcementService, type Announcement } from './announcement.service';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'announcement' | 'menu-change' | 'payment' | 'general';
  timestamp: string;
  read: boolean;
  priority?: 'low' | 'medium' | 'high';
}

class NotificationService {
  private STORAGE_KEY = 'messmitra-notifications-read';

  /**
   * Get read notification IDs from localStorage
   */
  private getReadNotificationIds(): Set<string> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch (error) {
      console.error('Error loading read notifications:', error);
      return new Set();
    }
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): void {
    const readIds = this.getReadNotificationIds();
    readIds.add(notificationId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify([...readIds]));
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(notificationIds: string[]): void {
    const readIds = this.getReadNotificationIds();
    notificationIds.forEach(id => readIds.add(id));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify([...readIds]));
  }

  /**
   * Convert announcement to notification
   */
  private announcementToNotification(announcement: Announcement): Notification {
    const readIds = this.getReadNotificationIds();
    
    return {
      id: announcement.id,
      title: announcement.title,
      message: announcement.message,
      type: 'announcement',
      timestamp: announcement.createdAt,
      read: readIds.has(announcement.id),
      priority: announcement.priority
    };
  }

  /**
   * Get all notifications for a mess (from announcements)
   */
  async getNotifications(messId: string): Promise<Notification[]> {
    try {
      const announcements = await announcementService.getMessAnnouncements(messId);
      return announcements.map(a => this.announcementToNotification(a));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  /**
   * Get unread count
   */
  async getUnreadCount(messId: string): Promise<number> {
    const notifications = await this.getNotifications(messId);
    return notifications.filter(n => !n.read).length;
  }
}

export const notificationService = new NotificationService();
