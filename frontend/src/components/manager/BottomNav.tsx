import { Home, UtensilsCrossed, ClipboardCheck, IndianRupee, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { BilingualText } from '../BilingualText';

interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const { language } = useLanguage();
  
  const getNavLabel = (key: string) => {
    const labels: { [key: string]: { marathi: string; hindi: string; english: string } } = {
      dashboard: { marathi: 'होम', hindi: 'होम', english: 'Home' },
      attendance: { marathi: 'हाज़िरी', hindi: 'हाज़िरी', english: 'Attendance' },
      billing: { marathi: 'पेमेंट', hindi: 'पेमेंट', english: 'Payment' }
    };
    return labels[key]?.[language] || labels[key]?.english || key;
  };

  const navItems = [
    { id: 'dashboard', icon: Home, color: '#0B8043' },
    { id: 'attendance', icon: ClipboardCheck, color: '#0B8043' },
    { id: 'billing', icon: IndianRupee, color: '#0B8043' }
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
  <div className="grid grid-cols-3 gap-0.5 px-1 py-2">
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
                    layoutId="activeTab"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full"
                    style={{ background: '#0B8043' }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-1 transition-all"
                  style={{
                    background: isActive ? 'rgba(11, 128, 67, 0.15)' : 'transparent'
                  }}
                >
                  <Icon 
                    className="w-5 h-5 transition-all" 
                    style={{ 
                      color: isActive ? '#0B8043' : '#999',
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
                      color: isActive ? '#0B8043' : '#666',
                      lineHeight: '1'
                    }}
                  >
                    <BilingualText text={getNavLabel(item.id)} />
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
