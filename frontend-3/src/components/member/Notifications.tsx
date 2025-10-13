import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import type { Notification } from '../../utils/notificationService';
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from '../../utils/notificationService';

interface NotificationsProps {
  onBack: () => void;
}

export function Notifications({ onBack }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const handleMarkAllAsRead = () => {
    const updatedNotifications = markAllNotificationsAsRead();
    setNotifications(updatedNotifications);
  };

  useEffect(() => {
    // Load and sort notifications
    const allNotifications = getNotifications();
    setNotifications(allNotifications);

    // Set up interval to check for new notifications
    const interval = setInterval(() => {
      const freshNotifications = getNotifications();
      setNotifications(freshNotifications);
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = (id: string) => {
    const updatedNotifications = markNotificationAsRead(id);
    setNotifications(updatedNotifications);
  };

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date.toLocaleString('en-US', { 
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const getNotificationStyle = (type: string) => {
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
          <button 
            onClick={handleMarkAllAsRead}
            className="ml-auto p-2 rounded-xl text-xs text-white/80 hover:text-white active:scale-95 transition-all"
            style={{ background: 'rgba(255, 255, 255, 0.2)' }}
          >
            Mark all as read
          </button>
        </div>
      </motion.div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification, index) => {
              const style = getNotificationStyle(notification.type);
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-2xl cursor-pointer ${notification.read ? 'opacity-60' : ''}`}
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
                      <p style={{ fontSize: '0.875rem', color: '#4B5563', margin: '4px 0' }}>
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
      </div>
    </div>
  );
}