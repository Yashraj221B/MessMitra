import { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
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
  const { language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [message, setMessage] = useState('');
  const defaultAnnouncements: Record<string, Announcement[]> = {
    marathi: [
      { id: 1, message: 'उद्या रविवारी मेस बंद राहील. कृपया तुमचे जेवण आधीच तयार ठेवा.', time: '2 hours ago' },
      { id: 2, message: 'या महिन्याची फी 5 तारखेपर्यंत जमा करा. उशिर झाल्यास दंड लागेल.', time: 'Yesterday' },
      { id: 3, message: 'आज रात्री विशेष पदार्थ - पनीर टिक्का मसाला आणि जीरा भात.', time: '2 days ago' },
    ],
    hindi: [
      { id: 1, message: 'कल रविवार को मेस बंद रहेगा। कृपया अपना खाना पहले से तैयार रखें।', time: '2 hours ago' },
      { id: 2, message: 'इस महीने की फीस 5 तारीख तक जमा करें। देर से जमा करने पर जुर्माना लगेगा।', time: 'Yesterday' },
      { id: 3, message: 'आज रात को विशेष व्यंजन - पनीर टिक्का मसाला और जीरा राइस।', time: '2 days ago' },
    ],
    english: [
      { id: 1, message: 'Mess will be closed tomorrow (Sunday). Please plan your meals accordingly.', time: '2 hours ago' },
      { id: 2, message: 'This month\'s fees are due by the 5th. Late payments may incur a fine.', time: 'Yesterday' },
      { id: 3, message: 'Special tonight - Paneer Tikka Masala with Jeera Rice.', time: '2 days ago' },
    ]
  };

  const templatesByLang: Record<string, string[]> = {
    marathi: ['उद्या मेस बंद राहील', 'फी भरायची अंतिम तारीख', 'आजचा विशेष पदार्थ', 'वेळेत बदल'],
    hindi: ['कल मेस बंद रहेगा', 'फीस जमा करने की अंतिम तारीख', 'आज विशेष व्यंजन', 'समय में बदलाव'],
    english: ['Mess closed tomorrow', 'Fee due date', 'Today\'s special', 'Timing change']
  };

  const [announcements, setAnnouncements] = useState<Announcement[]>(defaultAnnouncements[language] || defaultAnnouncements.english);
  const templates = templatesByLang[language] || templatesByLang.english;

  const sendAnnouncement = () => {
    if (!message.trim()) {
      toast.error(language === 'marathi' ? 'कृपया एखादा संदेश लिहा' : language === 'hindi' ? 'कृपया कोई संदेश लिखें' : 'Please write a message');
      return;
    }

    const newAnnouncement: Announcement = {
      id: Date.now(),
      message: message,
      time: 'Just now'
    };

    setAnnouncements(prev => [newAnnouncement, ...prev]);
    setMessage('');
    toast.success(language === 'marathi' ? 'संदेश सर्व सदस्यांना पाठविला गेला!' : language === 'hindi' ? 'ऐलान सभी सदस्यों को भेज दिया गया!' : 'Announcement sent to all members!');
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
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg active:scale-95 transition-transform"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white" style={{ fontSize: '1.25rem', fontWeight: '600' }}>ऐलान करें</h1>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <button 
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() - 1);
              setSelectedDate(newDate);
            }}
            className="p-2 rounded-lg active:scale-95 transition-transform"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <div className="text-white text-center">
            <div style={{ fontSize: '1rem', fontWeight: '600' }}>
              {selectedDate.toLocaleDateString('en-IN', { weekday: 'long' })}
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
              {selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <button 
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() + 1);
              setSelectedDate(newDate);
            }}
            className="p-2 rounded-lg active:scale-95 transition-transform"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            <ArrowLeft className="w-4 h-4 text-white" style={{ transform: 'rotate(180deg)' }} />
          </button>
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
