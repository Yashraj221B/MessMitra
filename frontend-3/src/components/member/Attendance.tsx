import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

interface AttendanceProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

interface AttendanceData {
  date: string;
  status: 'present' | 'absent' | 'leave';
}

export function Attendance({ currentScreen, onNavigate }: AttendanceProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [attendanceData] = useState<AttendanceData[]>([
    // Sample data - replace with actual data from API
    { date: '2025-10-01', status: 'present' },
    { date: '2025-10-02', status: 'present' },
    { date: '2025-10-03', status: 'present' },
    { date: '2025-10-04', status: 'absent' },
    { date: '2025-10-05', status: 'present' },
    { date: '2025-10-06', status: 'present' },
    { date: '2025-10-07', status: 'present' },
    { date: '2025-10-08', status: 'leave' },
    { date: '2025-10-09', status: 'leave' },
    { date: '2025-10-10', status: 'leave' },
    { date: '2025-10-11', status: 'present' },
  ]);

  // Calculate statistics
  const totalDays = attendanceData.length;
  const presentDays = attendanceData.filter(d => d.status === 'present').length;
  const absentDays = attendanceData.filter(d => d.status === 'absent').length;
  const leaveDays = attendanceData.filter(d => d.status === 'leave').length;
  const attendancePercentage = Math.round((presentDays / totalDays) * 100);

  // Get calendar days for current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(selectedMonth),
    end: endOfMonth(selectedMonth)
  });

  const getStatusForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return attendanceData.find(d => d.date === dateStr)?.status;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFBFC' }}>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 pt-6 pb-5" 
        style={{ 
          background: 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)',
          boxShadow: '0 8px 24px rgba(11, 128, 67, 0.2)'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => onNavigate('home')}
            className="p-2 rounded-xl active:scale-95 transition-all"
            style={{ background: 'rgba(255, 255, 255, 0.2)' }}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-lg font-bold">Attendance Record</h1>
          <div className="w-8" /> {/* Spacer for alignment */}
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-20">
        {/* Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 p-4 rounded-2xl bg-white"
          style={{ 
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" 
              style={{ background: 'rgba(11, 128, 67, 0.1)' }}>
              <Calendar className="w-5 h-5" style={{ color: '#0B8043' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1A1F36' }}>
                Monthly Overview
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                {format(selectedMonth, 'MMMM yyyy')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Attendance', value: attendancePercentage + '%' },
              { label: 'Present', value: presentDays.toString() },
              { label: 'Absent', value: absentDays.toString() },
              { label: 'Leave', value: leaveDays.toString() }
            ].map((stat, index) => (
              <div
                key={index}
                className="p-3 rounded-xl"
                style={{ background: '#F9FAFB' }}
              >
                <p style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1A1F36', marginBottom: '2px' }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Calendar Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSelectedMonth(prev => subMonths(prev, 1))}
              className="p-2 rounded-xl active:scale-95 transition-all"
              style={{ background: '#F3F4F6' }}
            >
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            </button>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1A1F36' }}>
              {format(selectedMonth, 'MMMM yyyy')}
            </span>
            <button
              onClick={() => setSelectedMonth(prev => addMonths(prev, 1))}
              className="p-2 rounded-xl active:scale-95 transition-all"
              style={{ background: '#F3F4F6' }}
            >
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Calendar */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div
                key={day}
                className="h-8 flex items-center justify-center"
              >
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6B7280' }}>
                  {day}
                </span>
              </div>
            ))}

            {/* Calendar days */}
            {daysInMonth.map((date, index) => {
              const status = getStatusForDate(date);
              const isCurrentMonth = isSameMonth(date, selectedMonth);
              const isToday = isSameDay(date, new Date());

              return (
                <div
                  key={index}
                  className="aspect-square p-1"
                >
                  <div
                    className={'w-full h-full rounded-lg flex items-center justify-center ' + 
                      (isToday ? 'ring-2 ring-green-500' : '')}
                    style={{
                      background: status === 'present' ? 'rgba(11, 128, 67, 0.1)' :
                                status === 'absent' ? 'rgba(239, 68, 68, 0.1)' :
                                status === 'leave' ? 'rgba(234, 179, 8, 0.1)' :
                                'transparent',
                      color: !isCurrentMonth ? '#D1D5DB' :
                             status === 'present' ? '#0B8043' :
                             status === 'absent' ? '#EF4444' :
                             status === 'leave' ? '#EAB308' :
                             '#1A1F36'
                    }}
                  >
                    <span style={{ fontSize: '0.875rem' }}>
                      {format(date, 'd')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4" style={{ borderTop: '1px solid #E5E7EB' }}>
            {[
              { label: 'Present', color: 'rgba(11, 128, 67, 0.1)', textColor: '#0B8043' },
              { label: 'Absent', color: 'rgba(239, 68, 68, 0.1)', textColor: '#EF4444' },
              { label: 'Leave', color: 'rgba(234, 179, 8, 0.1)', textColor: '#EAB308' }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ background: item.color }}
                />
                <span style={{ fontSize: '0.75rem', color: item.textColor }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}