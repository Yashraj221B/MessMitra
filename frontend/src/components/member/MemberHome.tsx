import { useState, useEffect } from 'react';
import { Calendar, IndianRupee, Clock, User, Star, QrCode } from 'lucide-react';
import { motion } from 'motion/react';
import { MemberBottomNav } from './MemberBottomNav';
import { userService } from '../../services';

interface MemberHomeProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export function MemberHome({ currentScreen, onNavigate }: MemberHomeProps) {
  const [userName, setUserName] = useState('');
  const [room, setRoom] = useState('');
  const [memberId, setMemberId] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const profile = await userService.getProfile();
      setUserName(profile.name || 'Member');
      setRoom('N/A'); // TODO: Add room field to profile
      setMemberId(profile.id || '');
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserName('Member');
      setRoom('');
      setMemberId('');
    }
  };

  // const stats = [
  //   {
  //     icon: <IndianRupee className="w-5 h-5" />,
  //     label: 'Monthly Fee',
  //     value: '₹3,500',
  //     bgColor: 'rgba(11, 128, 67, 0.1)',
  //     iconColor: '#0B8043'
  //   },
  //   {
  //     icon: <Calendar className="w-5 h-5" />,
  //     label: 'Days Left',
  //     value: '18 days',
  //     bgColor: 'rgba(74, 85, 220, 0.1)',
  //     iconColor: '#4A55DC'
  //   },
  //   {
  //     icon: <Clock className="w-5 h-5" />,
  //     label: 'Attendance',
  //     value: '98%',
  //     bgColor: 'rgba(245, 124, 0, 0.1)',
  //     iconColor: '#F57C00'
  //   }
  // ];

  const announcements = [
    { id: 1, message: 'कल रविवार को मेस बंद रहेगी।', time: '2h ago', unread: true },
    { id: 2, message: 'इस महीने की फीस 5 तारीख तक जमा करें।', time: '1d ago', unread: false },
  ];

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
            onClick={() => onNavigate('settings')}
            className="p-2.5 rounded-xl active:scale-95 transition-all"
            style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}
          >
            <User className="w-5 h-5 text-white" />
          </button>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-5">
        {/* Today's Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 p-4 rounded-3xl"
          style={{ 
            background: 'linear-gradient(135deg, #E8F5E9 0%, #F1F8F4 100%)',
            border: '1px solid rgba(11, 128, 67, 0.1)',
            boxShadow: '0 4px 12px rgba(11, 128, 67, 0.06)'
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#1A1F36', marginBottom: '2px' }}>
                This Month
              </h2>
              <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                इस महीने की जानकारी
              </p>
            </div>
            <div className="px-2.5 py-1 rounded-xl" style={{ background: 'rgba(11, 128, 67, 0.12)' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: '700', color: '#0B8043', letterSpacing: '0.5px' }}>
                OCT
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-baseline gap-1 mb-0.5">
                <span style={{ fontSize: '1.875rem', fontWeight: '800', color: '#0B8043', letterSpacing: '-0.02em' }}>
                  92%
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1A1F36', marginBottom: '2px' }}>
                Attendance
              </p>
              <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                उपस्थिति दर
              </p>
            </div>

            <div>
              <div className="flex items-baseline gap-1 mb-0.5">
                <span style={{ fontSize: '1.875rem', fontWeight: '800', color: '#1A1F36', letterSpacing: '-0.02em' }}>
                  3
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1A1F36', marginBottom: '2px' }}>
                Leave Days
              </p>
              <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                छुट्टी के दिन
              </p>
            </div>
          </div>
        </motion.div>

        {/* Payment Cards */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          {/* Current Month Bill */}
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('payment')}
            className="p-4 rounded-3xl text-left"
            style={{ 
              background: 'linear-gradient(135deg, #FFF3E0 0%, #FFF9F0 100%)',
              border: '1px solid rgba(255, 144, 102, 0.15)',
              boxShadow: '0 2px 8px rgba(255, 144, 102, 0.08)'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ 
                background: 'rgba(255, 144, 102, 0.15)'
              }}>
                <IndianRupee className="w-5 h-5" style={{ color: '#FF9066' }} />
              </div>
              <div className="px-2 py-1 rounded-lg" style={{ background: 'rgba(255, 144, 102, 0.15)' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: '700', color: '#FF9066' }}>DUE</span>
              </div>
            </div>
            <div className="mb-1">
              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1A1F36', letterSpacing: '-0.02em' }}>
                ₹4,500
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1A1F36', marginBottom: '2px' }}>
              This Month
            </p>
            <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
              मासिक बिल
            </p>
          </motion.button>

          {/* Last Payment */}
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('payment')}
            className="p-4 rounded-3xl text-left"
            style={{ 
              background: 'linear-gradient(135deg, #E3F2FD 0%, #F1F8FE 100%)',
              border: '1px solid rgba(96, 165, 250, 0.15)',
              boxShadow: '0 2px 8px rgba(96, 165, 250, 0.08)'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ 
                background: 'rgba(96, 165, 250, 0.15)'
              }}>
                <Clock className="w-5 h-5" style={{ color: '#60A5FA' }} />
              </div>
              <div className="px-2 py-1 rounded-lg" style={{ background: 'rgba(11, 128, 67, 0.12)' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: '700', color: '#0B8043' }}>PAID</span>
              </div>
            </div>
            <div className="mb-3">
              <span style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1A1F36', letterSpacing: '-0.02em' }}>
                ₹4,500
              </span>
            </div>
            <p style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1A1F36', marginBottom: '2px' }}>
              Last Paid
            </p>
            <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
              पिछला भुगतान
            </p>
            <div className="flex items-center gap-1 mt-2">
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6B7280' }}>Sept 2025</span>
            </div>
          </motion.button>
        </div>

        {/* Quick Actions */}
        <div className="mt-4">
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1A1F36', marginBottom: '2px' }}>
            Quick Actions
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '12px' }}>
            त्वरित कार्य
          </p>

          <div className="grid grid-cols-3 gap-2.5">
            {/* Apply Leave */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('leave')}
              className="p-3 rounded-2xl text-center"
              style={{ 
                background: 'white',
                border: '1.5px solid #E5E7EB',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ 
                background: 'linear-gradient(135deg, #E8F5E9 0%, #F1F8F4 100%)'
              }}>
                <Calendar className="w-4 h-4" style={{ color: '#0B8043' }} />
              </div>
              <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#1A1F36' }}>
                Leave
              </p>
            </motion.button>

            {/* Rate Food */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('food-rating')}
              className="p-3 rounded-2xl text-center"
              style={{ 
                background: 'white',
                border: '1.5px solid #E5E7EB',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ 
                background: 'linear-gradient(135deg, #FFF9E6 0%, #FFFBF0 100%)'
              }}>
                <Star className="w-4 h-4" style={{ color: '#FFB800' }} />
              </div>
              <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#1A1F36' }}>
                Rate
              </p>
            </motion.button>

            {/* Join Mess */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('qr-code')}
              className="p-3 rounded-2xl text-center"
              style={{ 
                background: 'white',
                border: '1.5px solid #E5E7EB',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ 
                background: 'linear-gradient(135deg, #FFF3E0 0%, #FFF9F0 100%)'
              }}>
                <QrCode className="w-4 h-4" style={{ color: '#FF9066' }} />
              </div>
              <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#1A1F36' }}>
                Join
              </p>
            </motion.button>
          </div>
        </div>

        {/* Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: '700', color: '#1A1F36', marginBottom: '4px' }}>
                Announcements
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                घोषण��एँ
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + index * 0.05 }}
                className="p-4 rounded-2xl relative"
                style={{ 
                  background: announcement.unread ? '#FFF9F0' : 'white',
                  border: announcement.unread ? '1.5px solid #FFE082' : '1.5px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                }}
              >
                {announcement.unread && (
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full" style={{ background: '#FF9066' }} />
                )}
                <p style={{ fontSize: '0.9375rem', fontWeight: '500', color: '#1A1F36', marginBottom: '8px', paddingRight: '1rem' }}>
                  {announcement.message}
                </p>
                <div className="flex items-center gap-2" style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                  <Clock className="w-3 h-3" />
                  {announcement.time}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating Action Button - Rate Food */}
      <motion.button
        onClick={() => onNavigate('food-rating')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 right-5 z-40 px-5 py-3.5 rounded-full shadow-xl flex items-center gap-2"
        style={{ 
          background: 'linear-gradient(135deg, #FF9066 0%, #FFB38A 100%)',
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 200, damping: 15 }}
      >
        <Star className="w-5 h-5 text-white" style={{ fill: 'white' }} />
        <span className="text-white" style={{ fontSize: '0.9375rem', fontWeight: '700' }}>
          Rate Food
        </span>
      </motion.button>

      {/* Bottom Navigation */}
      <MemberBottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
    </div>
  );
}