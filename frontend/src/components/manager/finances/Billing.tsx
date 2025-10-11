import { useState, useEffect } from 'react';
import { ArrowLeft, IndianRupee, Check, Search, Download, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { BottomNav } from '../BottomNav';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getTranslation } from '../../../utils/translations';
import { BilingualText } from '../../BilingualText';
import { paymentService, userService } from '../../../services';

interface BillingProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

interface Payment {
  id: string;
  name: string;
  room: string;
  amount: number;
  paid: boolean;
  dueDate: string;
  memberId: string;
  paidAmount: number;
}

export function Billing({ currentScreen, onNavigate, onBack }: BillingProps) {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'paid' | 'pending'>('all');
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const profile = await userService.getProfile();
      
      if (!profile.messId) {
        toast.error('पहले mess बनाएं!');
        onBack();
        return;
      }

      const messPayments = await paymentService.getMessPayments(profile.messId);
      
      const paymentsData: Payment[] = messPayments.map(payment => ({
        id: payment.id,
        name: payment.member?.name || payment.member?.phone || 'Unknown',
        room: payment.member?.room || 'N/A',
        amount: payment.amount,
        paid: payment.status === 'paid',
        dueDate: new Date(payment.dueDate).toLocaleDateString('hi-IN'),
        memberId: payment.memberId,
        paidAmount: payment.paidAmount
      }));
      
      setPayments(paymentsData);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load payments');
      console.error('Error loading payments:', error);
    }
  };

  const togglePaymentStatus = async (id: string) => {
    const payment = payments.find(p => p.id === id);
    if (!payment) return;

    try {
      if (!payment.paid) {
        // Mark as paid
        await paymentService.recordPayment(id, {
          paidAmount: payment.amount,
          paymentMethod: 'cash',
          paidDate: new Date().toISOString()
        });
        
        setPayments(prev =>
          prev.map(p => p.id === id ? { ...p, paid: true, paidAmount: p.amount } : p)
        );
        
        toast.success(getTranslation(language, 'paymentUpdated'));
      } else {
        toast.info('Payment already marked as paid');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update payment');
      console.error('Error updating payment:', error);
    }
  };

  const sendReminder = (name: string) => {
    // Removed success toast - reminder button press is confirmation enough
  };

  const filteredPayments = payments
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.room.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' || 
                           (filterType === 'paid' && p.paid) ||
                           (filterType === 'pending' && !p.paid);
      return matchesSearch && matchesFilter;
    });

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = payments.filter(p => p.paid).reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = totalAmount - paidAmount;
  const paidCount = payments.filter(p => p.paid).length;
  const pendingCount = payments.length - paidCount;

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
              <BilingualText text={getTranslation(language, 'viewPayments')} />
            </h1>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <span className="text-2xl">💰</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-xl" style={{ 
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="flex items-center gap-2 text-white/80 mb-1">
              <Check className="w-4 h-4" />
              <span style={{ fontSize: '0.7rem', fontWeight: '600' }}>Received</span>
            </div>
            <div className="text-white" style={{ fontSize: '1.3rem', fontWeight: '700' }}>₹{paidAmount.toLocaleString()}</div>
            <div className="text-white/60" style={{ fontSize: '0.7rem' }}>{paidCount} students</div>
          </div>
          <div className="p-3 rounded-xl" style={{ 
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="flex items-center gap-2 text-white/80 mb-1">
              <IndianRupee className="w-4 h-4" />
              <span style={{ fontSize: '0.7rem', fontWeight: '600' }}>Pending</span>
            </div>
            <div className="text-white" style={{ fontSize: '1.3rem', fontWeight: '700' }}>₹{pendingAmount.toLocaleString()}</div>
            <div className="text-white/60" style={{ fontSize: '0.7rem' }}>{pendingCount} students</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-28">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button 
            className="flex items-center justify-center gap-2 p-3 rounded-xl active:scale-[0.98] transition-all"
            style={{ 
              background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
              border: '1.5px solid #90CAF9'
            }}
            onClick={() => toast.success('सभी को reminder भेज दिया! 📱')}
          >
            <Send className="w-4 h-4" style={{ color: '#1976D2' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1976D2' }}>
              Send Reminders
            </span>
          </button>
          <button 
            className="flex items-center justify-center gap-2 p-3 rounded-xl active:scale-[0.98] transition-all"
            style={{ 
              background: 'linear-gradient(135deg, #FFF9E6 0%, #FFF3D6 100%)',
              border: '1.5px solid #FFE082'
            }}
            onClick={() => toast.success('रिपोर्ट डाउनलोड हो रही है! 📥')}
          >
            <Download className="w-4 h-4" style={{ color: '#F57C00' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#F57C00' }}>
              Download Report
            </span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#999' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="नाम या रूम नंबर खोजें..."
              className="w-full pl-10 pr-4 py-3.5 rounded-xl border-2 focus:outline-none transition-all"
              style={{ 
                borderColor: searchQuery ? '#0B8043' : '#E8F5E9',
                fontSize: '1rem',
                background: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            />
          </div>

          {/* Filter Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl" style={{ 
            background: 'white',
            border: '1.5px solid #E8F5E9',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <button
              onClick={() => setFilterType('all')}
              className="py-2 px-3 rounded-xl transition-all active:scale-95"
              style={{ 
                background: filterType === 'all' ? 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)' : 'transparent',
                color: filterType === 'all' ? 'white' : '#666',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}
            >
              सभी ({payments.length})
            </button>
            <button
              onClick={() => setFilterType('paid')}
              className="py-2 px-3 rounded-xl transition-all active:scale-95"
              style={{ 
                background: filterType === 'paid' ? 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)' : 'transparent',
                color: filterType === 'paid' ? 'white' : '#666',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}
            >
              Paid ({paidCount})
            </button>
            <button
              onClick={() => setFilterType('pending')}
              className="py-2 px-3 rounded-xl transition-all active:scale-95"
              style={{ 
                background: filterType === 'pending' ? 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)' : 'transparent',
                color: filterType === 'pending' ? 'white' : '#666',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}
            >
              Due ({pendingCount})
            </button>
          </div>
        </div>

        {/* Payment List */}
        <div className="flex flex-col gap-3">
          {filteredPayments.map((payment, index) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="p-4 rounded-xl relative overflow-hidden"
              style={{ 
                background: 'white',
                border: payment.paid ? '2px solid #C8E6C9' : '2px solid #FFCDD2',
                boxShadow: payment.paid ? '0 4px 12px rgba(11, 128, 67, 0.1)' : '0 4px 12px rgba(211, 47, 47, 0.1)'
              }}
            >
              {/* Status Badge */}
              <div 
                className="absolute top-3 right-3 px-2 py-1 rounded-lg flex items-center gap-1"
                style={{ 
                  background: payment.paid 
                    ? 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)' 
                    : 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  color: payment.paid ? '#0B8043' : '#D32F2F'
                }}
              >
                {payment.paid ? '✓ Paid' : '! Due'}
              </div>

              <div className="flex items-start gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ 
                    background: payment.paid 
                      ? 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)' 
                      : 'linear-gradient(135deg, #D32F2F 0%, #F44336 100%)'
                  }}
                >
                  <span style={{ fontSize: '1.3rem' }}>
                    {payment.paid ? '💰' : '⏰'}
                  </span>
                </div>
                <div className="flex-1">
                  <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1C4532', marginBottom: '2px' }}>
                    {payment.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '4px' }}>
                    Room: {payment.room} • Due: {new Date(payment.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '700', color: payment.paid ? '#0B8043' : '#D32F2F' }}>
                    ₹{payment.amount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => togglePaymentStatus(payment.id)}
                  className="flex-1 py-2.5 rounded-lg active:scale-95 transition-all"
                  style={{ 
                    background: payment.paid 
                      ? 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)' 
                      : 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)',
                    color: payment.paid ? '#F57C00' : 'white',
                    fontSize: '0.9rem',
                    fontWeight: '700'
                  }}
                >
                  {payment.paid ? 'Mark Unpaid' : 'Mark Paid'}
                </button>
                {!payment.paid && (
                  <button
                    onClick={() => sendReminder(payment.name)}
                    className="px-4 py-2.5 rounded-lg active:scale-95 transition-all"
                    style={{ 
                      background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                      color: '#1976D2'
                    }}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <p style={{ fontSize: '1rem', color: '#999' }}>कोई रिकॉर्ड नहीं मिला</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
    </div>
  );
}
