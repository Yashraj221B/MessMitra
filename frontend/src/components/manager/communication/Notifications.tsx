import { useState, useEffect } from 'react';
import { ArrowLeft, UserPlus, Check, X, Calendar, Phone, Mail, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { BottomNav } from '../BottomNav';
import { useLanguage } from '../../../contexts/LanguageContext';
import { BilingualText } from '../../BilingualText';
import { userService, messService } from '../../../services';

interface NotificationsProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

interface JoinRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  room?: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  messId: string;
}

interface LeaveRequest {
  id: string;
  studentName: string;
  studentId: string;
  phone: string;
  room: string;
  startDate: string;
  endDate: string;
  reason: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export function Notifications({ currentScreen, onNavigate, onBack }: NotificationsProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'join' | 'leave'>('join');
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [messId, setMessId] = useState('');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      // Get user profile to get messId
      const profile = await userService.getProfile();
      if (!profile.messId) {
        toast.error('No mess found for this account');
        return;
      }

      setMessId(profile.messId);

      // Load join requests (mess members with pending status)
      const members = await messService.getMessMembers(profile.messId);
      const joinReqs: JoinRequest[] = members.map((member: any) => ({
        id: member.id,
        name: member.user?.name || 'Unknown',
        phone: member.user?.phone || '',
        email: member.user?.email || '',
        room: member.room || '',
        requestDate: member.joinedAt || new Date().toISOString(),
        status: member.status as 'pending' | 'approved' | 'rejected',
        messId: profile.messId!
      }));
      setJoinRequests(joinReqs);

      // Leave requests would come from a separate API (not implemented yet)
      // For now, keep empty array
      setLeaveRequests([]);
    } catch (error: any) {
      console.error('Error loading notifications:', error);
      toast.error(error.response?.data?.message || 'Failed to load notifications');
    }
  };

  const handleApproveJoin = async (id: string) => {
    if (!messId) return;
    
    try {
      const request = joinRequests.find(r => r.id === id);
      await messService.updateJoinRequest(messId, id, 'active');
      
      const updatedRequests = joinRequests.map(req =>
        req.id === id ? { ...req, status: 'approved' as const } : req
      );
      setJoinRequests(updatedRequests);
      toast.success(`${request?.name} को approve कर दिया गया! ✅`);
    } catch (error: any) {
      console.error('Error approving join request:', error);
      toast.error(error.response?.data?.message || 'Failed to approve request');
    }
  };

  const handleRejectJoin = async (id: string) => {
    if (!messId) return;
    
    try {
      const request = joinRequests.find(r => r.id === id);
      await messService.updateJoinRequest(messId, id, 'rejected');
      
      const updatedRequests = joinRequests.map(req =>
        req.id === id ? { ...req, status: 'rejected' as const } : req
      );
      setJoinRequests(updatedRequests);
      toast.error(`${request?.name} का request reject कर दिया गया`);
    } catch (error: any) {
      console.error('Error rejecting join request:', error);
      toast.error(error.response?.data?.message || 'Failed to reject request');
    }
  };

  const handleApproveLeave = async (_id: string) => {
    // Leave API not implemented yet, show message
    toast.info('Leave management API coming soon!');
  };

  const handleRejectLeave = async (_id: string) => {
    // Leave API not implemented yet, show message
    toast.info('Leave management API coming soon!');
  };

  const pendingJoinCount = joinRequests.filter(r => r.status === 'pending').length;
  const pendingLeaveCount = leaveRequests.filter(r => r.status === 'pending').length;
  const totalPending = pendingJoinCount + pendingLeaveCount;

  const filteredJoinRequests = joinRequests.filter(r => r.status === 'pending');
  const filteredLeaveRequests = leaveRequests.filter(r => r.status === 'pending');

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFBFC' }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-5" style={{ 
        background: 'linear-gradient(135deg, #0B8043 0%, #48C479 100%)',
        boxShadow: '0 8px 24px rgba(11, 128, 67, 0.12)'
      }}>
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl active:scale-95 transition-all"
            style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white" style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '2px' }}>
              <BilingualText text={language === 'marathi' ? 'सूचना (Notifications)' : language === 'hindi' ? 'सूचना (Notifications)' : 'Notifications'} />
            </h1>
            <p className="text-white/90" style={{ fontSize: '0.875rem' }}>
              {language === 'marathi' ? 'विद्यार्थ्यांचे अनुरोध' : language === 'hindi' ? 'विद्यार्थियों के अनुरोध' : 'Student requests'}
            </p>
          </div>
          {totalPending > 0 && (
            <div 
              className="w-11 h-11 rounded-full flex items-center justify-center" 
              style={{ 
                background: '#FF6B35',
                boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)'
              }}
            >
              <span className="text-white" style={{ fontSize: '1.125rem', fontWeight: '700' }}>{totalPending}</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl" style={{ 
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <button
            onClick={() => setActiveTab('join')}
            className="py-2.5 px-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            style={{ 
              background: activeTab === 'join' ? 'white' : 'transparent',
              color: activeTab === 'join' ? '#0B8043' : 'white',
              fontSize: '0.875rem',
              fontWeight: '700'
            }}
          >
            <UserPlus className="w-4 h-4" />
            <BilingualText text={language === 'marathi' ? 'जॉइन (Join)' : language === 'hindi' ? 'जॉइन (Join)' : 'Join'} />
            {pendingJoinCount > 0 && (
              <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ 
                background: activeTab === 'join' ? '#FF6B35' : 'rgba(255,255,255,0.3)',
                fontSize: '0.7rem',
                fontWeight: '700',
                color: activeTab === 'join' ? 'white' : 'white'
              }}>
                {pendingJoinCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('leave')}
            className="py-2.5 px-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            style={{ 
              background: activeTab === 'leave' ? 'white' : 'transparent',
              color: activeTab === 'leave' ? '#0B8043' : 'white',
              fontSize: '0.875rem',
              fontWeight: '700'
            }}
          >
            <Calendar className="w-4 h-4" />
            <BilingualText text={language === 'marathi' ? 'रजा (Leave)' : language === 'hindi' ? 'छुट्टी (Leave)' : 'Leave'} />
            {pendingLeaveCount > 0 && (
              <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ 
                background: activeTab === 'leave' ? '#FF6B35' : 'rgba(255,255,255,0.3)',
                fontSize: '0.7rem',
                fontWeight: '700',
                color: activeTab === 'leave' ? 'white' : 'white'
              }}>
                {pendingLeaveCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 pb-28">
        {activeTab === 'join' ? (
          // Join Requests
          filteredJoinRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ 
                background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)'
              }}>
                <UserPlus className="w-10 h-10" style={{ color: '#48C479' }} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1A1F36', marginBottom: '0.5rem' }}>
                {language === 'marathi' ? 'कोणतेही विनंती नाहीत' : language === 'hindi' ? 'कोई अनुरोध नहीं' : 'No Requests'}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', textAlign: 'center', maxWidth: '280px' }}>
                {language === 'marathi' ? 'विद्यार्थी QR स्कॅन करतील तेव्हा येथे दिसतील' : language === 'hindi' ? 'जब विद्यार्थी QR स्कैन करेंगे तो यहाँ दिखाई देंगे' : 'Students will appear here when they scan your QR code'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredJoinRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-2xl"
                  style={{ 
                    background: 'white',
                    border: '2px solid #FFE082',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                  }}
                >
                  {/* Student Info */}
                  <div className="flex items-start gap-3 mb-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ 
                        background: 'linear-gradient(135deg, #48C479 0%, #23AE5F 100%)',
                        boxShadow: '0 4px 12px rgba(72, 196, 121, 0.3)'
                      }}
                    >
                      <span className="text-white" style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                        {request.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div style={{ fontSize: '1.0625rem', fontWeight: '700', color: '#1A1F36', marginBottom: '2px' }}>
                        {request.name}
                      </div>
                      {request.room && (
                        <div style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                          Room: {request.room}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="flex flex-col gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" style={{ color: '#48C479' }} />
                      <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>{request.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" style={{ color: '#48C479' }} />
                      <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>{request.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" style={{ color: '#9CA3AF' }} />
                      <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                        {new Date(request.requestDate).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleRejectJoin(request.id)}
                      className="flex-1 py-2.5 px-4 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                      style={{ 
                        background: 'white',
                        border: '2px solid #FFCDD2',
                        color: '#EF4444',
                        fontSize: '0.875rem',
                        fontWeight: '700'
                      }}
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleApproveJoin(request.id)}
                      className="flex-1 py-2.5 px-4 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                      style={{ 
                        background: 'linear-gradient(135deg, #48C479 0%, #23AE5F 100%)',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        boxShadow: '0 4px 12px rgba(72, 196, 121, 0.3)'
                      }}
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          // Leave Requests
          filteredLeaveRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ 
                background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)'
              }}>
                <Calendar className="w-10 h-10" style={{ color: '#60A5FA' }} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1A1F36', marginBottom: '0.5rem' }}>
                {language === 'marathi' ? 'कोणतीही रजा विनंती नाही' : language === 'hindi' ? 'कोई छुट्टी अनुरोध नहीं' : 'No Leave Requests'}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', textAlign: 'center', maxWidth: '280px' }}>
                {language === 'marathi' ? 'विद्यार्थ्यांचे रजा विनंती येथे दिसतील' : language === 'hindi' ? 'विद्यार्थियों के छुट्टी अनुरोध यहाँ दिखाई देंगे' : 'Student leave requests will appear here'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredLeaveRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-2xl"
                  style={{ 
                    background: 'white',
                    border: '2px solid #BBDEFB',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                  }}
                >
                  {/* Student Info */}
                  <div className="flex items-start gap-3 mb-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ 
                        background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
                        boxShadow: '0 4px 12px rgba(96, 165, 250, 0.3)'
                      }}
                    >
                      <span className="text-white" style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                        {request.studentName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div style={{ fontSize: '1.0625rem', fontWeight: '700', color: '#1A1F36', marginBottom: '2px' }}>
                        {request.studentName}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                        Room {request.room} • ID: {request.studentId}
                      </div>
                    </div>
                  </div>

                  {/* Leave Details */}
                  <div className="p-3 rounded-xl mb-3" style={{ background: '#F1F8FE' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4" style={{ color: '#60A5FA' }} />
                      <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#1A1F36' }}>
                        {new Date(request.startDate).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short' 
                        })} - {new Date(request.endDate).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    {request.reason && (
                      <div style={{ fontSize: '0.8125rem', color: '#6B7280', fontStyle: 'italic' }}>
                        "{request.reason}"
                      </div>
                    )}
                  </div>

                  {/* Contact */}
                  <div className="flex items-center gap-2 mb-3">
                    <Phone className="w-4 h-4" style={{ color: '#60A5FA' }} />
                    <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>{request.phone}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleRejectLeave(request.id)}
                      className="flex-1 py-2.5 px-4 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                      style={{ 
                        background: 'white',
                        border: '2px solid #FFCDD2',
                        color: '#EF4444',
                        fontSize: '0.875rem',
                        fontWeight: '700'
                      }}
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleApproveLeave(request.id)}
                      className="flex-1 py-2.5 px-4 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                      style={{ 
                        background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        boxShadow: '0 4px 12px rgba(96, 165, 250, 0.3)'
                      }}
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
    </div>
  );
}
