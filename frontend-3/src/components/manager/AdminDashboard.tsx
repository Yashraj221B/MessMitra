// File intentionally replaced with a single clean copy (previously duplicated). The content is the same as before but de-duplicated.
import { useState, useEffect } from 'react';
import { UserX, IndianRupee, UtensilsCrossed, Star, Bell, TrendingUp, TrendingDown, Megaphone, ClipboardCheck, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';
import { BottomNav } from './BottomNav';
import { useLanguage } from '../../contexts/LanguageContext';
import { getTranslation } from '../../utils/translations';
import { BilingualText } from '../BilingualText';

interface AdminDashboardProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export function AdminDashboard({ currentScreen, onNavigate }: AdminDashboardProps) {
  const { language } = useLanguage();
  const [userName, setUserName] = useState('Suresh Uncle');
  const [messName, setMessName] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    try {
      const currentUser = localStorage.getItem('current-user');
      if (currentUser) {
        const data = JSON.parse(currentUser);
        setUserName(data.name || 'Suresh Uncle');
        setMessName(data.messName || '');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserName('Suresh Uncle');
      setMessName('');
    }

    // Calculate notification count
    const joinRequests = JSON.parse(localStorage.getItem('join-requests') || '[]');
    const leaveRequests = JSON.parse(localStorage.getItem('leave-requests') || '[]');
    const pendingJoin = joinRequests.filter((r: any) => r.status === 'pending').length;
    const pendingLeave = leaveRequests.filter((r: any) => r.status === 'pending').length;
    setNotificationCount(pendingJoin + pendingLeave);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFBFC' }}>
      {/* Header with Profile */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 pt-6 pb-5" 
        style={{ 
          background: 'linear-gradient(135deg, #0B8043 0%, #48C479 100%)',
          boxShadow: '0 8px 24px rgba(11, 128, 67, 0.12)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              onClick={() => onNavigate('settings')}
              className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer"
              style={{ 
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.4)'
            }}>
              <span style={{ fontSize: '1.75rem' }}>🧑‍🍳</span>
            </div>
            <div>
              <h1 className="text-white" style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '2px' }}>
                {userName}
              </h1>
              <p className="text-white/90" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                {messName || getTranslation(language, 'messOwner' as any) || (language === 'marathi' ? 'मेस मालिक' : language === 'hindi' ? 'मेस मालिक' : 'Mess Owner')}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('notifications')}
            className="p-2.5 rounded-xl active:scale-95 transition-all relative"
            style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}
          >
            <Bell className="w-5 h-5 text-white" />
            {notificationCount > 0 && (
              <div 
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ 
                  background: '#FF6B35',
                  boxShadow: '0 2px 8px rgba(255, 107, 53, 0.4)'
                }}
              >
                <span className="text-white" style={{ fontSize: '0.625rem', fontWeight: '700' }}>
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              </div>
            )}
          </button>
        </div>
      </motion.div>

      {/* Date Display */}
      <div className="px-5 py-3 flex justify-center" style={{ background: '#FFFFFF', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textAlign: 'center' }}>
          {new Date().toLocaleDateString('en-IN', { 
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-5">
        {/* Today's Headcount Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-2 p-3 rounded-xl"
          style={{ 
            background: 'linear-gradient(135deg, #E8F5E9 0%, #F1F8F4 100%)',
            border: '1px solid rgba(11, 128, 67, 0.1)',
            boxShadow: '0 2px 8px rgba(11, 128, 67, 0.06)'
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1A1F36', marginBottom: '2px' }}>
                <BilingualText text={getTranslation(language, 'todaysHeadcount')} />
              </h2>
            </div>
            <div className="px-2.5 py-1 rounded-xl" style={{ background: 'rgba(11, 128, 67, 0.12)' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: '700', color: '#0B8043', letterSpacing: '0.5px' }}>
                <BilingualText text={getTranslation(language, 'live')} />
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('attendance-present')}
              className="cursor-pointer"
            >
              <div className="flex items-baseline gap-1 mb-0.5">
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0B8043', letterSpacing: '-0.02em' }}>
                  142
                </span>
                <TrendingUp className="w-4 h-4 text-green-600 mb-1" />
              </div>
              <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1A1F36', marginBottom: '6px' }}>
                <BilingualText text={getTranslation(language, 'presentToday')} />
              </p>
            </motion.div>

            <motion.div
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('attendance')}
              className="cursor-pointer"
            >
              <div className="flex items-baseline gap-1 mb-0.5">
                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1A1F36', letterSpacing: '-0.02em' }}>
                  150
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1A1F36', marginBottom: '6px' }}>
                <BilingualText text={getTranslation(language, 'totalMembers')} />
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid (balanced spacing) */}
        <div className="mt-3 grid grid-cols-2 gap-4">
          {/* On Leave Card */}
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('attendance-absent')}
            className="p-3 rounded-2xl text-left"
            style={{ 
              background: 'linear-gradient(135deg, #FFF3E0 0%, #FFF9F0 100%)',
              border: '1px solid rgba(255, 144, 102, 0.15)',
              boxShadow: '0 2px 8px rgba(255, 144, 102, 0.08)'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ 
                background: 'rgba(255, 144, 102, 0.15)'
              }}>
                <UserX className="w-4 h-4" style={{ color: '#FF9066' }} />
              </div>
              <TrendingDown className="w-4 h-4" style={{ color: '#FF9066' }} />
            </div>
            <div className="mb-1">
              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1A1F36', letterSpacing: '-0.02em' }}>
                8
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1A1F36', marginBottom: '4px' }}>
              <BilingualText text={getTranslation(language, 'onLeave')} />
            </p>
          </motion.button>

          {/* Payment Pending Card */}
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('billing-pending')}
            className="p-3 rounded-2xl text-left"
            style={{ 
              background: 'linear-gradient(135deg, #FCE4EC 0%, #FEF1F5 100%)',
              border: '1px solid rgba(239, 68, 68, 0.15)',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.08)'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ 
                background: 'rgba(239, 68, 68, 0.12)'
              }}>
                <IndianRupee className="w-4 h-4" style={{ color: '#EF4444' }} />
              </div>
              <div className="px-2 py-1 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.15)' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: '700', color: '#EF4444' }}>15</span>
              </div>
            </div>
            <div className="mb-1">
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1A1F36', letterSpacing: '-0.02em' }}>
                ₹12,400
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1A1F36', marginBottom: '4px' }}>
              <BilingualText text={getTranslation(language, 'pending')} />
            </p>
          </motion.button>
        </div>

        {/* Quick Actions Section (balanced prominence) */}
        <div className="mt-3 p-6 rounded-3xl" style={{ 
          background: 'linear-gradient(135deg, #E8F5E9 0%, #F1F8F4 100%)',
          border: '1.5px solid rgba(11, 128, 67, 0.15)',
          boxShadow: '0 4px 16px rgba(11, 128, 67, 0.1)'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1A1F36', marginBottom: '12px' }}>
            <BilingualText text={getTranslation(language, 'quickActions')} />
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {/* Set Menu (top-left) */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('menu-planner')}
              className="p-3 rounded-2xl text-left"
              style={{ 
                background: 'white',
                border: '1.5px solid #E5E7EB',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ 
                background: 'linear-gradient(135deg, #E8F5E9 0%, #F1F8F4 100%)'
              }}>
                <UtensilsCrossed className="w-4 h-4" style={{ color: '#0B8043' }} />
              </div>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1A1F36' }}>
                <BilingualText text={getTranslation(language, 'setMenu')} />
              </p>
            </motion.button>

            {/* Announcements (top-right) */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('announcements')}
              className="p-3 rounded-2xl text-left"
              style={{ 
                background: 'white',
                border: '1.5px solid #E5E7EB',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ 
                background: 'linear-gradient(135deg, #FFF9E6 0%, #FFFBF0 100%)'
              }}>
                <Megaphone className="w-4 h-4" style={{ color: '#F59E0B' }} />
              </div>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1A1F36' }}>
                <BilingualText text={getTranslation(language, 'announcements')} />
              </p>
            </motion.button>

            {/* Add Member (bottom-left) */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('members')}
              className="p-3 rounded-2xl text-left"
              style={{ 
                background: 'white',
                border: '1.5px solid #E5E7EB',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ 
                background: 'linear-gradient(135deg, #FFF3E0 0%, #FFF9F0 100%)'
              }}>
                <UserPlus className="w-4 h-4" style={{ color: '#FF9066' }} />
              </div>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1A1F36' }}>
                <BilingualText text={getTranslation(language, 'addMember')} />
              </p>
            </motion.button>

            {/* Feedback / Complaints (bottom-right) */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('feedback')}
              className="p-3 rounded-2xl text-left"
              style={{ 
                background: 'white',
                border: '1.5px solid #E5E7EB',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ 
                background: 'linear-gradient(135deg, #FCE4EC 0%, #FEF1F5 100%)'
              }}>
                <ClipboardCheck className="w-4 h-4" style={{ color: '#D946EF' }} />
              </div>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1A1F36' }}>
                <BilingualText text={getTranslation(language, 'feedback') || 'Feedback'} />
              </p>
            </motion.button>
          </div>
        </div>

        {/* Ratings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: '700', color: '#1A1F36' }}>
                <BilingualText text={getTranslation(language, 'foodRatings')} />
              </h3>
            </div>
            <button
              onClick={() => onNavigate('ratings')}
              className="text-sm px-3 py-1.5 rounded-lg"
              style={{ color: '#0B8043', background: '#E8F5E9', fontWeight: '600' }}
            >
              <BilingualText text={getTranslation(language, 'viewAll')} />
            </button>
          </div>

          <button
            onClick={() => onNavigate('ratings')}
            className="w-full p-5 rounded-2xl text-left"
            style={{ 
              background: 'white',
              border: '1.5px solid #E5E7EB',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ 
                  background: 'linear-gradient(135deg, #FFF9E6 0%, #FFFBF0 100%)'
                }}>
                  <Star className="w-6 h-6" style={{ color: '#FFB800', fill: '#FFB800' }} />
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1A1F36' }}>4.2</span>
                    <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>/5</span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                    <BilingualText text={getTranslation(language, 'todaysAverage')} />
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0B8043' }}>+0.3</span>
              </div>
            </div>
            
            <div className="pt-3 border-t" style={{ borderColor: '#F3F4F6' }}>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                  {getTranslation(language, 'todaysAverage' as any) || 'Total Reviews Today'}
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1A1F36' }}>
                  87 {getTranslation(language, 'reviews' as any) || (language === 'marathi' ? 'रिव्ह्यू' : language === 'hindi' ? 'रिव्यू' : 'reviews')}
                </span>
              </div>
            </div>
          </button>
        </motion.div>
      </div>

      <BottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
    </div>
  );
}

