import { useState, useEffect } from 'react';
import { ArrowLeft, UserPlus, Check, X, Phone, Calendar, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { BottomNav } from '../BottomNav';

interface JoinRequestsProps {
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

export function JoinRequests({ currentScreen, onNavigate, onBack }: JoinRequestsProps) {
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [requests, setRequests] = useState<JoinRequest[]>([]);

  useEffect(() => {
    // Load requests from localStorage
    const storedRequests = JSON.parse(localStorage.getItem('join-requests') || '[]');
    setRequests(storedRequests);
  }, []);

  const handleApprove = (id: string) => {
    const updatedRequests = requests.map(req =>
      req.id === id ? { ...req, status: 'approved' as const } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem('join-requests', JSON.stringify(updatedRequests));
    
    const request = requests.find(r => r.id === id);
    toast.success(`${request?.name} को approve कर दिया गया! ✅`);
  };

  const handleReject = (id: string) => {
    const updatedRequests = requests.map(req =>
      req.id === id ? { ...req, status: 'rejected' as const } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem('join-requests', JSON.stringify(updatedRequests));
    
    const request = requests.find(r => r.id === id);
    toast.error(`${request?.name} का request reject कर दिया गया`);
  };

  const filteredRequests = filter === 'pending' 
    ? requests.filter(r => r.status === 'pending')
    : requests;

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #F1F8F4 0%, #FFFFFF 100%)' }}>
      {/* Modern Header */}
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
              Join Requests
            </h1>
            <p className="text-white/80" style={{ fontSize: '0.85rem' }}>नए सदस्यों के अनुरोध</p>
          </div>
          {pendingCount > 0 && (
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center" 
              style={{ 
                background: '#FF6B35',
                boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
              }}
            >
              <span className="text-white" style={{ fontSize: '1.1rem', fontWeight: '700' }}>{pendingCount}</span>
            </div>
          )}
        </div>

        {/* Filter */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl" style={{ 
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <button
            onClick={() => setFilter('pending')}
            className="py-2 px-3 rounded-xl transition-all active:scale-95"
            style={{ 
              background: filter === 'pending' ? 'white' : 'transparent',
              color: filter === 'pending' ? '#0B8043' : 'white',
              fontSize: '0.8rem',
              fontWeight: '600'
            }}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('all')}
            className="py-2 px-3 rounded-xl transition-all active:scale-95"
            style={{ 
              background: filter === 'all' ? 'white' : 'transparent',
              color: filter === 'all' ? '#0B8043' : 'white',
              fontSize: '0.8rem',
              fontWeight: '600'
            }}
          >
            All ({requests.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-28">
        {filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ 
              background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)'
            }}>
              <UserPlus className="w-10 h-10" style={{ color: '#48C479' }} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1C4532', marginBottom: '0.5rem' }}>
              {filter === 'pending' ? 'No Pending Requests' : 'No Requests Yet'}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#999', textAlign: 'center', maxWidth: '280px' }}>
              {filter === 'pending' 
                ? 'कोई pending request नहीं है'
                : 'Students will appear here when they scan your mess QR code'
              }
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-2xl relative overflow-hidden"
                style={{ 
                  background: 'white',
                  border: `2px solid ${
                    request.status === 'pending' ? '#FFE082' : 
                    request.status === 'approved' ? '#C8E6C9' : '#FFCDD2'
                  }`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
              >
                {/* Status Badge */}
                {request.status !== 'pending' && (
                  <div 
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-lg flex items-center gap-1"
                    style={{ 
                      background: request.status === 'approved' ? '#E8F5E9' : '#FFEBEE',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      color: request.status === 'approved' ? '#48C479' : '#D32F2F'
                    }}
                  >
                    {request.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                  </div>
                )}

                {/* Student Info */}
                <div className="mb-3">
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ 
                        background: 'linear-gradient(135deg, #48C479 0%, #23AE5F 100%)',
                        boxShadow: '0 4px 12px rgba(72, 196, 121, 0.3)'
                      }}
                    >
                      <span className="text-white" style={{ fontSize: '1.3rem', fontWeight: '700' }}>
                        {request.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1" style={{ paddingRight: request.status !== 'pending' ? '80px' : '0' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1C4532', marginBottom: '2px' }}>
                        {request.name}
                      </div>
                      {request.room && (
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>
                          Room: {request.room}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="flex flex-col gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" style={{ color: '#48C479' }} />
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>{request.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" style={{ color: '#48C479' }} />
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>{request.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" style={{ color: '#999' }} />
                    <span style={{ fontSize: '0.75rem', color: '#999' }}>
                      Requested on {new Date(request.requestDate).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {request.status === 'pending' && (
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleReject(request.id)}
                      className="flex-1 py-2.5 px-4 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                      style={{ 
                        background: 'white',
                        border: '2px solid #FFCDD2',
                        color: '#D32F2F',
                        fontSize: '0.9rem',
                        fontWeight: '700'
                      }}
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="flex-1 py-2.5 px-4 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                      style={{ 
                        background: 'linear-gradient(135deg, #48C479 0%, #23AE5F 100%)',
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        boxShadow: '0 4px 12px rgba(72, 196, 121, 0.3)'
                      }}
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
    </div>
  );
}