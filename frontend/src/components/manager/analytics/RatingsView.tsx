import { useState, useEffect } from 'react';
import { ArrowLeft, Star, TrendingUp, TrendingDown, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { BottomNav } from '../BottomNav';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RatingsViewProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

interface MealRating {
  mealType: 'breakfast' | 'lunch' | 'dinner';
  rating: number;
  comment?: string;
  timestamp: string;
}

export function RatingsView({ currentScreen, onNavigate, onBack }: RatingsViewProps) {
  const [selectedMeal, setSelectedMeal] = useState<'all' | 'breakfast' | 'lunch' | 'dinner'>('all');
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('today');
  const [ratings, setRatings] = useState<MealRating[]>([]);

  useEffect(() => {
    // Load ratings from localStorage (in production, this would be from backend)
    const allRatings = JSON.parse(localStorage.getItem('all-ratings') || '[]') as MealRating[];
    setRatings(allRatings);
  }, []);

  const filterRatings = (ratings: MealRating[]) => {
    let filtered = ratings;

    // Filter by time
    const now = new Date();
    if (timeFilter === 'today') {
      const today = now.toDateString();
      filtered = filtered.filter(r => new Date(r.timestamp).toDateString() === today);
    } else if (timeFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(r => new Date(r.timestamp) >= weekAgo);
    } else if (timeFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(r => new Date(r.timestamp) >= monthAgo);
    }

    // Filter by meal
    if (selectedMeal !== 'all') {
      filtered = filtered.filter(r => r.mealType === selectedMeal);
    }

    return filtered;
  };

  const filteredRatings = filterRatings(ratings);

  const calculateStats = (mealType?: string) => {
    const relevantRatings = mealType 
      ? filteredRatings.filter(r => r.mealType === mealType)
      : filteredRatings;

    if (relevantRatings.length === 0) {
      return { average: 0, total: 0, distribution: [0, 0, 0, 0, 0] };
    }

    const sum = relevantRatings.reduce((acc, r) => acc + r.rating, 0);
    const average = sum / relevantRatings.length;

    const distribution = [0, 0, 0, 0, 0];
    relevantRatings.forEach(r => {
      distribution[r.rating - 1]++;
    });

    return { average, total: relevantRatings.length, distribution };
  };

  const overallStats = calculateStats();
  const breakfastStats = calculateStats('breakfast');
  const lunchStats = calculateStats('lunch');
  const dinnerStats = calculateStats('dinner');

  const mealData = [
    { name: 'Breakfast', rating: breakfastStats.average, total: breakfastStats.total, color: '#FF9800' },
    { name: 'Lunch', rating: lunchStats.average, total: lunchStats.total, color: '#48C479' },
    { name: 'Dinner', rating: dinnerStats.average, total: dinnerStats.total, color: '#9C27B0' },
  ];

  const mealCards = [
    { type: 'breakfast' as const, name: 'नाश्ता', englishName: 'Breakfast', icon: '🌅', color: '#FF9800', bg: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)' },
    { type: 'lunch' as const, name: 'लंच', englishName: 'Lunch', icon: '☀️', color: '#48C479', bg: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)' },
    { type: 'dinner' as const, name: 'डिनर', englishName: 'Dinner', icon: '🌙', color: '#9C27B0', bg: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)' },
  ];

  const getStarColor = (avg: number) => {
    if (avg >= 4) return '#48C479';
    if (avg >= 3) return '#FF9800';
    return '#D32F2F';
  };

  const getTrendIcon = (avg: number) => {
    if (avg >= 4) return <TrendingUp className="w-4 h-4" style={{ color: '#48C479' }} />;
    if (avg >= 3) return <div className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" style={{ color: '#D32F2F' }} />;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #F1F8F4 0%, #FFFFFF 100%)' }}>
      {/* Modern Header */}
      <div className="px-4 pt-4 pb-4" style={{ 
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
              रेटिंग्स देखें
            </h1>
            <p className="text-white/80" style={{ fontSize: '0.85rem' }}>Food Ratings & Analytics</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <span className="text-2xl">📊</span>
          </div>
        </div>

        {/* Time Filter */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl" style={{ 
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          {(['today', 'week', 'month'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className="py-2 px-3 rounded-xl transition-all active:scale-95"
              style={{ 
                background: timeFilter === filter ? 'white' : 'transparent',
                color: timeFilter === filter ? '#0B8043' : 'white',
                fontSize: '0.8rem',
                fontWeight: '600',
                textTransform: 'capitalize'
              }}
            >
              {filter === 'today' ? 'आज • Today' : filter === 'week' ? 'हफ्ता • Week' : 'महीना • Month'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-28">
        {/* Overall Stats Card */}
        <div className="mb-6 p-5 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)',
          boxShadow: '0 8px 24px rgba(11, 128, 67, 0.3)'
        }}>
          <div 
            className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20"
            style={{ background: 'white' }}
          />
          
          <div className="relative z-10">
            <div className="text-white/80 mb-2" style={{ fontSize: '0.85rem', fontWeight: '600' }}>
              Overall Rating • कुल रेटिंग
            </div>
            <div className="flex items-end gap-4 mb-3">
              <div className="text-white" style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1' }}>
                {overallStats.average.toFixed(1)}
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-6 h-6"
                    style={{
                      color: '#FFB800',
                      fill: star <= Math.round(overallStats.average) ? '#FFB800' : 'transparent'
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="text-white/90" style={{ fontSize: '0.9rem' }}>
              Based on {overallStats.total} ratings
            </div>
          </div>
        </div>

        {/* Meal-wise Stats */}
        <h3 className="mb-3" style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1C4532' }}>
          Meal-wise Ratings
        </h3>

        <div className="flex flex-col gap-3 mb-6">
          {mealCards.map((meal) => {
            const stats = meal.type === 'breakfast' ? breakfastStats : meal.type === 'lunch' ? lunchStats : dinnerStats;
            
            return (
              <motion.button
                key={meal.type}
                onClick={() => setSelectedMeal(selectedMeal === meal.type ? 'all' : meal.type)}
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-xl text-left relative overflow-hidden"
                style={{ 
                  background: selectedMeal === meal.type ? meal.bg : 'white',
                  border: `2px solid ${selectedMeal === meal.type ? meal.color : '#E8F5E9'}`,
                  boxShadow: selectedMeal === meal.type ? `0 4px 12px ${meal.color}30` : '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                {/* Decorative circle */}
                <div 
                  className="absolute -top-8 -right-8 w-20 h-20 rounded-full opacity-20"
                  style={{ background: meal.color }}
                />

                <div className="flex items-center gap-4 relative z-10">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ 
                      background: 'white',
                      boxShadow: `0 4px 12px ${meal.color}30`
                    }}
                  >
                    <span style={{ fontSize: '2rem' }}>{meal.icon}</span>
                  </div>

                  <div className="flex-1">
                    <div style={{ fontSize: '1.05rem', fontWeight: '700', color: meal.color, marginBottom: '4px' }}>
                      {meal.name} • {meal.englishName}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star
                          className="w-4 h-4"
                          style={{
                            color: getStarColor(stats.average),
                            fill: getStarColor(stats.average)
                          }}
                        />
                        <span style={{ fontSize: '1.1rem', fontWeight: '700', color: getStarColor(stats.average) }}>
                          {stats.average > 0 ? stats.average.toFixed(1) : 'N/A'}
                        </span>
                      </div>
                      {stats.average > 0 && getTrendIcon(stats.average)}
                      <span style={{ fontSize: '0.85rem', color: '#999', marginLeft: 'auto' }}>
                        {stats.total} ratings
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Chart */}
        {overallStats.total > 0 && (
          <div className="mb-6 p-5 rounded-2xl" style={{ 
            background: 'white',
            border: '2px solid #E8F5E9',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <h3 className="mb-4" style={{ fontSize: '1rem', fontWeight: '700', color: '#1C4532' }}>
              Average Ratings Chart
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mealData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '2px solid #E8F5E9', 
                    borderRadius: '8px',
                    fontSize: '0.85rem'
                  }}
                />
                <Bar dataKey="rating" radius={[8, 8, 0, 0]}>
                  {mealData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Comments */}
        {filteredRatings.filter(r => r.comment).length > 0 && (
          <div>
            <h3 className="mb-3 flex items-center gap-2" style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1C4532' }}>
              <MessageSquare className="w-5 h-5" />
              Recent Comments
            </h3>

            <div className="flex flex-col gap-3">
              {filteredRatings
                .filter(r => r.comment)
                .slice(0, 10)
                .map((rating, index) => {
                  const meal = mealCards.find(m => m.type === rating.mealType);
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-xl"
                      style={{ 
                        background: 'white',
                        border: '2px solid #E8F5E9',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: '1.2rem' }}>{meal?.icon}</span>
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: meal?.color }}>
                              {meal?.englishName}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#999' }}>
                              {new Date(rating.timestamp).toLocaleDateString('en-IN', { 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="w-3.5 h-3.5"
                              style={{
                                color: star <= rating.rating ? '#FFB800' : '#E0E0E0',
                                fill: star <= rating.rating ? '#FFB800' : 'transparent'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.5' }}>
                        "{rating.comment}"
                      </p>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        )}

        {/* No Ratings */}
        {overallStats.total === 0 && (
          <div className="text-center py-12">
            <span style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>📊</span>
            <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#999', marginBottom: '0.5rem' }}>
              No ratings yet
            </div>
            <p style={{ fontSize: '0.9rem', color: '#999' }}>
              Ratings will appear here once students start rating meals
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
    </div>
  );
}
