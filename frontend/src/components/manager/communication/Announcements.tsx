import { useState } from 'react';
import { ArrowLeft, Megaphone, Send, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { BottomNav } from '../BottomNav';

interface AnnouncementsProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

interface Announcement {
  id: number;
  message: string;
  time: string;
}

export function Announcements({ currentScreen, onNavigate, onBack }: AnnouncementsProps) {
  const [message, setMessage] = useState('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: 1, message: 'कल रविवार को मेस बंद रहेगी। कृपया अपना खाना पहले से तैयार कर लें।', time: '2 hours ago' },
    { id: 2, message: 'इस महीने की फीस 5 तारीख तक जमा करें। देर से जमा करने पर ₹100 जुर्माना।', time: 'Yesterday' },
    { id: 3, message: 'आज रात को विशेष व्यंजन - पनीर टिक्का मसाला और जीरा राइस।', time: '2 days ago' },
  ]);

  const templates = [
    'कल मेस बंद रहेगी',
    'फीस जमा करने की अंतिम तारीख',
    'आज विशेष व्यंजन',
    'समय में बदलाव'
  ];

  const sendAnnouncement = () => {
    if (!message.trim()) {
      toast.error('कृपया कोई संदेश लिखें');
      return;
    }

    const newAnnouncement: Announcement = {
      id: Date.now(),
      message: message,
      time: 'Just now'
    };

    setAnnouncements(prev => [newAnnouncement, ...prev]);
    setMessage('');
    toast.success('ऐलान सभी विद्यार्थियों को भेज दिया गया!');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #F1F8F4 0%, #FFFFFF 100%)' }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-4" style={{ 
        background: 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)',
        borderBottomLeftRadius: '24px',
        borderBottomRightRadius: '24px',
        boxShadow: '0 4px 20px rgba(11, 128, 67, 0.2)'
      }}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg active:scale-95 transition-transform"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white" style={{ fontSize: '1.25rem', fontWeight: '600' }}>ऐलान करें</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {/* Quick Templates */}
        <div className="mb-4">
          <h3 className="mb-2" style={{ fontSize: '0.875rem', fontWeight: '600', color: '#666' }}>Quick Templates</h3>
          <div className="flex flex-wrap gap-2">
            {templates.map((template) => (
              <button
                key={template}
                onClick={() => setMessage(template)}
                className="px-3 py-2 rounded-lg active:scale-95 transition-transform"
                style={{ background: 'white', fontSize: '0.875rem', border: '1px solid #E0E0E0' }}
              >
                {template}
              </button>
            ))}
          </div>
        </div>

        {/* Previous Announcements */}
        <div>
          <h3 className="mb-3 flex items-center gap-2" style={{ fontSize: '1rem', fontWeight: '600', color: '#333' }}>
            <Megaphone className="w-5 h-5" />
            पिछले ऐलान
          </h3>
          <div className="flex flex-col gap-3">
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl"
                style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
              >
                <p style={{ fontSize: '1rem', color: '#333', marginBottom: '0.5rem' }}>{announcement.message}</p>
                <div className="flex items-center gap-2" style={{ fontSize: '0.75rem', color: '#999' }}>
                  <Clock className="w-3 h-3" />
                  {announcement.time}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className="fixed bottom-20 left-0 right-0 p-4 pointer-events-none">
        <div className="max-w-[430px] mx-auto pointer-events-auto">
          <div className="p-3 rounded-2xl" style={{ background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="ऐलान लिखें..."
              className="w-full resize-none border-0 outline-none"
              style={{ fontSize: '1rem', minHeight: '80px' }}
              rows={3}
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t" style={{ borderColor: '#E0E0E0' }}>
              <div style={{ fontSize: '0.875rem', color: '#999' }}>
                सभी {150} विद्यार्थियों को भेजा जाएगा
              </div>
              <button
                onClick={sendAnnouncement}
                className="flex items-center gap-2 px-4 py-2 rounded-lg active:scale-95 transition-transform"
                style={{ background: '#2196F3', color: 'white', fontSize: '1rem', fontWeight: '600' }}
              >
                <Send className="w-4 h-4" />
                भेजो
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
    </div>
  );
}
