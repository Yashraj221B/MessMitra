import { useState } from 'react';
import { ArrowLeft, Copy, Calendar as CalendarIcon, Clock, Save, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar } from '../../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { toast } from 'sonner';
import { BottomNav } from '../BottomNav';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getTranslation } from '../../../utils/translations';
import { BilingualText } from '../../BilingualText';

interface MenuPlannerProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

type MealType = 'breakfast' | 'lunch' | 'dinner';

interface MenuItem {
  date: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}

export function MenuPlanner({ currentScreen, onNavigate, onBack }: MenuPlannerProps) {
  const { language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMeal, setSelectedMeal] = useState<MealType>('breakfast');
  const [menus, setMenus] = useState<Record<string, MenuItem>>({
    [new Date().toDateString()]: {
      date: new Date().toDateString(),
      breakfast: 'पोहा, चाय, ब्रेड-बटर',
      lunch: 'रोटी, दाल, चावल, सब्जी, दही',
      dinner: 'पराठे, पनीर सब्जी, दही, अचार'
    }
  });

  const dateKey = selectedDate.toDateString();
  const currentMenu = menus[dateKey] || { date: dateKey, breakfast: '', lunch: '', dinner: '' };

  const meals = [
    { 
      type: 'breakfast' as MealType, 
      label: getTranslation(language, 'breakfast'), 
      icon: '🌅', 
      time: '7:00 - 9:00 AM', 
      gradient: 'linear-gradient(135deg, #FFB75E 0%, #ED8F03 100%)',
      sublabel: '7:00 - 9:00 AM'
    },
    { 
      type: 'lunch' as MealType, 
      label: getTranslation(language, 'lunch'), 
      icon: '☀️', 
      time: '12:00 - 2:00 PM', 
      gradient: 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)',
      sublabel: '12:00 - 2:00 PM'
    },
    { 
      type: 'dinner' as MealType, 
      label: getTranslation(language, 'dinner'), 
      icon: '🌙', 
      time: '7:00 - 9:00 PM', 
      gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      sublabel: '7:00 - 9:00 PM'
    },
  ];

  const handleSave = (meal: MealType, value: string) => {
    setMenus(prev => ({
      ...prev,
      [dateKey]: { ...currentMenu, [meal]: value }
    }));
    toast.success(getTranslation(language, 'menuSaved'));
  };

  const copyToTomorrow = () => {
    const tomorrow = new Date(selectedDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowKey = tomorrow.toDateString();
    
    setMenus(prev => ({
      ...prev,
      [tomorrowKey]: { ...currentMenu, date: tomorrowKey }
    }));
    const message = language === 'marathi' ? 'उद्याच्या मेन्यूमध्ये कॉपी झाले! ✅' : 
                    language === 'hindi' ? 'कल के लिए मेन्यू कॉपी हो गया! ✅' : 
                    'Menu copied to tomorrow! ✅';
    toast.success(message);
  };

  const previousMenus = Object.values(menus)
    .filter(m => new Date(m.date) < selectedDate)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const currentMealData = meals.find(m => m.type === selectedMeal);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #F1F8F4 0%, #FFFFFF 100%)' }}>
      {/* Modern Header */}
      <div className="px-4 pt-4 pb-6" style={{ 
        background: 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)',
        borderBottomLeftRadius: '24px',
        borderBottomRightRadius: '24px',
        boxShadow: '0 4px 20px rgba(11, 128, 67, 0.2)'
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
              <BilingualText text={getTranslation(language, 'setTodaysMenu')} />
            </h1>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <span className="text-2xl">🍱</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-28">
        {/* Date Selector */}
        <div className="mb-5 -mt-6">
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full flex items-center justify-between p-4 rounded-2xl shadow-lg active:scale-[0.99] transition-all" style={{ 
                background: 'white',
                border: '1.5px solid #E8F5E9'
              }}>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ 
                    background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)'
                  }}>
                    <CalendarIcon className="w-5 h-5" style={{ color: '#0B8043' }} />
                  </div>
                  <div className="text-left">
                    <div style={{ fontSize: '0.75rem', color: '#666', fontWeight: '500' }}>Selected Date</div>
                    <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1C4532' }}>
                      {selectedDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="text-gray-400">›</div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Meal Tabs - Modern Cards */}
        <div className="mb-5">
          <h3 className="mb-3 flex items-center gap-2" style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1C4532' }}>
            <Sparkles className="w-4 h-4" style={{ color: '#FFB75E' }} />
            Select Meal Time
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {meals.map((meal) => (
              <motion.button
                key={meal.type}
                onClick={() => setSelectedMeal(meal.type)}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-2xl transition-all relative overflow-hidden"
                style={{
                  background: selectedMeal === meal.type ? meal.gradient : 'white',
                  border: selectedMeal === meal.type ? 'none' : '1.5px solid #E8F5E9',
                  boxShadow: selectedMeal === meal.type ? '0 6px 20px rgba(11, 128, 67, 0.25)' : '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                {selectedMeal === meal.type && (
                  <div className="absolute inset-0 bg-white/10" />
                )}
                <div className="text-2xl mb-2">{meal.icon}</div>
                <div style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: '700',
                  color: selectedMeal === meal.type ? 'white' : '#1C4532',
                  marginBottom: '2px'
                }}>
                  {meal.label}
                </div>
                <div style={{ 
                  fontSize: '0.65rem',
                  color: selectedMeal === meal.type ? 'rgba(255,255,255,0.9)' : '#666'
                }}>
                  {meal.sublabel}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Menu Editor - Modern Design */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMeal}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-5"
          >
            <div className="p-5 rounded-2xl shadow-lg relative overflow-hidden" style={{ 
              background: 'white',
              border: '1.5px solid #E8F5E9'
            }}>
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-40 h-40 opacity-5 rounded-full -mr-20 -mt-20" style={{ 
                background: currentMealData?.gradient 
              }} />

              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ 
                  background: currentMealData?.gradient,
                  boxShadow: '0 4px 12px rgba(11, 128, 67, 0.2)'
                }}>
                  <span className="text-2xl">{currentMealData?.icon}</span>
                </div>
                <div className="flex-1">
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1C4532' }}>
                    {currentMealData?.label}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5" style={{ color: '#666' }} />
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>
                      {currentMealData?.time}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative z-10">
                <textarea
                  value={currentMenu[selectedMeal]}
                  onChange={(e) => setMenus(prev => ({
                    ...prev,
                    [dateKey]: { ...currentMenu, [selectedMeal]: e.target.value }
                  }))}
                  placeholder="आज का मेन्यू यहाँ लिखें... (जैसे: पोहा, चाय, ब्रेड-बटर)"
                  className="w-full p-4 rounded-xl border-2 resize-none focus:outline-none transition-all"
                  style={{ 
                    minHeight: '130px', 
                    borderColor: '#E8F5E9',
                    fontSize: '1rem',
                    background: '#F9FFF9'
                  }}
                  rows={5}
                />
                
                <button
                  onClick={() => handleSave(selectedMeal, currentMenu[selectedMeal])}
                  className="w-full mt-4 py-4 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg"
                  style={{ 
                    background: 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)',
                    color: 'white', 
                    fontSize: '1.05rem', 
                    fontWeight: '700'
                  }}
                >
                  <Save className="w-5 h-5" />
                  सेव करें • Save Menu
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Quick Actions */}
        <div className="mb-5">
          <button
            onClick={copyToTomorrow}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl active:scale-[0.98] transition-all shadow-md"
            style={{ 
              background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
              border: '1.5px solid #90CAF9'
            }}
          >
            <Copy className="w-5 h-5" style={{ color: '#1976D2' }} />
            <span style={{ fontSize: '1rem', fontWeight: '700', color: '#1976D2' }}>कल के लिए कॉपी करें</span>
          </button>
        </div>

        {/* Previous Menus */}
        {previousMenus.length > 0 && (
          <div>
            <h3 className="mb-3 flex items-center gap-2" style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1C4532' }}>
              <span>📋</span> पिछले मेन्यू
            </h3>
            <div className="flex flex-col gap-3">
              {previousMenus.map((menu) => (
                <div key={menu.date} className="p-4 rounded-2xl" style={{ 
                  background: 'white',
                  border: '1.5px solid #E8F5E9',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ fontWeight: '700', color: '#1C4532', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                    {new Date(menu.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="space-y-2" style={{ fontSize: '0.85rem' }}>
                    <div className="flex items-start gap-2">
                      <span>🌅</span>
                      <span style={{ color: '#555', flex: 1 }}>{menu.breakfast || 'Not set'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>☀️</span>
                      <span style={{ color: '#555', flex: 1 }}>{menu.lunch || 'Not set'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>🌙</span>
                      <span style={{ color: '#555', flex: 1 }}>{menu.dinner || 'Not set'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
    </div>
  );
}
