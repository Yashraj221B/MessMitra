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
  
  const mockWeeklyMenu: WeeklyMenu = {
    '2024-01-22': {
      lunch: ['Rice', 'Dal', 'Vegetable Curry'],
      dinner: ['Roti', 'Paneer', 'Rice']
    },
    '2024-01-23': {
      lunch: ['Pulao', 'Rajma', 'Salad'],
      dinner: ['Rice', 'Dal Tadka', 'Aloo Gobi']
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => 
      direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1)
    );
  };

  const getWeekDates = () => {
    const startDate = startOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  };

  const weekDates = getWeekDates();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex items-center justify-between p-4 bg-white shadow">
        <button onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Menu Calendar</h1>
        <div className="w-6" /> {/* Spacer for alignment */}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => navigateWeek('prev')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium">
            {format(weekDates[0], 'MMM d')} - {format(weekDates[6], 'MMM d, yyyy')}
          </span>
          <button 
            onClick={() => navigateWeek('next')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {weekDates.map((date) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const menu = mockWeeklyMenu[dateStr];
            const isCurrentDay = isDateToday(date);

            return (
              <div 
                key={dateStr}
                className={`p-4 bg-white rounded-lg shadow ${
                  isCurrentDay ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium">{format(date, 'EEEE')}</div>
                    <div className="text-sm text-gray-500">{format(date, 'MMM d')}</div>
                  </div>
                  {isCurrentDay && (
                    <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded">
                      Today
                    </span>
                  )}
                </div>

                {menu ? (
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">Lunch</div>
                      <div className="text-sm text-gray-800">
                        {menu.lunch.join(', ')}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-4 text-gray-400">
                    <UtensilsCrossed className="w-5 h-5 mr-2" />
                    <span className="text-sm">Menu not available</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
