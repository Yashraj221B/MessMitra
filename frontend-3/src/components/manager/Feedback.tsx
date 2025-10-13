import { useState } from 'react';
import { motion } from 'motion/react';
import { BilingualText } from '../BilingualText';
import { useLanguage } from '../../contexts/LanguageContext';
import { getTranslation } from '../../utils/translations';
import storageService from '../../services/storage.service';

interface FeedbackItem {
  id: number;
  name: string;
  category: string;
  comment: string;
  date: string;
  status: 'pending' | 'reviewed';
}

export function Feedback(_: { currentScreen?: string; onNavigate?: (s: string) => void; onBack?: () => void }) {
  const { language } = useLanguage();
  const [items, setItems] = useState<FeedbackItem[]>(() => {
    // load sample or stored feedback
    const stored = storageService.getNotifications();
    if (Array.isArray(stored) && stored.length) {
      // coerce statuses to the union type
      const mapped = (stored as any[]).map((s, i) => ({
        id: s.id ?? i + 1,
        name: s.name ?? 'Anonymous',
        category: s.category ?? 'General',
        comment: s.comment ?? s.message ?? 'No message',
        date: s.date ?? new Date().toISOString(),
        status: (s.status === 'reviewed') ? 'reviewed' : 'pending'
      }));
      return mapped as FeedbackItem[];
    }
    return [
      { id: 1, name: 'Anjali Sharma', category: 'Food', comment: 'Food was cold today', date: new Date().toISOString(), status: 'pending' },
      { id: 2, name: 'Rahul Kumar', category: 'Cleanliness', comment: 'Dining area needs cleaning', date: new Date().toISOString(), status: 'pending' }
    ];
  });

  const markReviewed = (id: number) => {
    const next = items.map(i => i.id === id ? { ...i, status: 'reviewed' } : i) as FeedbackItem[];
    setItems(next);
    // store for manager history
    storageService.setNotifications(next as any);
  };

  return (
    <div className="min-h-screen p-4" style={{ background: '#FAFBFC' }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
            <BilingualText text={getTranslation(language, 'feedback') || 'Feedback / Complaints'} />
          </h2>
          <p style={{ color: '#6B7280', marginTop: 6 }}>{'Review and respond to user feedback'}</p>
        </div>

        <div className="flex flex-col gap-3">
          {items.map(item => (
            <motion.div key={item.id} className="p-4 rounded-xl" style={{ background: item.status === 'reviewed' ? '#E8F5E9' : 'white', border: '1px solid #E5E7EB' }}>
              <div className="flex items-start justify-between">
                <div>
                  <div style={{ fontWeight: 700 }}>{item.name} <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 600 }}>{item.category}</span></div>
                  <div style={{ marginTop: 6, color: '#374151' }}>{item.comment}</div>
                  <div style={{ marginTop: 8, fontSize: '0.8rem', color: '#6B7280' }}>{new Date(item.date).toLocaleString()}</div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => markReviewed(item.id)} className="px-3 py-1 rounded-lg" style={{ background: item.status === 'reviewed' ? '#E0F2F1' : '#FFE0B2', fontWeight: 700 }}>
                    {item.status === 'reviewed' ? 'Reviewed' : 'Mark Reviewed'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-12">
              <p style={{ color: '#9CA3AF' }}>No feedback yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
