import { useState } from 'react';
import { ArrowLeft, Search, UserPlus, Phone, Home, Calendar, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNav } from '../BottomNav';

interface MemberManagementProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

interface Member {
  id: number;
  name: string;
  room: string;
  phone: string;
  joinDate: string;
  paymentStatus: 'paid' | 'pending';
  attendance: number;
}

export function MemberManagement({ currentScreen, onNavigate, onBack }: MemberManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [members] = useState<Member[]>([
    { id: 1, name: 'Anjali Sharma', room: 'H1-201', phone: '+91 98765 43210', joinDate: 'Jan 2025', paymentStatus: 'paid', attendance: 95 },
    { id: 2, name: 'Priya Patel', room: 'H1-202', phone: '+91 98765 43211', joinDate: 'Jan 2025', paymentStatus: 'pending', attendance: 88 },
    { id: 3, name: 'Rahul Kumar', room: 'H2-101', phone: '+91 98765 43212', joinDate: 'Feb 2025', paymentStatus: 'pending', attendance: 92 },
    { id: 4, name: 'Amit Singh', room: 'H2-102', phone: '+91 98765 43213', joinDate: 'Jan 2025', paymentStatus: 'paid', attendance: 97 },
    { id: 5, name: 'Sneha Reddy', room: 'H1-203', phone: '+91 98765 43214', joinDate: 'Mar 2025', paymentStatus: 'paid', attendance: 90 },
    { id: 6, name: 'Vikram Joshi', room: 'H3-301', phone: '+91 98765 43215', joinDate: 'Feb 2025', paymentStatus: 'pending', attendance: 85 },
  ]);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.room.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            className="p-2.5 rounded-xl active:scale-95 transition-all"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white mb-0.5" style={{ fontSize: '1.35rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
              सदस्य देखें
            </h1>
            <p className="text-white/80" style={{ fontSize: '0.85rem' }}>Member Management</p>
          </div>
          <button
            className="p-2.5 rounded-xl active:scale-95 transition-all"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}
          >
            <UserPlus className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="नाम या रूम नंबर खोजें..."
            className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder:text-white/70"
            style={{ background: 'rgba(255,255,255,0.2)', fontSize: '1rem' }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-6">
        <div className="flex flex-col gap-2">
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedMember(member)}
              className="p-4 rounded-xl active:scale-98 transition-transform"
              style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div style={{ fontSize: '1rem', fontWeight: '600', color: '#333' }}>{member.name}</div>
                  <div className="flex items-center gap-1 mt-1" style={{ fontSize: '0.875rem', color: '#666' }}>
                    <Home className="w-3 h-3" />
                    {member.room}
                  </div>
                </div>
                <div className="px-2 py-1 rounded-full flex items-center gap-1" style={{ 
                  background: member.paymentStatus === 'paid' ? '#E8F5E9' : '#FFEBEE',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: member.paymentStatus === 'paid' ? '#4CAF50' : '#D32F2F'
                }}>
                  {member.paymentStatus === 'paid' ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  {member.paymentStatus === 'paid' ? 'PAID' : 'DUE'}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t" style={{ borderColor: '#F0F0F0' }}>
                <div className="flex-1">
                  <div style={{ fontSize: '0.75rem', color: '#999' }}>Attendance</div>
                  <div style={{ fontSize: '1rem', fontWeight: '600', color: '#333' }}>{member.attendance}%</div>
                </div>
                <div className="flex-1">
                  <div style={{ fontSize: '0.75rem', color: '#999' }}>Joined</div>
                  <div style={{ fontSize: '1rem', fontWeight: '600', color: '#333' }}>{member.joinDate}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Member Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[430px] rounded-t-3xl p-6"
              style={{ background: 'white', maxHeight: '80vh', overflowY: 'auto' }}
            >
              <div className="w-12 h-1 rounded-full mx-auto mb-6" style={{ background: '#E0E0E0' }} />
              
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: '#9C27B0' }}>
                  <span className="text-3xl">👤</span>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#333' }}>{selectedMember.name}</h2>
              </div>

              <div className="flex flex-col gap-3">
                <div className="p-4 rounded-xl" style={{ background: '#F5F5F5' }}>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5" style={{ color: '#666' }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#999' }}>Phone Number</div>
                      <div style={{ fontSize: '1rem', fontWeight: '500', color: '#333' }}>{selectedMember.phone}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl" style={{ background: '#F5F5F5' }}>
                  <div className="flex items-center gap-3">
                    <Home className="w-5 h-5" style={{ color: '#666' }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#999' }}>Room Number</div>
                      <div style={{ fontSize: '1rem', fontWeight: '500', color: '#333' }}>{selectedMember.room}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl" style={{ background: '#F5F5F5' }}>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5" style={{ color: '#666' }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#999' }}>Join Date</div>
                      <div style={{ fontSize: '1rem', fontWeight: '500', color: '#333' }}>{selectedMember.joinDate}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl text-center" style={{ background: '#E8F5E9' }}>
                    <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>Attendance</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#4CAF50' }}>{selectedMember.attendance}%</div>
                  </div>
                  <div className="p-4 rounded-xl text-center" style={{ 
                    background: selectedMember.paymentStatus === 'paid' ? '#E8F5E9' : '#FFEBEE'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>Payment</div>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: '700', 
                      color: selectedMember.paymentStatus === 'paid' ? '#4CAF50' : '#D32F2F'
                    }}>
                      {selectedMember.paymentStatus === 'paid' ? 'PAID' : 'DUE'}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <BottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
    </div>
  );
}
