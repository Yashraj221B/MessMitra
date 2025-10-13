// Types for notifications
export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'announcement' | 'menu-change' | 'payment' | 'reminder';
  read: boolean;
}

// Function to add a new notification
export const addNotification = (notification: Omit<Notification, 'id' | 'read'>) => {
  const notifications = getNotifications();
  const newNotification = {
    ...notification,
    id: Date.now().toString(),
    read: false
  };
  
  notifications.unshift(newNotification);
  localStorage.setItem('messmitra-notifications', JSON.stringify(notifications));
  
  return newNotification;
};

// Function to get all notifications
export const getNotifications = (): Notification[] => {
  try {
    const stored = localStorage.getItem('messmitra-notifications');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading notifications:', error);
  }
  return [];
};

// Function to mark a notification as read
export const markNotificationAsRead = (id: string) => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notification =>
    notification.id === id ? { ...notification, read: true } : notification
  );
  localStorage.setItem('messmitra-notifications', JSON.stringify(updatedNotifications));
  return updatedNotifications;
};

// Function to mark all notifications as read
export const markAllNotificationsAsRead = () => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notification => ({
    ...notification,
    read: true
  }));
  localStorage.setItem('messmitra-notifications', JSON.stringify(updatedNotifications));
  return updatedNotifications;
};

// Function to get unread notification count
export const getUnreadCount = (): number => {
  const notifications = getNotifications();
  return notifications.filter(n => !n.read).length;
};