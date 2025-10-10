import { useState } from 'react';
import { ArrowLeft, Calendar as CalendarIcon, Plus, Check, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  startDate: string;
  endDate: string;
  days: number;
  status: 'approved' | 'pending' | 'rejected';
  reason: string;
}

export function LeaveManagement({ currentScreen, onNavigate, onBack }: LeaveManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [reason, setReason] = useState('');
  const [leaves, setLeaves] = useState<Leave[]>([
    { id: 1, startDate: '2025-10-15', endDate: '2025-10-17', days: 3, status: 'approved', reason: 'Family function' },
    { id: 2, startDate: '2025-09-20', endDate: '2025-09-22', days: 3, status: 'approved', reason: 'Medical emergency' },
  ]);

  const handleSubmit = () => {
    if (!startDate || !endDate || !reason) {
      toast.error('कृपया सभी फील्ड भरें!');
      return;
    }

    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const newLeave: Leave = {
      id: Date.now(),
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      days,
      status: 'pending',
      reason
    };

    setLeaves([newLeave, ...leaves]);
    toast.success('छुट्टी का अनुरोध भेज दिया गया! 🎉');
    setShowForm(false);
    setStartDate(undefined);
    setEndDate(undefined);
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
              छुट्टी का प्रबंधन
            </h1>
            <p className="text-white/80" style={{ fontSize: '0.85rem' }}>Leave Management</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <span className="text-2xl">🏖️</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-xl" style={{ 
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="text-white/80" style={{ fontSize: '0.7rem', fontWeight: '600', marginBottom: '4px' }}>Total</div>
            <div className="text-white" style={{ fontSize: '1.3rem', fontWeight: '700' }}>{leaves.length}</div>
          </div>
          <div className="p-3 rounded-xl" style={{ 
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="text-white/80" style={{ fontSize: '0.7rem', fontWeight: '600', marginBottom: '4px' }}>Used</div>
            <div className="text-white" style={{ fontSize: '1.3rem', fontWeight: '700' }}>
              {leaves.filter(l => l.status === 'approved').reduce((sum, l) => sum + l.days, 0)}
            </div>
          </div>
          <div className="p-3 rounded-xl" style={{ 
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="text-white/80" style={{ fontSize: '0.7rem', fontWeight: '600', marginBottom: '4px' }}>Left</div>
            <div className="text-white" style={{ fontSize: '1.3rem', fontWeight: '700' }}>3</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-28">
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
                  छुट्टी का अनुरोध • Apply Leave
                </h3>

                {/* Date Pickers */}
                <div className="mb-4">
                  <label className="block mb-2" style={{ fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
                    Start Date • शुरू की तारीख
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

                <div className="mb-4">
                  <label className="block mb-2" style={{ fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
                    End Date • अंत की तारीख
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

                {/* Reason */}
                <div className="mb-4">
                  <label className="block mb-2" style={{ fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
                    Reason • कारण
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
                    <CalendarIcon className="w-5 h-5" style={{ color: config.color }} />
                    <span style={{ fontSize: '1rem', fontWeight: '700', color: '#1C4532' }}>
                      {leave.days} {leave.days === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '6px' }}>
                    {new Date(leave.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - {new Date(leave.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  
                  <div style={{ fontSize: '0.85rem', color: '#999' }}>
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

      {/* Bottom Navigation */}
      <MemberBottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
    </div>
  );
}
