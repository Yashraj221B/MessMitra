import { useState } from 'react';
import { ArrowLeft, Star, ChefHat, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { MemberBottomNav } from './MemberBottomNav';

interface FoodRatingProps {
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

export function FoodRating({ currentScreen, onNavigate, onBack }: FoodRatingProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Get today's ratings from localStorage
  const getTodayRatings = (): MealRating[] => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem(`ratings-${today}`);
    return stored ? JSON.parse(stored) : [];
  };

  const [todayRatings, setTodayRatings] = useState<MealRating[]>(getTodayRatings());

  // Date navigation
  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    if (newDate <= new Date()) {
      setSelectedDate(newDate);
    }
  };

  const meals = [
    {
      type: 'lunch' as const,
      name: 'Lunch',
      englishName: 'Lunch',
      icon: '☀️',
      time: '12:00 - 2:00 PM',
      menu: 'Roti, Dal, Rice, Sabzi',
      color: '#48C479',
      bg: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)'
    },
    {
      type: 'dinner' as const,
      name: 'Dinner',
      englishName: 'Dinner',
      icon: '🌙',
      time: '7:00 - 9:00 PM',
      menu: 'Paratha, Paneer, Curd',
      color: '#9C27B0',
      bg: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)'
    }
  ];

  const quickResponses = [
    { icon: '😍', label: 'Excellent', value: 5 },
    { icon: '😊', label: 'Good', value: 4 },
    { icon: '😐', label: 'Average', value: 3 },
    { icon: '😕', label: 'Poor', value: 2 },
    { icon: '😞', label: 'Bad', value: 1 }
  ];

  const hasRatedMeal = (mealType: string) => {
    return todayRatings.some(r => r.mealType === mealType);
  };

  const handleSubmitRating = () => {
    if (!selectedMeal || rating === 0) {
      toast.error('Please provide a rating!');
      return;
    }

    const newRating: MealRating = {
      mealType: selectedMeal,
      rating,
      comment: comment.trim() || undefined,
      timestamp: new Date().toISOString()
    };

    // Save to localStorage (for demo - in production this would go to backend)
    const today = new Date().toDateString();
    const updatedRatings = [...todayRatings, newRating];
    localStorage.setItem(`ratings-${today}`, JSON.stringify(updatedRatings));
    
    // Also save to global ratings for admin view
    const allRatings = JSON.parse(localStorage.getItem('all-ratings') || '[]');
    allRatings.push(newRating);
    localStorage.setItem('all-ratings', JSON.stringify(allRatings));

    setTodayRatings(updatedRatings);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedMeal(null);
      setRating(0);
      setComment('');
      toast.success('Rating submitted successfully! Thank you 🎉');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: '#FAFBFC' }}>
      {/* Bottom Navigation - Moved to top of DOM for z-index priority */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <MemberBottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
      </div>

      {/* Modern Header */}
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
              Food Rating
            </h1>
            <p className="text-white/80" style={{ fontSize: '0.85rem' }}>Rate today's meals</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <span className="text-2xl">🍽️</span>
          </div>
        </div>

        {/* Date Selection */}
        <div className="flex items-center justify-between mt-2 p-2 rounded-xl" style={{ 
          background: 'rgba(255,255,255,0.15)', 
          backdropFilter: 'blur(10px)'
        }}>
          <button 
            onClick={handlePrevDay}
            className="p-2 rounded-lg active:scale-95 transition-all"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <div className="text-white text-center">
            <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
              {selectedDate.toLocaleDateString('en-IN', { weekday: 'long' })}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
              {selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </div>
          </div>
          <button 
            onClick={handleNextDay}
            className="p-2 rounded-lg active:scale-95 transition-all"
            style={{ 
              background: 'rgba(255,255,255,0.15)',
              opacity: selectedDate.getTime() >= new Date().setHours(0,0,0,0) ? 0.5 : 1,
              pointerEvents: selectedDate.getTime() >= new Date().setHours(0,0,0,0) ? 'none' : 'auto'
            }}
          >
            <ArrowLeft className="w-4 h-4 text-white rotate-180" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-28">
        <AnimatePresence mode="wait">
          {!selectedMeal ? (
            <motion.div
              key="meal-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3 className="mb-4" style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1C4532' }}>
                Select Meal to Rate
              </h3>

              <div className="flex flex-col gap-3">
                {meals.map((meal, index) => {
                  const alreadyRated = hasRatedMeal(meal.type);
                  
                  return (
                    <motion.button
                      key={meal.type}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => !alreadyRated && setSelectedMeal(meal.type)}
                      disabled={alreadyRated}
                      className="p-4 rounded-xl text-left relative overflow-hidden transition-all"
                      style={{ 
                        background: alreadyRated ? '#F5F5F5' : meal.bg,
                        border: `2px solid ${alreadyRated ? '#E0E0E0' : meal.color}20`,
                        boxShadow: alreadyRated ? 'none' : '0 4px 12px rgba(0,0,0,0.08)',
                        opacity: alreadyRated ? 0.6 : 1,
                        cursor: alreadyRated ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {/* Decorative circle */}
                      <div 
                        className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20"
                        style={{ background: meal.color }}
                      />

                      <div className="flex items-start gap-4 relative z-10">
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ 
                            background: alreadyRated ? '#E0E0E0' : 'white',
                            boxShadow: `0 4px 12px ${meal.color}30`
                          }}
                        >
                          <span style={{ fontSize: '2rem' }}>{meal.icon}</span>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div style={{ fontSize: '1.15rem', fontWeight: '700', color: alreadyRated ? '#999' : meal.color }}>
                              {meal.englishName}
                            </div>
                            {alreadyRated && (
                              <div 
                                className="px-2.5 py-1 rounded-lg flex items-center gap-1"
                                style={{ 
                                  background: '#E8F5E9',
                                  fontSize: '0.7rem',
                                  fontWeight: '700',
                                  color: '#48C479'
                                }}
                              >
                                ✓ Rated
                              </div>
                            )}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '6px' }}>
                            {meal.time}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: '#999' }}>
                            {meal.menu}
                          </div>
                        </div>

                        {!alreadyRated && (
                          <ChefHat className="w-5 h-5" style={{ color: meal.color }} />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Info Card */}
              <div className="mt-6 p-4 rounded-xl" style={{ 
                background: 'linear-gradient(135deg, #FFF9E6 0%, #FFF3D6 100%)',
                border: '1.5px solid #FFE082'
              }}>
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">🔒</span>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#F57C00', marginBottom: '4px' }}>
                      Anonymous Feedback
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.6' }}>
                      Your ratings are completely anonymous. Only ratings and comments are shared with the mess owner to improve food quality.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="rating-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Selected Meal Card */}
              <div className="mb-6 p-5 rounded-2xl" style={{ 
                background: meals.find(m => m.type === selectedMeal)?.bg,
                border: `2px solid ${meals.find(m => m.type === selectedMeal)?.color}30`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}>
                <div className="flex items-center gap-3 mb-2">
                  <span style={{ fontSize: '2.5rem' }}>
                    {meals.find(m => m.type === selectedMeal)?.icon}
                  </span>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: meals.find(m => m.type === selectedMeal)?.color }}>
                      {meals.find(m => m.type === selectedMeal)?.englishName}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                      {meals.find(m => m.type === selectedMeal)?.time}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Rating */}
              <div className="mb-6">
                <h3 className="mb-3 text-center" style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1C4532' }}>
                  How was it?
                </h3>

                <div className="flex justify-center gap-3 mb-4">
                  {quickResponses.map((response) => (
                    <motion.button
                      key={response.value}
                      onClick={() => setRating(response.value)}
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.1 }}
                      className="flex flex-col items-center gap-1 transition-all"
                    >
                      <div 
                        className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
                        style={{
                          background: rating === response.value ? 'linear-gradient(135deg, #48C479 0%, #23AE5F 100%)' : 'white',
                          border: rating === response.value ? '2px solid #48C479' : '2px solid #E0E0E0',
                          boxShadow: rating === response.value ? '0 4px 12px rgba(72, 196, 121, 0.3)' : '0 2px 6px rgba(0,0,0,0.05)'
                        }}
                      >
                        <span style={{ fontSize: '1.8rem' }}>{response.icon}</span>
                      </div>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: '600',
                        color: rating === response.value ? '#48C479' : '#999'
                      }}>
                        {response.label}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Star Rating */}
                <div className="flex justify-center gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <Star
                        className="w-10 h-10"
                        style={{
                          color: star <= (hoverRating || rating) ? '#FFB800' : '#E0E0E0',
                          fill: star <= (hoverRating || rating) ? '#FFB800' : 'transparent',
                          strokeWidth: 2
                        }}
                      />
                    </motion.button>
                  ))}
                </div>

                {rating > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <span style={{ fontSize: '1rem', fontWeight: '600', color: '#48C479' }}>
                      {rating === 5 ? 'Excellent! 🌟' : rating === 4 ? 'Very Good! 👍' : rating === 3 ? 'Good 😊' : rating === 2 ? 'Okay 😐' : 'Needs Improvement 😕'}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Comment */}
              <div className="mb-6">
                <h3 className="mb-3" style={{ fontSize: '1rem', fontWeight: '700', color: '#1C4532' }}>
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Any Comments? (Optional)
                </h3>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you liked or what can be improved..."
                  className="w-full p-4 rounded-xl border-2 resize-none focus:outline-none transition-all"
                  style={{ 
                    borderColor: comment ? '#48C479' : '#E8F5E9',
                    fontSize: '1rem',
                    minHeight: '100px',
                    background: 'white'
                  }}
                  rows={4}
                  maxLength={300}
                />
                <div className="mt-2 text-right" style={{ fontSize: '0.75rem', color: '#999' }}>
                  {comment.length}/300
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedMeal(null);
                    setRating(0);
                    setComment('');
                  }}
                  className="px-6 py-3.5 rounded-xl active:scale-95 transition-all"
                  style={{ 
                    background: 'white',
                    color: '#666',
                    fontSize: '1rem',
                    fontWeight: '700',
                    border: '2px solid #E0E0E0'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRating}
                  disabled={rating === 0}
                  className="flex-1 py-3.5 rounded-xl active:scale-95 transition-all"
                  style={{ 
                    background: rating === 0 ? '#E0E0E0' : 'linear-gradient(135deg, #48C479 0%, #23AE5F 100%)',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: rating === 0 ? 'not-allowed' : 'pointer',
                    opacity: rating === 0 ? 0.5 : 1
                  }}
                >
                  Submit Rating
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Animation */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.5)' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="p-8 rounded-3xl text-center"
                style={{ 
                  background: 'white',
                  maxWidth: '300px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                  style={{ fontSize: '4rem', marginBottom: '1rem' }}
                >
                  ✅
                </motion.div>
                <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#48C479', marginBottom: '0.5rem' }}>
                  Thank You!
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  Your feedback has been submitted
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom spacing for navigation bar */}
      <div className="h-20"></div>
    </div>
  );
}
