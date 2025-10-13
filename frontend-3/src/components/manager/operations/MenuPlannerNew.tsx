import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Image as ImageIcon, Save } from 'lucide-react';
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

type MealType = 'lunch' | 'dinner';

interface MenuItem {
  date: string;
  lunch: {
    image?: string;
    description?: string;
  };
  dinner: {
    image?: string;
    description?: string;
  };
}

export function MenuPlannerNew({ currentScreen, onNavigate, onBack }: MenuPlannerProps) {
  const { language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMeal, setSelectedMeal] = useState<MealType>('lunch');
  const [menus, setMenus] = useState<Record<string, MenuItem>>({
    [new Date().toDateString()]: {
      date: new Date().toDateString(),
      lunch: {
        description: 'रोटी, दाल, चावल, सब्जी, दही'
      },
      dinner: {
        description: 'पराठे, पनीर सब्जी, दही, अचार'
      }
    }
  });

  const dateKey = selectedDate.toDateString();
  const currentMenu = menus[dateKey] || { 
    date: dateKey, 
    lunch: { description: '' },
    dinner: { description: '' }
  };

  const meals = [
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

  const handleSave = () => {
    setMenus(prev => ({
      ...prev,
      [dateKey]: currentMenu
    }));
    toast.success(getTranslation(language, 'menuSaved'));
  };

  const handleImageUpload = (meal: MealType, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMenus(prev => ({
          ...prev,
          [dateKey]: {
            ...currentMenu,
            [meal]: {
              ...currentMenu[meal],
              image: reader.result as string
            }
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  };

  const currentMealData = meals.find(m => m.type === selectedMeal);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #F1F8F4 0%, #FFFFFF 100%)' }}>
      {/* Modern Header with Date Navigation */}
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

        {/* Date Navigation Slider */}
        <div className="flex items-center justify-between gap-4 mt-4">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 rounded-lg active:scale-95 transition-all"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex-1 py-2 px-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <span className="text-white font-semibold">
                  {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
              />
            </PopoverContent>
          </Popover>
          <button
            onClick={() => navigateDate('next')}
            className="p-2 rounded-lg active:scale-95 transition-all"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-28">
        {/* Meal Tabs */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {meals.map((meal) => (
            <motion.button
              key={meal.type}
              onClick={() => setSelectedMeal(meal.type)}
              whileTap={{ scale: 0.95 }}
              className="p-4 rounded-2xl transition-all relative overflow-hidden"
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
                fontSize: '1rem', 
                fontWeight: '700',
                color: selectedMeal === meal.type ? 'white' : '#1C4532',
                marginBottom: '2px'
              }}>
                {meal.label}
              </div>
              <div style={{ 
                fontSize: '0.75rem',
                color: selectedMeal === meal.type ? 'rgba(255,255,255,0.9)' : '#666'
              }}>
                {meal.sublabel}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Menu Editor */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMeal}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Image Upload */}
            <div className="p-4 rounded-2xl" style={{ 
              background: 'white',
              border: '1.5px solid #E8F5E9'
            }}>
              <div className="mb-3" style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1C4532' }}>
                Add Food Image
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(selectedMeal, e)}
                className="hidden"
                id={`image-upload-${selectedMeal}`}
              />
              {currentMenu[selectedMeal].image ? (
                <div className="relative">
                  <img 
                    src={currentMenu[selectedMeal].image} 
                    alt="Food" 
                    className="w-full h-48 object-cover rounded-xl mb-2"
                  />
                  <label
                    htmlFor={`image-upload-${selectedMeal}`}
                    className="absolute bottom-4 right-4 p-2 rounded-lg cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.9)' }}
                  >
                    <ImageIcon className="w-5 h-5" style={{ color: '#0B8043' }} />
                  </label>
                </div>
              ) : (
                <label
                  htmlFor={`image-upload-${selectedMeal}`}
                  className="w-full h-48 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer"
                  style={{ 
                    background: '#F9FFF9',
                    border: '2px dashed #C8E6C9'
                  }}
                >
                  <ImageIcon className="w-8 h-8" style={{ color: '#0B8043' }} />
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>Click to add food image</div>
                </label>
              )}
            </div>

            {/* Description */}
            <div className="p-4 rounded-2xl" style={{ 
              background: 'white',
              border: '1.5px solid #E8F5E9'
            }}>
              <div className="mb-3" style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1C4532' }}>
                Menu Description (Optional)
              </div>
              <textarea
                value={currentMenu[selectedMeal].description || ''}
                onChange={(e) => setMenus(prev => ({
                  ...prev,
                  [dateKey]: {
                    ...currentMenu,
                    [selectedMeal]: {
                      ...currentMenu[selectedMeal],
                      description: e.target.value
                    }
                  }
                }))}
                placeholder="Add menu details here..."
                className="w-full p-3 rounded-xl border-2 resize-none focus:outline-none transition-all"
                style={{ 
                  minHeight: '100px',
                  borderColor: '#E8F5E9',
                  fontSize: '0.9rem',
                  background: '#F9FFF9'
                }}
                rows={4}
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full py-4 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg"
              style={{ 
                background: 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)',
                color: 'white', 
                fontSize: '1rem', 
                fontWeight: '700'
              }}
            >
              <Save className="w-5 h-5" />
              सेव करें • Save Menu
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
    </div>
  );
}