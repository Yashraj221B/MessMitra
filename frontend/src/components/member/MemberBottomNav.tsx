import { Home, Calendar, QrCode, Receipt, Settings } from 'lucide-react';
import { motion } from 'motion/react';

interface MemberBottomNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export function MemberBottomNav({ currentScreen, onNavigate }: MemberBottomNavProps) {
  const navItems = [
    { 
      id: 'home', 
      label: 'Home', 
      sublabel: 'होम',
      icon: Home, 
      color: '#48C479' 
    },
    { 
      id: 'menu-calendar', 
      label: 'Menu', 
      sublabel: 'मेन्यू',
      icon: Calendar, 
      color: '#48C479' 
    },
    { 
      id: 'qr-code', 
      label: 'QR Code', 
      sublabel: 'क्यूआर',
      icon: QrCode, 
      color: '#48C479' 
    },
    { 
      id: 'payment', 
      label: 'Payment', 
      sublabel: 'पेमेंट',
      icon: Receipt, 
      color: '#48C479' 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      sublabel: 'सेटिंग',
      icon: Settings, 
      color: '#48C479' 
    },
  ];

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
      style={{
        background: 'white',
        borderTop: '1px solid #E8F5E9',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)'
      }}
    >
      <div className="max-w-[430px] mx-auto">
        <div className="grid grid-cols-5 gap-0.5 px-1 py-2">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            const Icon = item.icon;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-center justify-center py-2 px-1 rounded-xl active:scale-95 transition-all relative"
                whileTap={{ scale: 0.95 }}
                style={{
                  background: isActive ? 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)' : 'transparent'
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="studentActiveTab"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full"
                    style={{ background: '#48C479' }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-1 transition-all"
                  style={{
                    background: isActive ? 'rgba(72, 196, 121, 0.15)' : 'transparent'
                  }}
                >
                  <Icon 
                    className="w-5 h-5 transition-all" 
                    style={{ 
                      color: isActive ? '#48C479' : '#999',
                      strokeWidth: isActive ? 2.5 : 2
                    }} 
                  />
                </div>
                
                <div className="text-center">
                  <div 
                    className="transition-all"
                    style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: isActive ? '700' : '600',
                      color: isActive ? '#48C479' : '#666',
                      lineHeight: '1',
                      marginBottom: '2px'
                    }}
                  >
                    {item.label}
                  </div>
                  <div 
                    className="transition-all"
                    style={{ 
                      fontSize: '0.6rem', 
                      fontWeight: '500',
                      color: isActive ? '#23AE5F' : '#999',
                      lineHeight: '1'
                    }}
                  >
                    {item.sublabel}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
