import { useState, useEffect } from 'react';
import { ArrowLeft, Star, MessageCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { feedbackService } from '../../services';

interface FeedbackManagementProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

interface FeedbackItem {
  id: string;
  userId: string;
  messId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  rating: number;
  comment?: string;
  date: string;
  createdAt: string;
  userName?: string;
}

export function FeedbackManagement({ onBack }: FeedbackManagementProps) {
  const [filterMealType, setFilterMealType] = useState<'all' | 'breakfast' | 'lunch' | 'dinner'>('all');
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const mealTypes = [
    { id: 'all', label: 'सभी', sublabel: 'All' },
    { id: 'breakfast', label: 'नाश्ता', sublabel: 'Breakfast' },
    { id: 'lunch', label: 'दोपहर का खाना', sublabel: 'Lunch' },
    { id: 'dinner', label: 'रात का खाना', sublabel: 'Dinner' },
  ];

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
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
      
      // Fetch feedback from backend
      const feedback = await feedbackService.getMessRatings(currentUser.messId);
      setFeedbackList(feedback);
    } catch (error: any) {
      console.error('Error loading feedback:', error);
      toast.error('Failed to load feedback');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFeedback = feedbackList.filter(item => {
    const mealMatch = filterMealType === 'all' || item.mealType === filterMealType;
    return mealMatch;
  });

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
              सदस्य फीडबैक
            </h1>
            <p className="text-white/80" style={{ fontSize: '0.85rem' }}>Member Feedback</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-2 overflow-x-auto py-2 hide-scrollbar">
          {mealTypes.map(meal => (
            <button
              key={meal.id}
              onClick={() => setFilterMealType(meal.id as any)}
              className="px-3 py-1.5 rounded-xl whitespace-nowrap transition-all active:scale-95"
              style={{ 
                background: filterMealType === meal.id ? 'white' : 'rgba(255,255,255,0.15)',
                color: filterMealType === meal.id ? '#48C479' : 'white',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}
            >
              {meal.sublabel}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback List */}
      <div className="flex-1 overflow-y-auto pb-24 px-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center mt-12 text-center px-6">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
            <h3 className="text-gray-600 mb-2" style={{ fontSize: '1.1rem', fontWeight: '600' }}>Loading feedback...</h3>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredFeedback.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center mt-12 text-center px-6"
              >
                <div className="w-16 h-16 mb-4 rounded-full flex items-center justify-center" style={{ background: '#F1F8F4' }}>
                  <MessageCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-gray-600 mb-2" style={{ fontSize: '1.1rem', fontWeight: '600' }}>कोई फीडबैक नहीं मिला</h3>
                <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>No feedback found for selected filters</p>
              </motion.div>
            ) : (
              filteredFeedback.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="mb-3 p-4 rounded-2xl bg-white shadow-sm border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4"
                            style={{ 
                              fill: i < item.rating ? '#FFB800' : 'none',
                              stroke: i < item.rating ? '#FFB800' : '#D1D5DB',
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-gray-500" style={{ fontSize: '0.8rem' }}>
                        {new Date(item.date).toLocaleDateString('en-IN', { 
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-600 capitalize">
                        {item.mealType}
                      </span>
                    </div>
                  </div>
                  
                  {item.userName && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-600 font-medium">
                        By: {item.userName}
                      </span>
                    </div>
                  )}

                  {item.comment && (
                    <p className="text-gray-700 mb-2" style={{ fontSize: '0.9rem' }}>
                      {item.comment}
                    </p>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
