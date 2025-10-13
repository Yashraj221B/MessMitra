import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { notificationService } from '../../services';
import type { Notification } from '../../services/notification.service';

interface NotificationsProps {
  onBack: () => void;
}

export function Notifications({ onBack }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadNotifications();

    // Set up interval to check for new notifications
    const interval = setInterval(() => {
      loadNotifications(true); // Silent refresh
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      
      // Get current user and mess ID
      const currentUserStr = localStorage.getItem('current-user');
      if (!currentUserStr) {
        toast.error('Please login again');
        return;
      }

      const currentUser = JSON.parse(currentUserStr);
      if (!currentUser.messId) {
        toast.error('No mess associated with your account');
        return;
      }
      
      // Fetch notifications from backend
      const fetchedNotifications = await notificationService.getNotifications(currentUser.messId);
      setNotifications(fetchedNotifications);
    } catch (error: any) {
      console.error('Error loading notifications:', error);
      if (!silent) {
        toast.error('Failed to load notifications');
      }
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  const handleMarkAllAsRead = () => {
    const notificationIds = notifications.map(n => n.id);
    notificationService.markAllAsRead(notificationIds);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const handleNotificationClick = (id: string) => {
    notificationService.markAsRead(id);
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);

      if (days > 0) {
        return date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        });
      } else if (hours > 0) {
        return `${hours}h ago`;
      } else {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes > 0 ? `${minutes}m ago` : 'Just now';
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const getNotificationStyle = (type: string, priority?: string) => {
    if (priority === 'high') {
      return {
        bg: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
        border: 'rgba(239, 68, 68, 0.3)',
        icon: '🚨',
      };
    }

    switch (type) {
      case 'menu-change':
        return {
          bg: 'linear-gradient(135deg, #E8F5E9 0%, #F1F8F4 100%)',
          border: 'rgba(11, 128, 67, 0.2)',
          icon: '🍽️',
        };
      case 'announcement':
        return {
          bg: 'linear-gradient(135deg, #FFF3E0 0%, #FFF9F0 100%)',
          border: 'rgba(255, 152, 0, 0.2)',
          icon: '📢',
        };
      case 'payment':
        return {
          bg: 'linear-gradient(135deg, #EEF2FF 0%, #F5F7FF 100%)',
          border: 'rgba(79, 70, 229, 0.2)',
          icon: '💰',
        };
      default:
        return {
          bg: 'linear-gradient(135deg, #E3F2FD 0%, #F1F8FE 100%)',
          border: 'rgba(96, 165, 250, 0.2)',
          icon: '🔔',
        };
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFBFC' }}>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 pt-6 pb-5" 
        style={{ 
          background: 'linear-gradient(135deg, #0B8043 0%, #48C479 100%)',
          boxShadow: '0 8px 24px rgba(11, 128, 67, 0.12)'
        }}
      >
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 rounded-xl active:scale-95 transition-all"
            style={{ background: 'rgba(255, 255, 255, 0.2)' }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-lg font-bold">Notifications</h1>
          {notifications.some(n => !n.read) && (
            <button 
              onClick={handleMarkAllAsRead}
              className="ml-auto px-3 py-1.5 rounded-xl text-xs text-white/90 hover:text-white active:scale-95 transition-all font-medium"
              style={{ background: 'rgba(255, 255, 255, 0.2)' }}
            >
              Mark all read
            </button>
          )}
        </div>
      </motion.div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-24">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center mt-12">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading notifications...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔔</span>
                </div>
                <h3 className="text-gray-800 font-semibold mb-1">No notifications yet</h3>
                <p className="text-sm text-gray-500">You'll see announcements and updates here</p>
              </div>
            ) : (
              notifications.map((notification, index) => {
                const style = getNotificationStyle(notification.type, notification.priority);
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-2xl cursor-pointer ${notification.read ? 'opacity-70' : ''}`}
                    style={{ 
                      background: style.bg,
                      border: `1px solid ${style.border}`,
                    }}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" 
                        style={{ background: 'rgba(0, 0, 0, 0.04)' }}>
                        <span style={{ fontSize: '1.25rem' }}>{style.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1A1F36' }}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" 
                              style={{ background: '#0B8043' }} />
                          )}
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#4B5563', margin: '4px 0 8px' }}>
                          {notification.message}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
