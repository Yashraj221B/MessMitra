import { useState } from 'react';
import { ArrowLeft, Star, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { MemberBottomNav } from './MemberBottomNav';

interface FeedbackProps {
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
  status: 'submitted' | 'reviewed';
}

export function Feedback({ currentScreen, onNavigate, onBack }: FeedbackProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState('');
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [feedbackHistory] = useState<FeedbackItem[]>([
    { id: 1, date: '2025-10-05', rating: 5, category: 'Food Quality', comment: 'Excellent taste!', status: 'reviewed', isAnonymous: false },
    { id: 2, date: '2025-10-01', rating: 4, category: 'Service', comment: 'Good service', status: 'reviewed', isAnonymous: true },
  ]);

  const categories = [
    { id: 'food', label: 'Food Quality', sublabel: 'Taste, portion size, variety', icon: '🍽️', color: '#48C479' },
    { id: 'service', label: 'Service', sublabel: 'Staff behavior, timely service', icon: '🤝', color: '#FF9800' },
    { id: 'cleanliness', label: 'Cleanliness', sublabel: 'Hygiene and sanitation', icon: '✨', color: '#2196F3' },
    { id: 'other', label: 'Other', sublabel: 'Any other feedback', icon: '💬', color: '#9C27B0' },
  ];

  const handleSubmit = () => {
    if (!rating) {
      toast.error('Please provide a rating!');
      return;
    }
    if (!category) {
      toast.error('Please select a category!');
      return;
    }

    // Save feedback to localStorage
    const feedback = {
      id: Date.now(),
      date: new Date().toISOString(),
      rating,
      category,
      comment,
      isAnonymous,
      status: 'new' as const
    };

    const existingFeedback = JSON.parse(localStorage.getItem('mess-feedback') || '[]');
    localStorage.setItem('mess-feedback', JSON.stringify([...existingFeedback, feedback]));

    toast.success('Feedback submitted successfully! Thank you 🎉');
    setRating(0);
    setCategory('');
    setComment('');
    setIsAnonymous(false);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #F1F8F4 0%, #FFFFFF 100%)' }}>
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
              Share Feedback
            </h1>
            <p className="text-white/80" style={{ fontSize: '0.85rem' }}>Help us improve</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <span className="text-2xl">⭐</span>
          </div>
        </div>

        {/* Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl" style={{ 
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <button
            onClick={() => setShowHistory(false)}
            className="py-2 px-3 rounded-xl transition-all active:scale-95"
            style={{ 
              background: !showHistory ? 'white' : 'transparent',
              color: !showHistory ? '#48C479' : 'white',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}
          >
            New Feedback
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className="py-2 px-3 rounded-xl transition-all active:scale-95"
            style={{ 
              background: showHistory ? 'white' : 'transparent',
              color: showHistory ? '#48C479' : 'white',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}
          >
            History
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {!showHistory ? (
          <motion.div 
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 overflow-y-auto p-4 pb-28"
          >
            <h3 className="mb-4" style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1C4532' }}>
              Share Your Feedback
            </h3>

            {/* Category Selection */}
            <div className="mb-6">
              <h3 className="mb-3" style={{ fontSize: '1rem', fontWeight: '700', color: '#1C4532' }}>
                Feedback Category
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <motion.button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    whileTap={{ scale: 0.97 }}
                    className="p-4 rounded-xl active:scale-95 transition-all"
                    style={{ 
                      background: category === cat.id 
                        ? `linear-gradient(135deg, ${cat.color}15 0%, ${cat.color}30 100%)`
                        : 'white',
                      border: category === cat.id ? `2px solid ${cat.color}` : '2px solid #E8F5E9',
                      boxShadow: category === cat.id ? `0 4px 12px ${cat.color}30` : '0 2px 8px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '6px' }}>{cat.icon}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: category === cat.id ? cat.color : '#1C4532', marginBottom: '2px' }}>
                      {cat.label}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#999' }}>
                      {cat.sublabel}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Comment Section */}
            <div className="mb-6">
              <h3 className="mb-3" style={{ fontSize: '1rem', fontWeight: '700', color: '#1C4532' }}>
                Write Your Comment
              </h3>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your feedback here... (Optional)"
                className="w-full p-4 rounded-xl border-2 resize-none focus:outline-none transition-all"
                style={{ 
                  borderColor: comment ? '#48C479' : '#E8F5E9',
                  fontSize: '1rem',
                  minHeight: '120px',
                  background: 'white'
                }}
                rows={5}
              />
              <div className="mt-2" style={{ fontSize: '0.8rem', color: '#999' }}>
                {comment.length}/500 characters
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full py-4 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              style={{ 
                background: 'linear-gradient(135deg, #48C479 0%, #23AE5F 100%)',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '700',
                boxShadow: '0 4px 12px rgba(72, 196, 121, 0.3)'
              }}
            >
              <Send className="w-5 h-5" />
              Submit Feedback
            </button>

            {/* Info Card */}
            <div className="mt-6 p-4 rounded-xl" style={{ 
              background: 'linear-gradient(135deg, #FFF9E6 0%, #FFF3D6 100%)',
              border: '1.5px solid #FFE082'
            }}>
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">💡</span>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#F57C00', marginBottom: '4px' }}>
                    Your opinion matters!
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.6' }}>
                    Your feedback helps us improve the mess services. We review all feedback daily and work on making things better! ���
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 overflow-y-auto p-4 pb-28"
          >
            <h3 className="mb-4" style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1C4532' }}>
              Feedback History
            </h3>

            <div className="flex flex-col gap-3">
              {feedbackHistory.map((feedback, index) => (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-xl"
                  style={{ 
                    background: 'white',
                    border: '2px solid #E8F5E9',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#999', marginBottom: '4px' }}>
                        {new Date(feedback.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1C4532' }}>
                        {feedback.category}
                      </div>
                    </div>
                    <div 
                      className="px-2.5 py-1 rounded-lg"
                      style={{ 
                        background: feedback.status === 'reviewed' ? '#E8F5E9' : '#FFF3E0',
                        color: feedback.status === 'reviewed' ? '#48C479' : '#FF9800',
                        fontSize: '0.7rem',
                        fontWeight: '700'
                      }}
                    >
                      {feedback.status === 'reviewed' ? '✓ Reviewed' : '⏱ Pending'}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4"
                        style={{
                          color: star <= feedback.rating ? '#FFB800' : '#E0E0E0',
                          fill: star <= feedback.rating ? '#FFB800' : 'transparent'
                        }}
                      />
                    ))}
                  </div>

                  <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    {feedback.comment}
                  </p>
                </motion.div>
              ))}
            </div>

            {feedbackHistory.length === 0 && (
              <div className="text-center py-12">
                <span style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>⭐</span>
                <p style={{ fontSize: '1rem', color: '#999' }}>No feedback history yet</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <MemberBottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
    </div>
  );
}
