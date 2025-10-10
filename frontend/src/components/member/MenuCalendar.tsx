import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MemberBottomNav } from './MemberBottomNav';

interface MenuCalendarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

interface DayMenu {
  date: Date;
  breakfast: string;
  lunch: string;
  dinner: string;
}

export function MenuCalendar({ currentScreen, onNavigate, onBack }: MenuCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedDay, setSelectedDay] = useState<DayMenu | null>(null);

  // Generate week data
  const getWeekDays = (weekOffset: number) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return {
        date,
        breakfast: 'पोहा, चाय, ब्रेड-बटर',
        lunch: 'रोटी, दाल, चावल, सब्जी, दही',
        dinner: 'पराठे, पनीर सब्जी, दही, अचार'
      };
    });
  };

  const weekDays = getWeekDays(currentWeek);
  const today = new Date();

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date: Date) => {
    return date < today && !isToday(date);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #F1F8F4 0%, #FFFFFF 100%)' }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-4" style={{ 
        background: 'linear-gradient(135deg, #48C479 0%, #23AE5F 100%)',
        borderBottomLeftRadius: '24px',
        borderBottomRightRadius: '24px',
        boxShadow: '0 4px 20px rgba(72, 196, 121, 0.2)'
      }}>
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl active:scale-95 transition-all"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white mb-0.5" style={{ fontSize: '1.35rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
              मेन्यू कैलेंडर
            </h1>
            <p className="text-white/80" style={{ fontSize: '0.85rem' }}>Menu Calendar</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <span className="text-2xl">📅</span>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 p-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <button
            onClick={() => setViewMode('week')}
            className="flex-1 py-2 rounded-lg transition-all active:scale-95"
            style={{ 
              background: viewMode === 'week' ? 'white' : 'transparent',
              color: viewMode === 'week' ? '#4CAF50' : 'white',
              fontSize: '0.95rem',
              fontWeight: '600'
            }}
          >
            Week View
          </button>
          <button
            onClick={() => setViewMode('month')}
            className="flex-1 py-2 rounded-lg transition-all active:scale-95"
            style={{ 
              background: viewMode === 'month' ? 'white' : 'transparent',
              color: viewMode === 'month' ? '#4CAF50' : 'white',
              fontSize: '0.95rem',
              fontWeight: '600'
            }}
          >
            Month View
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Week Navigation */}
        <div className="px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentWeek(prev => prev - 1)}
            className="p-2 rounded-lg active:scale-95 transition-transform"
            style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            <ChevronLeft className="w-5 h-5" style={{ color: '#333' }} />
          </button>
          <div className="text-center">
            <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#333' }}>
              {weekDays[0].date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>
              {weekDays[0].date.toLocaleDateString('en-US', { day: 'numeric' })} - {weekDays[6].date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
            </div>
          </div>
          <button
            onClick={() => setCurrentWeek(prev => prev + 1)}
            className="p-2 rounded-lg active:scale-95 transition-transform"
            style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            <ChevronRight className="w-5 h-5" style={{ color: '#333' }} />
          </button>
        </div>

        {/* Week Days */}
        <div className="px-4">
          <div className="flex flex-col gap-3">
            {weekDays.map((day, index) => (
              <motion.div
                key={day.date.toISOString()}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedDay(day)}
                className="p-4 rounded-xl active:scale-98 transition-transform"
                style={{ 
                  background: isToday(day.date) ? '#E8F5E9' : 'white',
                  border: isToday(day.date) ? '2px solid #4CAF50' : 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  opacity: isPast(day.date) ? 0.6 : 1
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div style={{ 
                      fontSize: '1rem', 
                      fontWeight: '600', 
                      color: isToday(day.date) ? '#4CAF50' : '#333' 
                    }}>
                      {day.date.toLocaleDateString('en-US', { weekday: 'long' })}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>
                      {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  {isToday(day.date) && (
                    <div className="px-3 py-1 rounded-full" style={{ background: '#4CAF50', fontSize: '0.75rem', color: 'white', fontWeight: '600' }}>
                      Today
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">🌅</span>
                    <div className="flex-1">
                      <div style={{ fontSize: '0.75rem', color: '#999' }}>Breakfast</div>
                      <div style={{ fontSize: '0.875rem', color: '#333' }}>{day.breakfast}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">☀️</span>
                    <div className="flex-1">
                      <div style={{ fontSize: '0.75rem', color: '#999' }}>Lunch</div>
                      <div style={{ fontSize: '0.875rem', color: '#333' }}>{day.lunch}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">🌙</span>
                    <div className="flex-1">
                      <div style={{ fontSize: '0.75rem', color: '#999' }}>Dinner</div>
                      <div style={{ fontSize: '0.875rem', color: '#333' }}>{day.dinner}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Day Detail Modal */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
            onClick={() => setSelectedDay(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[430px] rounded-t-3xl p-6"
              style={{ background: 'white', maxHeight: '70vh', overflowY: 'auto' }}
            >
              <div className="w-12 h-1 rounded-full mx-auto mb-6" style={{ background: '#E0E0E0' }} />

              <div className="text-center mb-6">
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#333' }}>
                  {selectedDay.date.toLocaleDateString('en-US', { weekday: 'long' })}
                </h2>
                <p style={{ fontSize: '1rem', color: '#666' }}>
                  {selectedDay.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-xl" style={{ background: '#FFF3E0' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">🌅</span>
                    <div>
                      <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#333' }}>Breakfast</div>
                      <div style={{ fontSize: '0.875rem', color: '#666' }}>7:00 AM - 9:00 AM</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '1rem', color: '#333', marginTop: '0.5rem' }}>{selectedDay.breakfast}</p>
                </div>

                <div className="p-4 rounded-xl" style={{ background: '#FFFDE7' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">☀️</span>
                    <div>
                      <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#333' }}>Lunch</div>
                      <div style={{ fontSize: '0.875rem', color: '#666' }}>12:00 PM - 2:00 PM</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '1rem', color: '#333', marginTop: '0.5rem' }}>{selectedDay.lunch}</p>
                </div>

                <div className="p-4 rounded-xl" style={{ background: '#E8EAF6' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">🌙</span>
                    <div>
                      <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#333' }}>Dinner</div>
                      <div style={{ fontSize: '0.875rem', color: '#666' }}>7:00 PM - 9:00 PM</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '1rem', color: '#333', marginTop: '0.5rem' }}>{selectedDay.dinner}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <MemberBottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
    </div>
  );
}
