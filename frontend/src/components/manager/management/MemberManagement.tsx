import { useState, useEffect } from 'react';
import { ArrowLeft, Search, UserPlus, Phone, Home, Calendar, Check, X, Loader2, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNav } from '../BottomNav';
import { messService, userService, authService } from '../../../services';
import { toast } from 'sonner';

interface MemberManagementProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

interface Member {
  id: string;
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
  const [members, setMembers] = useState<Member[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messId, setMessId] = useState<string>('');
  const [newMember, setNewMember] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const profile = await userService.getProfile();
      
      if (!profile.messId) {
        toast.error('पहले mess बनाएं!');
        onBack();
        return;
      }

      setMessId(profile.messId);

      const messMembers = await messService.getMessMembers(profile.messId);
      console.log('Raw mess members response:', messMembers);
      
      const activeMembers = messMembers.filter(m => m.status === 'active');
      console.log('Active members:', activeMembers);
      
      const membersData: Member[] = activeMembers.map(member => ({
        id: member.userId,
        name: member.user?.name || member.user?.phone || 'Unknown',
        room: 'N/A', // TODO: Add room field
        phone: member.user?.phone || '',
        joinDate: new Date(member.joinedAt).toLocaleDateString('hi-IN'),
        paymentStatus: 'pending', // TODO: Get from payment service
        attendance: 85 // TODO: Get from attendance service
      }));
      
      console.log('Mapped members data:', membersData);
      setMembers(membersData);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load members');
      console.error('Error loading members:', error);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messId) {
      toast.error('No mess ID found');
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Register new member using auth/register endpoint
      const registerResult = await authService.register({
        name: newMember.name,
        phone: newMember.phone,
        email: newMember.email || '',
        password: newMember.password,
        role: 'member'
      });

      if (registerResult.success && registerResult.user) {
        const memberId = (registerResult.user as any).id;
        
        // Step 2: Auto-approve the member to join this mess
        try {
          await messService.updateJoinRequest(messId, memberId, 'active');
          toast.success('Member added and enrolled successfully!');
        } catch (joinError: any) {
          console.warn('Member created but auto-enrollment failed:', joinError);
          // Member is created but needs manual approval
          toast.success('Member created! They can now join using the mess code.');
        }
      }

      setShowAddForm(false);
      setNewMember({
        name: '',
        phone: '',
        email: '',
        password: ''
      });
      
      // Reload members list
      await loadMembers();
    } catch (error: any) {
      console.error('Error adding member:', error);
      const message = error.response?.data?.message || error.message || 'Failed to add member';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            onClick={() => setShowAddForm(true)}
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

      {/* Add Member Dialog */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAddForm(false);
                setNewMember({ 
                  name: '', 
                  phone: '', 
                  email: '', 
                  password: '' 
                });
              }
            }}
          >
            <motion.div
              initial={{ y: 500 }}
              animate={{ y: 0 }}
              exit={{ y: 500 }}
              className="w-full max-w-md bg-white rounded-2xl p-6 m-4"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1A1F36', marginBottom: '4px' }}>
                    नया सदस्य जोड़ें
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: '#666' }}>Add New Member</p>
                </div>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewMember({ 
                      name: '', 
                      phone: '', 
                      email: '', 
                      password: '' 
                    });
                  }}
                  className="p-2 rounded-xl hover:bg-gray-100"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleAddMember}>
                {/* Student Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={e => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
                    placeholder="विद्यार्थी का नाम / Student Name"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={newMember.phone}
                    onChange={e => setNewMember(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
                    placeholder="फ़ोन नंबर / 10-digit Phone Number"
                    maxLength={10}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={e => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
                    placeholder="ईमेल / Email Address"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    value={newMember.password}
                    onChange={e => setNewMember(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
                    placeholder="पासवर्ड / Password (min 6 characters)"
                    minLength={6}
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl text-white font-semibold active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #48C479 0%, #0B8043 100%)' }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>Add New Member</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
