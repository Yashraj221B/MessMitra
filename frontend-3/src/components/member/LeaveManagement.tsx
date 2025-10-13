import { useState } from 'react';
import { ArrowLeft, Calendar as CalendarIcon, Plus, Check, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { toast } from 'sonner';
import { MemberBottomNav } from './MemberBottomNav';

interface LeaveManagementProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

interface Leave {
  id: number;
  type: 'meal-skip' | 'out-station';
  startDate: string;
  endDate?: string;
  status: 'approved' | 'pending' | 'rejected';
  reason: string;
  meals: ('lunch' | 'dinner')[];
}

export function LeaveManagement({ currentScreen, onNavigate, onBack }: LeaveManagementProps) {
  const [showForm, setShowForm] = useState(() => {
    const shouldOpen = localStorage.getItem('open-leave-form') === 'true';
    localStorage.removeItem('open-leave-form');
    return shouldOpen;
  });
  const [leaveType, setLeaveType] = useState<'meal-skip' | 'out-station'>('meal-skip');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [reason, setReason] = useState('');
  const [selectedMeals, setSelectedMeals] = useState<('lunch' | 'dinner')[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([
    { 
      id: 1, 
      type: 'meal-skip',
      startDate: '2025-10-15',
      status: 'approved', 
      reason: 'Going out for lunch meeting',
      meals: ['lunch']
    },
    { 
      id: 2, 
      type: 'out-station',
      startDate: '2025-10-20',
      endDate: '2025-10-25',
      status: 'pending', 
      reason: 'Attending a family wedding',
      meals: ['lunch', 'dinner']
    },
    { 
      id: 3,
      type: 'meal-skip',
      startDate: '2025-09-20',
      status: 'approved', 
      reason: 'Medical appointment in evening',
      meals: ['dinner']
    },
  ]);

  const handleSubmit = () => {
    if (leaveType === 'meal-skip') {
      if (!startDate) {
        toast.error('Please select a date!');
        return;
      }
    } else {
      if (!startDate || !endDate) {
        toast.error('Please select start and end dates!');
        return;
      }
      if (endDate < startDate) {
        toast.error('End date cannot be before start date!');
        return;
      }
    }

    if (selectedMeals.length === 0) {
      toast.error('Please select meal times!');
      return;
    }

    if (!reason) {
      toast.error('Please provide a reason!');
      return;
    }

    const newLeave: Leave = {
      id: Date.now(),
      type: leaveType,
      startDate: startDate.toISOString().split('T')[0],
      endDate: leaveType === 'out-station' && endDate ? endDate.toISOString().split('T')[0] : undefined,
      status: 'pending',
      reason,
      meals: selectedMeals
    };

    // Calculate number of days
    const leaveDays = leaveType === 'out-station' && endDate
      ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      : 1;

    setLeaves([newLeave, ...leaves]);
    
    // Simulate owner approval after 2 seconds
    setTimeout(() => {
      // Update leave status
      setLeaves(prevLeaves => 
        prevLeaves.map(l => 
          l.id === newLeave.id ? { ...l, status: 'approved' } : l
        )
      );

      // Extend subscription end date by the number of leave days
      const currentEndDate = new Date(localStorage.getItem('subscription-end-date') || new Date().setDate(new Date().getDate() + 30));
      const newEndDate = new Date(currentEndDate.setDate(currentEndDate.getDate() + leaveDays));
      localStorage.setItem('subscription-end-date', newEndDate.toISOString());

      // Update next payment date
      localStorage.setItem('next-payment-date', newEndDate.toISOString());

      toast.success('Leave approved! Subscription extended automatically 🎉');
    }, 2000);

    toast.success('Leave request submitted successfully! 🎉');
    setShowForm(false);
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedMeals([]);
    setReason('');
  };

  const getStatusConfig = (status: Leave['status']) => {
    switch (status) {
      case 'approved':
        return {
          icon: Check,
          label: 'Approved',
          color: '#48C479',
          bg: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
          borderColor: '#C8E6C9'
        };
      case 'pending':
        return {
          icon: Clock,
          label: 'Pending',
          color: '#FF9800',
          bg: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
          borderColor: '#FFE0B2'
        };
      case 'rejected':
        return {
          icon: X,
          label: 'Rejected',
          color: '#D32F2F',
          bg: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)',
          borderColor: '#FFCDD2'
        };
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: 'linear-gradient(180deg, #F1F8F4 0%, #FFFFFF 100%)' }}>
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
              Leave Management
            </h1>
            <p className="text-white/80" style={{ fontSize: '0.85rem' }}>Manage your leaves</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <span className="text-2xl">🏖️</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl"
            style={{ 
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="text-white/80" style={{ fontSize: '0.7rem', fontWeight: '600', marginBottom: '4px' }}>Total Leaves Taken</div>
            <div className="text-white" style={{ fontSize: '1.3rem', fontWeight: '700' }}>
              {leaves.filter(l => l.status === 'approved').length}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl"
            style={{ 
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="text-white/80" style={{ fontSize: '0.7rem', fontWeight: '600', marginBottom: '4px' }}>Subscription End</div>
            <div className="text-white" style={{ fontSize: '1.3rem', fontWeight: '700' }}>
              {new Date(localStorage.getItem('subscription-end-date') || new Date().setDate(new Date().getDate() + 30)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-28 relative z-0">
        {/* Apply Leave Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full mb-6 flex items-center justify-center gap-2 py-4 rounded-xl active:scale-[0.98] transition-all"
          style={{ 
            background: showForm ? 'linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%)' : 'linear-gradient(135deg, #48C479 0%, #23AE5F 100%)',
            color: showForm ? '#F57C00' : 'white',
            fontSize: '1.1rem',
            fontWeight: '700',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? 'Cancel' : 'Apply for Leave'}
        </button>

        {/* Leave Application Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="p-5 rounded-2xl" style={{ 
                background: 'white',
                border: '2px solid #E8F5E9',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}>
                <h3 className="mb-4" style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1C4532' }}>
                  Apply Leave
                </h3>

                {/* Leave Type Selection */}
                <div className="mb-4">
                  <label className="block mb-2" style={{ fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
                    Leave Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setLeaveType('meal-skip')}
                      className="p-3 rounded-xl flex flex-col items-center gap-1 transition-all"
                      style={{
                        background: leaveType === 'meal-skip' ? 'rgba(72, 196, 121, 0.1)' : '#F3F4F6',
                        color: leaveType === 'meal-skip' ? '#1C4532' : '#666',
                      }}
                    >
                      <span style={{ fontSize: '1.5rem' }}>🍽️</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Meal Skip</span>
                      <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Single day</span>
                    </button>
                    <button
                      onClick={() => setLeaveType('out-station')}
                      className="p-3 rounded-xl flex flex-col items-center gap-1 transition-all"
                      style={{
                        background: leaveType === 'out-station' ? 'rgba(72, 196, 121, 0.1)' : '#F3F4F6',
                        color: leaveType === 'out-station' ? '#1C4532' : '#666',
                      }}
                    >
                      <span style={{ fontSize: '1.5rem' }}>✈️</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Out Station</span>
                      <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Multiple days</span>
                    </button>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="mb-4">
                  <label className="block mb-2" style={{ fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
                    {leaveType === 'meal-skip' ? 'Date' : 'Start Date'}
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button 
                        className="w-full flex items-center justify-between p-3 rounded-xl border-2 active:scale-[0.98] transition-all"
                        style={{ 
                          borderColor: startDate ? '#48C479' : '#E0E0E0',
                          background: 'white'
                        }}
                      >
                        <span style={{ fontSize: '1rem', color: startDate ? '#1C4532' : '#999' }}>
                          {startDate ? startDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Select date'}
                        </span>
                        <CalendarIcon className="w-5 h-5" style={{ color: '#999' }} />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {leaveType === 'out-station' && (
                  <div className="mb-4">
                    <label className="block mb-2" style={{ fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
                      End Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button 
                          className="w-full flex items-center justify-between p-3 rounded-xl border-2 active:scale-[0.98] transition-all"
                          style={{ 
                            borderColor: endDate ? '#48C479' : '#E0E0E0',
                            background: 'white'
                          }}
                        >
                          <span style={{ fontSize: '1rem', color: endDate ? '#1C4532' : '#999' }}>
                            {endDate ? endDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Select date'}
                          </span>
                          <CalendarIcon className="w-5 h-5" style={{ color: '#999' }} />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) => !startDate || date < startDate}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                {/* Meal Selection */}
                <div className="mb-4">
                  <label className="block mb-2" style={{ fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
                    Meals
                  </label>
                                    <div className="space-y-3">
                    <p className="text-xs text-gray-500">Select which meals you'll be skipping:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'lunch' as const, label: 'Lunch' },
                        { value: 'dinner' as const, label: 'Dinner' },
                        { value: 'both' as const, label: 'Both' }
                      ].map(meal => (
                        <button
                          key={meal.value}
                          onClick={() => {
                            if (meal.value === 'both') {
                              setSelectedMeals(['lunch', 'dinner']);
                            } else {
                              setSelectedMeals(prev => {
                                if (prev.length === 2) {
                                  return [meal.value];
                                }
                                if (prev.includes(meal.value)) {
                                  return prev.filter(m => m !== meal.value);
                                }
                                return [meal.value];
                              });
                            }
                          }}
                          className="p-3 rounded-xl transition-all text-center"
                          style={{ 
                            background: (meal.value === 'both' && selectedMeals.length === 2) || 
                                      (meal.value !== 'both' && selectedMeals.includes(meal.value))
                              ? 'rgba(72, 196, 121, 0.1)' 
                              : '#F3F4F6',
                            color: (meal.value === 'both' && selectedMeals.length === 2) || 
                                  (meal.value !== 'both' && selectedMeals.includes(meal.value))
                              ? '#1C4532' 
                              : '#666',
                            fontWeight: '600',
                            fontSize: '0.95rem'
                          }}
                        >
                          {meal.label}
                        </button>
                      ))}
                    </div>
                    {startDate && selectedMeals.length > 0 && (
                      <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(72, 196, 121, 0.1)' }}>
                        <p className="text-xs text-gray-600 mb-2">
                          {leaveType === 'meal-skip' 
                            ? 'Selected meals will be skipped on:'
                            : 'Selected meals will be skipped for all days between:'}
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          {startDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
                          {endDate && (
                            <>
                              {' - '}
                              {endDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reason */}
                <div className="mb-4">
                  <label className="block mb-2" style={{ fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
                    Reason
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason for leave..."
                    className="w-full p-3 rounded-xl border-2 resize-none focus:outline-none transition-all"
                    style={{ 
                      borderColor: reason ? '#48C479' : '#E0E0E0',
                      fontSize: '1rem',
                      minHeight: '100px'
                    }}
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full py-3.5 rounded-xl active:scale-95 transition-all"
                  style={{ 
                    background: 'linear-gradient(135deg, #48C479 0%, #23AE5F 100%)',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '700'
                  }}
                >
                  Submit Request
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leave History */}
        <h3 className="mb-4" style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1C4532' }}>
          Leave History
        </h3>

        <div className="flex flex-col gap-3">
          {leaves.map((leave, index) => {
            const config = getStatusConfig(leave.status);
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={leave.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl relative overflow-hidden"
                style={{ 
                  background: config.bg,
                  border: `2px solid ${config.borderColor}`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
              >
                {/* Decorative circle */}
                <div 
                  className="absolute -top-8 -right-8 w-20 h-20 rounded-full opacity-20"
                  style={{ background: config.color }}
                />

                {/* Status Badge */}
                <div 
                  className="absolute top-3 right-3 px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                  style={{ 
                    background: 'white',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    color: config.color,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  <StatusIcon className="w-3 h-3" />
                  {config.label}
                </div>

                <div className="relative z-10 pr-20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span style={{ fontSize: '1.25rem' }}>{leave.type === 'meal-skip' ? '🍽️' : '✈️'}</span>
                      <span style={{ 
                        fontSize: '0.8rem', 
                        fontWeight: '600',
                        color: '#1C4532',
                        padding: '2px 8px',
                        background: 'rgba(72, 196, 121, 0.1)',
                        borderRadius: '6px'
                      }}>
                        {leave.type === 'meal-skip' ? 'Meal Skip' : 'Out Station'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <CalendarIcon className="w-5 h-5" style={{ color: config.color }} />
                    <span style={{ fontSize: '1rem', fontWeight: '700', color: '#1C4532' }}>
                      {new Date(leave.startDate).toLocaleDateString('en-IN', { weekday: 'long' })}
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '6px' }}>
                    {new Date(leave.startDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                    {leave.endDate && (
                      <>
                        {' - '}
                        {new Date(leave.endDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mb-2">
                    {leave.meals.map((meal) => (
                      <div 
                        key={meal}
                        className="px-3 py-1.5 rounded-lg text-sm flex items-center gap-2"
                        style={{ 
                          background: 'rgba(72, 196, 121, 0.1)',
                          color: '#1C4532',
                          fontWeight: '500'
                        }}
                      >
                        {meal === 'lunch' ? 'Lunch' : 'Dinner'}
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>
                    {leave.reason}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {leaves.length === 0 && (
          <div className="text-center py-12">
            <span style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>🏖️</span>
            <p style={{ fontSize: '1rem', color: '#999' }}>No leave records yet</p>
          </div>
        )}
      </div>

      {/* Bottom spacing for navigation bar */}
      <div className="h-20"></div>
    </div>
  );
}
