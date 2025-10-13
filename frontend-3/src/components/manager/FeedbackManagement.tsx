import { useState } from 'react';
import { ArrowLeft, Star, MessageCircle, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FeedbackManagementProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

interface FeedbackItem {
  id: number;
  date: string;
  rating: number;
  category: string;
  comment: string;
  isAnonymous: boolean;
  status: 'new' | 'reviewed';
}

export function FeedbackManagement({ onBack }: FeedbackManagementProps) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>(() => {
    const stored = localStorage.getItem('mess-feedback');
    return stored ? JSON.parse(stored) : [];
  });

  const categories = [
    { id: 'all', label: 'सभी', sublabel: 'All' },
    { id: 'food', label: 'खाने की क्वालिटी', sublabel: 'Food Quality' },
    { id: 'service', label: 'सेवा', sublabel: 'Service' },
    { id: 'cleanliness', label: 'साफ-सफाई', sublabel: 'Cleanliness' },
    { id: 'other', label: 'अन्य', sublabel: 'Other' },
  ];

  const markAsReviewed = (id: number) => {
    const updatedList = feedbackList.map(item => 
      item.id === id ? { ...item, status: 'reviewed' as const } : item
    );
    setFeedbackList(updatedList);
    localStorage.setItem('mess-feedback', JSON.stringify(updatedList));
  };

  const filteredFeedback = feedbackList.filter(item => {
    const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
    const statusMatch = filterStatus === 'all' || item.status === filterStatus;
    return categoryMatch && statusMatch;
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
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className="px-3 py-1.5 rounded-xl whitespace-nowrap transition-all active:scale-95"
              style={{ 
                background: filterCategory === cat.id ? 'white' : 'rgba(255,255,255,0.15)',
                color: filterCategory === cat.id ? '#48C479' : 'white',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}
            >
              {cat.sublabel}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback List */}
      <div className="flex-1 overflow-y-auto pb-24 px-4">
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
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      item.status === 'new' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {item.status === 'new' ? 'New' : 'Reviewed'}
                    </span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <span className="inline-block px-2 py-1 rounded-lg text-sm" style={{ 
                    background: '#F1F8F4',
                    color: '#48C479'
                  }}>
                    {item.category}
                  </span>
                </div>

                <p className="text-gray-700 mb-3" style={{ fontSize: '0.9rem' }}>
                  {item.comment}
                </p>

                {item.status === 'new' && (
                  <button
                    onClick={() => markAsReviewed(item.id)}
                    className="w-full py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 active:scale-95 transition-all"
                  >
                    Mark as Reviewed
                  </button>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}