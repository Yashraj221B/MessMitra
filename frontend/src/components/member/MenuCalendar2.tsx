import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, UtensilsCrossed, Loader2 } from 'lucide-react';
import { format, addWeeks, subWeeks, startOfWeek, addDays, isToday as isDateToday } from 'date-fns';
import { toast } from 'sonner';
import { menuService } from '../../services';

interface MenuCalendarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

interface MenuItem {
  lunch: string[];
  dinner: string[];
  breakfast?: string[];
}

interface WeeklyMenu {
  [key: string]: MenuItem;
}

export function MenuCalendar2({ onBack }: MenuCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [menu, setMenu] = useState<WeeklyMenu>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMenuForWeek();
  }, [currentDate]);

  const loadMenuForWeek = async () => {
    try {
      setIsLoading(true);
      
      // Get current user and mess ID
      const currentUserStr = localStorage.getItem('current-user');
      if (!currentUserStr) {
        toast.error('Please login again');
        return;
      }

      const currentUser = JSON.parse(currentUserStr);
      if (!currentUser.messId) {
        toast.error('No mess associated with your account');
        return;
      }

      // Get the week dates
      const weekDates = getWeekDates();
      const startDate = format(weekDates[0], 'yyyy-MM-dd');

      // Fetch menu from backend
      const menuData = await menuService.getWeeklyMenu(
        currentUser.messId,
        startDate
      );

      // Transform menu data to our format
      const transformedMenu: WeeklyMenu = {};
      menuData.forEach((item: any) => {
        const dateKey = item.date;
        transformedMenu[dateKey] = {
          breakfast: item.breakfast ? item.breakfast.split(',').map((i: string) => i.trim()) : [],
          lunch: item.lunch ? item.lunch.split(',').map((i: string) => i.trim()) : [],
          dinner: item.dinner ? item.dinner.split(',').map((i: string) => i.trim()) : []
        };
      });

      setMenu(transformedMenu);
    } catch (error: any) {
      console.error('Error loading menu:', error);
      toast.error('Failed to load menu');
    } finally {
      setIsLoading(false);
    }
  };

  // Get dates for the week
  const getWeekDates = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const monday = startOfWeek(currentDate, { weekStartsOn: 1 });
      return addDays(monday, i);
    });
  };

  const weekDates = getWeekDates();

  // Get menu for a specific date
  const getMenuForDate = (date: Date) => {
    const key = format(date, 'yyyy-MM-dd');
    return menu[key] || { breakfast: [], lunch: [], dinner: [] };
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
      <div className="p-4 pb-24">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center mt-12">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading menu...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {weekDates.map(date => {
              const dayMenu = getMenuForDate(date);
              const isCurrentDay = isDateToday(date);
              const hasMenu = dayMenu.breakfast && dayMenu.breakfast.length > 0 || 
                             dayMenu.lunch && dayMenu.lunch.length > 0 || 
                             dayMenu.dinner && dayMenu.dinner.length > 0;

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
                    {hasMenu ? (
                      <div className="space-y-6">
                        {/* Breakfast */}
                        {dayMenu.breakfast && dayMenu.breakfast.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-medium text-gray-800">Breakfast</h3>
                              <span className="text-xs font-medium text-gray-500 px-2 py-1 rounded-full bg-gray-100">
                                7:00 AM - 10:00 AM
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {dayMenu.breakfast.map((item, index) => (
                                <div
                                  key={index}
                                  className="px-3 py-1.5 rounded-xl text-sm bg-amber-50 text-amber-700 border border-amber-200"
                                >
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Lunch */}
                        {dayMenu.lunch && dayMenu.lunch.length > 0 && (
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
                                  className="px-3 py-1.5 rounded-xl text-sm bg-green-50 text-green-700 border border-green-200"
                                >
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Dinner */}
                        {dayMenu.dinner && dayMenu.dinner.length > 0 && (
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
                                  className="px-3 py-1.5 rounded-xl text-sm bg-blue-50 text-blue-700 border border-blue-200"
                                >
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <UtensilsCrossed className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-500 text-sm">Menu not available yet</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
