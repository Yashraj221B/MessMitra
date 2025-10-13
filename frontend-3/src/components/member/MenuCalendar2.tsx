import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, UtensilsCrossed } from 'lucide-react';
import { format, addWeeks, subWeeks, startOfWeek, addDays, isToday as isDateToday } from 'date-fns';

interface MenuCalendarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

interface MenuItem {
  lunch: string[];
  dinner: string[];
  photoUrl?: string;
}

interface WeeklyMenu {
  [key: string]: MenuItem;
}

export function MenuCalendar({ onBack }: MenuCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Sample menu data - Replace with actual data from your backend
  const [menu] = useState<WeeklyMenu>({
    [format(new Date(), 'yyyy-MM-dd')]: {
      lunch: ['Dal Tadka', 'Jeera Rice', 'Mix Veg', 'Salad', 'Pickle', 'Papad'],
      dinner: ['Roti', 'Paneer Butter Masala', 'Dal Fry', 'Rice', 'Sweet'],
      photoUrl: '/menu-photos/today-lunch.jpg'
    }
  });

  // Get dates for the week
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const monday = startOfWeek(currentDate, { weekStartsOn: 1 });
    return addDays(monday, i);
  });

  // Get menu for a specific date
  const getMenuForDate = (date: Date) => {
    const key = format(date, 'yyyy-MM-dd');
    return menu[key] || { lunch: [], dinner: [] };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 bg-gradient-to-br from-green-600 to-green-700">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/10 backdrop-blur active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white">Weekly Menu</h1>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentDate(d => subWeeks(d, 1))}
            className="p-2 rounded-lg text-white hover:bg-white/10 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-white font-medium">
            {format(weekDates[0], 'MMM d')} - {format(weekDates[6], 'MMM d, yyyy')}
          </div>
          <button
            onClick={() => setCurrentDate(d => addWeeks(d, 1))}
            className="p-2 rounded-lg text-white hover:bg-white/10 active:scale-95 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Week View */}
      <div className="p-4 pb-20">
        <div className="space-y-4">
          {weekDates.map(date => {
            const dayMenu = getMenuForDate(date);
            const isCurrentDay = isDateToday(date);

            return (
              <div 
                key={format(date, 'yyyy-MM-dd')}
                className={`rounded-2xl bg-white shadow-sm ${
                  isCurrentDay ? 'ring-2 ring-green-500 ring-offset-2' : ''
                }`}
              >
                {/* Date Header */}
                <div 
                  className={`p-4 border-b ${
                    isCurrentDay ? 'bg-green-50 border-green-100' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-semibold ${isCurrentDay ? 'text-green-700' : 'text-gray-800'}`}>
                        {format(date, 'EEEE')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(date, 'MMMM d, yyyy')}
                      </div>
                    </div>
                    {isCurrentDay && (
                      <span className="text-xs font-medium text-green-700 px-2 py-1 rounded-full bg-green-100">
                        Today
                      </span>
                    )}
                  </div>
                </div>

                {/* Menu Content */}
                <div className="p-4">
                  {dayMenu.lunch.length > 0 || dayMenu.dinner.length > 0 ? (
                    <div className="space-y-6">
                      {/* Lunch */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-gray-800">Lunch</h3>
                          <span className="text-xs font-medium text-gray-500 px-2 py-1 rounded-full bg-gray-100">
                            11:00 AM - 3:00 PM
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {dayMenu.lunch.map((item, index) => (
                            <div
                              key={index}
                              className="px-3 py-1.5 rounded-xl text-sm bg-gray-50 text-gray-700 border border-gray-200"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Dinner */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-gray-800">Dinner</h3>
                          <span className="text-xs font-medium text-gray-500 px-2 py-1 rounded-full bg-gray-100">
                            7:00 PM - 10:00 PM
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {dayMenu.dinner.map((item, index) => (
                            <div
                              key={index}
                              className="px-3 py-1.5 rounded-xl text-sm bg-gray-50 text-gray-700 border border-gray-200"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <UtensilsCrossed className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-500">Menu not available yet</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}