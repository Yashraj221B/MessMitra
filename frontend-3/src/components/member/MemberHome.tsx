import { 
  Calendar, 
  Bell, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MemberBottomNav } from './MemberBottomNav';
import { format, addDays, subDays } from 'date-fns';
import { getUnreadCount } from '../../utils/notificationService';

interface MenuItem {
  lunch: string[];
}

interface MemberHomeProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

// Custom hook to calculate subscription days
const useSubscriptionDays = (nextPaymentDate: Date | null, leaveCount: number) => {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const calculateDays = () => {
      if (!nextPaymentDate) {
        setDaysLeft(null);
        return;
      }

      const today = new Date();
      const paymentDate = new Date(nextPaymentDate);
      
      // Calculate days between next payment and today
      const diffTime = paymentDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Add leave days and ensure it doesn't go below 0
      const totalDays = Math.max(0, diffDays + leaveCount);
      setDaysLeft(totalDays);
    };

    calculateDays();
    // Update every day at midnight
    const timer = setInterval(calculateDays, 24 * 60 * 60 * 1000);
    return () => clearInterval(timer);
  }, [nextPaymentDate, leaveCount]);

  return daysLeft;
};

export function MemberHome({ currentScreen, onNavigate }: MemberHomeProps) {
  const [userName, setUserName] = useState('Member');
  const [room, setRoom] = useState('');
  const [memberId, setMemberId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [nextPaymentDate, setNextPaymentDate] = useState<Date | null>(null);
  const [leaveCount, setLeaveCount] = useState<number>(0);
  const [menu] = useState<MenuItem>({
    lunch: ['Rice', 'Dal', 'Mixed Veg', 'Salad', 'Papad', 'Curd']
  });
  const [menuPhotos, setMenuPhotos] = useState<{ lunch?: string; dinner?: string }>({});
  const daysLeft = useSubscriptionDays(nextPaymentDate, leaveCount);
  
  useEffect(() => {
    // Check for unread notifications
    setUnreadNotifications(getUnreadCount());
    
    // Set up interval to check for new notifications
    const interval = setInterval(() => {
      setUnreadNotifications(getUnreadCount());
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Function to check and update subscription status
  const updateSubscriptionStatus = () => {
    try {
      const currentUser = localStorage.getItem('current-user');
      if (currentUser) {
        const data = JSON.parse(currentUser);
        setUserName(data.name || 'Member');
        setRoom(data.room || '');
        setMemberId(data.memberId || data.studentId || '');
      }

      // Load payment data
      const paymentData = localStorage.getItem('payment-info');
      if (paymentData) {
        const data = JSON.parse(paymentData);
        if (data.nextPaymentDate) {
          setNextPaymentDate(new Date(data.nextPaymentDate));
        }
      }

      // Load leave data
      const leaveData = localStorage.getItem('leave-info');
      if (leaveData) {
        const data = JSON.parse(leaveData);
        setLeaveCount(data.approvedLeaves || 0);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserName('Member');
      setRoom('');
      setMemberId('');
    }
  };

  // Initial load
  useEffect(() => {
    updateSubscriptionStatus();
  }, []);

  // Listen for payment and leave updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'payment-info' || e.key === 'leave-info') {
        updateSubscriptionStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Check every minute for updates
    const interval = setInterval(updateSubscriptionStatus, 60000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Load menu photos
  useEffect(() => {
    try {
      const menuData = localStorage.getItem('menu-photos');
      if (menuData) {
        const data = JSON.parse(menuData);
        const todayKey = format(selectedDate, 'yyyy-MM-dd');
        if (data[todayKey]) {
          setMenuPhotos(data[todayKey]);
        } else {
          setMenuPhotos({});
        }
      }
    } catch (error) {
      console.error('Error loading menu photos:', error);
      setMenuPhotos({});
    }
  }, [selectedDate]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFBFC' }}>
      {/* Header with Profile */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 pt-6 pb-5" 
        style={{ 
          background: 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)',
          boxShadow: '0 8px 24px rgba(11, 128, 67, 0.2)'
        }}
      >
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate('settings')}
            className="flex items-center gap-3 active:scale-95 transition-all"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ 
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.4)'
            }}>
              <span style={{ fontSize: '1.75rem' }}>🎓</span>
            </div>
            <div>
              <h1 className="text-white" style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '2px' }}>
                Hi, {userName.split(' ')[0]}! 👋
              </h1>
              <p className="text-white/90" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                {room && `Room ${room}`}{room && memberId && ' • '}{memberId && `ID: ${memberId}`}
              </p>
            </div>
          </button>
          <button
            onClick={() => onNavigate('notifications')}
            className="p-2.5 rounded-xl active:scale-95 transition-all relative"
            style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}
          >
            <Bell className="w-5 h-5 text-white" />
            {unreadNotifications > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                <span style={{ fontSize: '0.625rem', color: 'white', fontWeight: '600' }}>
                  {unreadNotifications}
                </span>
              </div>
            )}
          </button>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-16 px-5">
        {/* Monthly Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-3 p-3 rounded-2xl"
          style={{ 
            background: 'linear-gradient(135deg, #FFF3E0 0%, #FFF9F0 100%)',
            border: '1px solid rgba(255, 158, 44, 0.1)',
            boxShadow: '0 4px 12px rgba(255, 158, 44, 0.06)'
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#1A1F36', marginBottom: '2px' }}>
                Monthly Overview
              </h2>
              <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                October 2025
              </p>
            </div>
            <button
              onClick={() => onNavigate('payment')}
              className="px-3 py-1.5 rounded-xl flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
              style={{ background: 'rgba(255, 158, 44, 0.12)' }}
            >
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#FF9E2C' }}>₹4,500 Due</span>
              <ChevronRight className="w-4 h-4" style={{ color: '#FF9E2C' }} />
            </button>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-baseline gap-1">
                  <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1A1F36' }}>
                    {daysLeft ?? '--'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>days</span>
                </div>
                <p style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6B7280' }}>Subscription Left</p>
              </div>
              <div style={{ width: '1px', height: '24px', background: 'rgba(0,0,0,0.1)' }} />
              <div>
                <div className="flex items-baseline gap-1">
                  <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#FF9E2C' }}>₹4,500</span>
                </div>
                <p style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6B7280' }}>Monthly Fee</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Today's Menu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-2 p-3 rounded-2xl bg-white"
          style={{ 
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#1A1F36', marginBottom: '2px' }}>
                Today's Menu
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                {format(selectedDate, 'MMMM d, yyyy')}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedDate(prev => subDays(prev, 1))}
                className="p-2 rounded-xl active:scale-95 transition-all"
                style={{ background: '#F3F4F6' }}
              >
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </button>
              <button
                onClick={() => setSelectedDate(prev => addDays(prev, 1))}
                className="p-2 rounded-xl active:scale-95 transition-all"
                style={{ background: '#F3F4F6' }}
              >
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div>
            {/* Today's Menu */}
            <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #E8F5E9 0%, #F1F8F4 100%)' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#0B8043' }}>
                  Today's Menu
                </h3>
                <div className="text-xs font-medium text-green-700 px-2 py-1 rounded-full bg-green-100">
                  11:00 AM - 3:00 PM
                </div>
              </div>
              {menuPhotos.lunch && (
                <div className="mb-3 rounded-xl overflow-hidden shadow-sm" style={{ maxHeight: '140px' }}>
                  <img 
                    src={menuPhotos.lunch} 
                    alt="Today's Menu" 
                    className="w-full h-full object-cover"
                    style={{ aspectRatio: '16/9' }}
                  />
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {menu.lunch.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white"
                    style={{
                      boxShadow: '0 2px 4px rgba(11, 128, 67, 0.06)',
                      border: '1px solid rgba(11, 128, 67, 0.1)'
                    }}
                  >
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="mt-2">
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1A1F36', marginBottom: '1px' }}>
            Quick Actions
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '8px' }}>
            Take action or apply for services
          </p>
          <div className="grid grid-cols-2 gap-2">
            {/* Leave Management */}
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                onNavigate('leave');
                // Open the form and set leave type automatically
                localStorage.setItem('open-leave-form', 'true');
              }}
              className="p-4 rounded-2xl text-left"
              style={{ 
                background: 'linear-gradient(135deg, #E8F5E9 0%, #F1F8F4 100%)',
                border: '1px solid rgba(11, 128, 67, 0.15)',
                boxShadow: '0 2px 8px rgba(11, 128, 67, 0.08)'
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" 
                style={{ background: 'rgba(11, 128, 67, 0.15)' }}>
                <Calendar className="w-5 h-5" style={{ color: '#0B8043' }} />
              </div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1A1F36', marginBottom: '4px' }}>
                Apply Leave
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                Request mess leave
              </p>
            </motion.button>

            {/* Rate Food */}
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('food-rating')}
              className="p-4 rounded-2xl text-left"
              style={{ 
                background: 'linear-gradient(135deg, #FFF9E6 0%, #FFFBF0 100%)',
                border: '1px solid rgba(255, 200, 0, 0.15)',
                boxShadow: '0 2px 8px rgba(255, 200, 0, 0.08)'
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" 
                style={{ background: 'rgba(255, 200, 0, 0.15)' }}>
                <Star className="w-5 h-5" style={{ color: '#FFB800' }} />
              </div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1A1F36', marginBottom: '4px' }}>
                Rate Food
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                Share feedback
              </p>
            </motion.button>

            {/* Feedback */}
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('feedback')}
              className="p-4 rounded-2xl text-left"
              style={{ 
                background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F7FF 100%)',
                border: '1px solid rgba(79, 70, 229, 0.15)',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.08)'
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" 
                style={{ background: 'rgba(79, 70, 229, 0.15)' }}>
                <MessageSquare className="w-5 h-5" style={{ color: '#4F46E5' }} />
              </div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1A1F36', marginBottom: '4px' }}>
                Feedback
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                Send suggestions
              </p>
            </motion.button>

            {/* Menu Calendar */}
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('menu-calendar')}
              className="p-4 rounded-2xl text-left"
              style={{ 
                background: 'linear-gradient(135deg, #FFF0F0 0%, #FFF5F5 100%)',
                border: '1px solid rgba(220, 38, 38, 0.15)',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.08)'
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" 
                style={{ background: 'rgba(220, 38, 38, 0.15)' }}>
                <Calendar className="w-5 h-5" style={{ color: '#DC2626' }} />
              </div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1A1F36', marginBottom: '4px' }}>
                Menu Calendar
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                View weekly menu
              </p>
            </motion.button>
          </div>
        </div>

        {/* Bottom spacing for navigation bar */}
        <div className="h-20"></div>
      </div>

      {/* Bottom Navigation */}
      <MemberBottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
    </div>
  );
}
