import { useState, useEffect } from 'react';
import { ArrowLeft, UserCheck, UserX, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { BottomNav } from '../BottomNav';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getTranslation } from '../../../utils/translations';
import { BilingualText } from '../../BilingualText';
import storageService from '../../../services/storage.service';

interface AttendanceProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
  initialTab?: 'all' | 'present' | 'absent';
}

interface Student {
  id: number;
  name: string;
  room: string;
  phone: string;
  present: boolean;
  onLeave: boolean;
  mealCredits: number;
}

type AttendanceTab = 'all' | 'present' | 'absent';

export function AttendanceNew({ currentScreen, onNavigate, onBack, initialTab = 'all' }: AttendanceProps) {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<AttendanceTab>(initialTab || 'all');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Anjali Sharma', room: 'H1-201', phone: '+91 98765 43210', present: true, onLeave: false, mealCredits: 0 },
    { id: 2, name: 'Priya Patel', room: 'H1-202', phone: '+91 98765 43211', present: true, onLeave: false, mealCredits: 1 },
    { id: 3, name: 'Rahul Kumar', room: 'H2-101', phone: '+91 98765 43212', present: true, onLeave: true, mealCredits: 0 },
    { id: 4, name: 'Amit Singh', room: 'H2-102', phone: '+91 98765 43213', present: true, onLeave: false, mealCredits: 0 },
    { id: 5, name: 'Sneha Reddy', room: 'H1-203', phone: '+91 98765 43214', present: true, onLeave: false, mealCredits: 2 },
    { id: 6, name: 'Vikram Joshi', room: 'H3-301', phone: '+91 98765 43215', present: true, onLeave: true, mealCredits: 0 },
    { id: 7, name: 'Neha Gupta', room: 'H3-302', phone: '+91 98765 43216', present: true, onLeave: false, mealCredits: 0 },
    { id: 8, name: 'Rohan Verma', room: 'H2-103', phone: '+91 98765 43217', present: true, onLeave: false, mealCredits: 1 },
    { id: 9, name: 'Kavya Nair', room: 'H1-204', phone: '+91 98765 43218', present: true, onLeave: true, mealCredits: 0 },
    { id: 10, name: 'Arjun Mehta', room: 'H2-104', phone: '+91 98765 43219', present: true, onLeave: false, mealCredits: 0 },
  ]);

  const toggleAttendance = (id: number) => {
    if (activeTab !== 'all') return; // Only allow toggling in 'all' tab
    
    setStudents(prev => {
      const next = prev.map(s => s.id === id ? { ...s, present: !s.present } : s);
      // persist immediately
      try {
        storageService.setAttendanceData(next);
      } catch (e) {
        console.error('Failed to save attendance', e);
      }
      const presentCount = next.filter(s => s.present).length;
      const message = language === 'marathi'
        ? `${presentCount} उपस्थित` 
        : language === 'hindi'
        ? `${presentCount} उपस्थित`
        : `${presentCount} present`;
      toast.success(message);
      return next;
    });
  };

  // load attendance from storage on mount (if present)
  useEffect(() => {
    const stored = storageService.getAttendanceData();
    if (Array.isArray(stored) && stored.length) {
      setStudents(stored as Student[]);
    }
  }, []);

  const filteredStudents = students
    .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(s => {
      if (activeTab === 'present') return s.present;
      if (activeTab === 'absent') return !s.present;
      return true;
    });

  const presentCount = students.filter(s => s.present).length;
  const absentCount = students.length - presentCount;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #F1F8F4 0%, #FFFFFF 100%)' }}>
      {/* Modern Header */}
      <div className="px-4 pt-4 pb-4" style={{ 
        background: 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)',
        borderBottomLeftRadius: '24px',
        borderBottomRightRadius: '24px',
        boxShadow: '0 4px 20px rgba(11, 128, 67, 0.2)'
      }}>
        {/* Header with Title */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl active:scale-95 transition-all"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="flex-1 text-white text-center" style={{ fontSize: '1.35rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
            <BilingualText text={getTranslation(language, 'markAttendance')} />
          </h1>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <span className="text-2xl">✅</span>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between p-2 rounded-xl mx-2 mb-6" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <button 
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() - 1);
              setSelectedDate(newDate);
            }}
            className="p-2 rounded-lg active:scale-95 transition-all"
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
            className="p-2 rounded-lg active:scale-95 transition-all"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            <ArrowLeft className="w-4 h-4 text-white" style={{ transform: 'rotate(180deg)' }} />
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-2 px-2">
          <div className="flex-1 p-3 rounded-xl" style={{ 
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="flex items-center gap-2 text-white mb-1">
              <UserCheck className="w-4 h-4" />
              <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{getTranslation(language, 'present')}</span>
            </div>
            <div className="text-white" style={{ fontSize: '1.5rem', fontWeight: '700' }}>{presentCount}</div>
          </div>
          <div className="flex-1 p-3 rounded-xl" style={{ 
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="flex items-center gap-2 text-white mb-1">
              <UserX className="w-4 h-4" />
              <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>अनुपस्थित</span>
            </div>
            <div className="text-white" style={{ fontSize: '1.5rem', fontWeight: '700' }}>{absentCount}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.15)' }}>
          {(['all', 'present', 'absent'] as AttendanceTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 rounded-lg transition-all"
              style={{
                background: activeTab === tab ? 'white' : 'transparent',
                color: activeTab === tab ? '#0B8043' : 'white',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}
            >
              {tab === 'all' ? 'All' : tab === 'present' ? 'Present' : 'Absent'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex-1 overflow-y-auto p-4 pb-32"
        >
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#999' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="नाम खोजें..."
                className="w-full pl-10 pr-4 py-3.5 rounded-xl border-2 focus:outline-none transition-all"
                style={{ 
                  borderColor: searchQuery ? '#0B8043' : '#E8F5E9',
                  fontSize: '1rem',
                  background: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              />
            </div>
          </div>

          {/* Student List */}
          <div className="flex flex-col gap-2">
            {filteredStudents.map((student, index) => (
              <motion.button
                key={student.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => toggleAttendance(student.id)}
                className="flex items-center gap-3 p-4 rounded-3xl active:scale-[0.98] transition-all"
                style={{ 
                  background: 'white',
                  border: student.present ? '2px solid #C8E6C9' : '2px solid #E0E0E0',
                  boxShadow: student.present ? '0 4px 12px rgba(11, 128, 67, 0.1)' : '0 2px 8px rgba(0,0,0,0.04)',
                  cursor: activeTab === 'all' ? 'pointer' : 'default'
                }}
              >
                <div 
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ 
                    background: student.present 
                      ? 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)' 
                      : 'linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%)',
                    boxShadow: student.present ? '0 4px 12px rgba(11, 128, 67, 0.3)' : 'none'
                  }}
                >
                  <span style={{ fontSize: '1.2rem', color: 'white' }}>
                    {student.present ? '✓' : '👤'}
                  </span>
                </div>
                <div className="flex-1 text-left">
                  <div style={{ 
                    fontSize: '1rem', 
                    fontWeight: '600', 
                    color: student.present ? '#1C4532' : '#666',
                  }}>
                    {student.name}
                  </div>
                </div>
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ 
                    background: student.present ? '#E8F5E9' : '#FFEBEE'
                  }}
                >
                  {student.present ? (
                    <UserCheck className="w-4 h-4" style={{ color: '#0B8043' }} />
                  ) : (
                    <UserX className="w-4 h-4" style={{ color: '#D32F2F' }} />
                  )}
                </div>
              </motion.button>
            ))}

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <p style={{ fontSize: '1rem', color: '#999' }}>कोई विद्यार्थी नहीं मिला</p>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation */}
      <BottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
    </div>
  );
}