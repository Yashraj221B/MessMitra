import { Home, Calendar, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';

interface MemberBottomNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export function MemberBottomNav({ currentScreen, onNavigate }: MemberBottomNavProps) {
  const navItems = [
    { 
      icon: <Home className="w-5 h-5" />, 
      label: 'Home', 
      screen: 'home',
      gradient: 'linear-gradient(135deg, #E8F5E9 0%, #F1F8F4 100%)'
    },
    { 
      icon: <Calendar className="w-5 h-5" />, 
      label: 'Attendance', 
      screen: 'leave',
      gradient: 'linear-gradient(135deg, #FFF3E0 0%, #FFF9F0 100%)'
    },
    { 
      icon: <CreditCard className="w-5 h-5" />, 
      label: 'Payment', 
      screen: 'payment',
      gradient: 'linear-gradient(135deg, #E3F2FD 0%, #F1F8FE 100%)'
    }
  ];

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-white"
      style={{ boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.04)' }}
    >
      <div className="flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = currentScreen === item.screen;
          
          return (
            <motion.button
              key={item.screen}
              onClick={() => onNavigate(item.screen)}
              whileTap={{ scale: 0.95 }}
              className={`relative flex flex-col items-center ${isActive ? '' : 'opacity-60'}`}
              style={{ flex: '1 1 0%' }}
            >
              <div 
                className="w-10 h-10 rounded-xl mb-1 flex items-center justify-center"
                style={{ 
                  background: isActive ? item.gradient : 'transparent'
                }}
              >
                {item.icon}
              </div>
              <span 
                style={{ 
                  fontSize: '0.6875rem', 
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? '#1A1F36' : '#6B7280'
                }}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
