import { useState, useEffect } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { BottomNav } from '../BottomNav';
import { useLanguage } from '../../../contexts/LanguageContext';
import storageService from '../../../services/storage.service';

interface AttendanceProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

interface Student {
  id: number;
  name: string;
  room: string;
  present: boolean;
}

export function Attendance({ currentScreen, onNavigate, onBack }: AttendanceProps) {
  const { language } = useLanguage();
  // Always manual mode now
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Anjali Sharma', room: 'H1-201', present: true },
    { id: 2, name: 'Priya Patel', room: 'H1-202', present: true },
    { id: 3, name: 'Rahul Kumar', room: 'H2-101', present: false },
    { id: 4, name: 'Amit Singh', room: 'H2-102', present: true },
    { id: 5, name: 'Sneha Reddy', room: 'H1-203', present: true },
    { id: 6, name: 'Vikram Joshi', room: 'H3-301', present: false },
    { id: 7, name: 'Neha Gupta', room: 'H3-302', present: true },
    { id: 8, name: 'Rohan Verma', room: 'H2-103', present: true },
    { id: 9, name: 'Kavya Nair', room: 'H1-204', present: false },
    { id: 10, name: 'Arjun Mehta', room: 'H2-104', present: true },
  ]);

  const toggleAttendance = (id: number) => {
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

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const presentCount = students.filter(s => s.present).length;
  const absentCount = students.length - presentCount; // Used in the UI

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #F1F8F4 0%, #FFFFFF 100%)' }}>
      {/* Modern Header */}
      <div className="px-4 pt-4 pb-4" style={{ 
        background: 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)',
      }}>
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl active:scale-95 transition-all"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white mb-1" style={{ fontSize: '1.25rem', fontWeight: '700' }}>
              हजेरी लावा
            </h1>
            {/* Date display */}
            <div className="text-white/80 text-sm">
              {new Date().toLocaleDateString('hi-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </div>
          <div className="flex gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-white text-center">
              <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>7</div>
              <div style={{ fontSize: '0.75rem' }}>उपस्थित</div>
            </div>
            <div className="p-2 rounded-xl bg-white/10 text-white text-center">
              <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>3</div>
              <div style={{ fontSize: '0.75rem' }}>अनुपस्थित</div>
            </div>
          </div>
        </div>

        {/* Date Navigation Slider */}
        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar py-1">
          {Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - 6 + i);
            const isToday = i === 6;
            return (
              <button 
                key={i}
                className="flex-shrink-0 px-3 py-2 rounded-xl transition-all"
                style={{ 
                  background: isToday ? 'white' : 'rgba(255,255,255,0.15)',
                  minWidth: '64px'
                }}
                onClick={() => {
                  toast.info('Showing attendance for ' + date.toLocaleDateString('hi-IN'));
                }}
              >
                <div className="text-center">
                  <div style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: '600',
                    color: isToday ? '#0B8043' : 'rgba(255,255,255,0.8)'
                  }}>
                    {date.toLocaleDateString('hi-IN', { weekday: 'short' })}
                  </div>
                  <div style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '700',
                    color: isToday ? '#0B8043' : 'white'
                  }}>
                    {date.getDate()}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 bg-white/10 p-1 rounded-lg">
          <button 
            className="flex-1 py-1.5 rounded-md text-white text-sm font-medium"
            style={{ background: 'white', color: '#0B8043' }}
          >
            All
          </button>
          <button 
            className="flex-1 py-1.5 rounded-md text-white text-sm font-medium"
          >
            Present
          </button>
          <button 
            className="flex-1 py-1.5 rounded-md text-white text-sm font-medium"
          >
            Absent
          </button>
        </div>
      </div>

      {/* Manual-only mode header removed per request (keeps cleaner list) */}

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div 
          key="manual"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex-1 overflow-y-auto p-4 pb-32"
        >
          {/* Match MemberHome card styling */}
          <div className="flex-1 bg-white">
            {/* Search */}
            <div className="px-4 py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="नाम शोधें..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none"
                  style={{ 
                    borderColor: '#E8E8E8',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            {/* Student List */}
            <div className="flex flex-col">
              {filteredStudents.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => toggleAttendance(student.id)}
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
                  style={{ borderBottom: '1px solid #F0F0F0' }}
                >
                  <div className="text-base font-medium" style={{ color: '#2D3748' }}>
                    {student.name}
                  </div>
                  <div className="flex items-center gap-3">
                    {!student.present && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success(`Reminder sent to ${student.name}'s app`);
                        }}
                        className="text-xs font-medium text-green-600 px-2 py-1 rounded"
                      >
                        Send Reminder
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              {filteredStudents.length === 0 && (
                <div className="text-center py-12">
                  <p style={{ fontSize: '0.9rem', color: '#999' }}>कोई विद्यार्थी नहीं मिला</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Save button removed: attendance auto-saves on toggle */}

      {/* Bottom Navigation */}
      <BottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
    </div>
  );
}
