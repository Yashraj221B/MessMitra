import { useState } from 'react';
import { ArrowLeft, IndianRupee, Check, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { BottomNav } from '../BottomNav';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getTranslation } from '../../../utils/translations';
import { BilingualText } from '../../BilingualText';

interface BillingProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
  initialFilter?: 'all' | 'paid' | 'pending';
}

interface Payment {
  id: number;
  name: string;
  phone: string;
  amount: number;
  paid: boolean;
  dueDate: string;
  enrollmentDate: string;
  dueDays: number;
}

export function Billing({ currentScreen, onNavigate, onBack, initialFilter = 'all' }: BillingProps) {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'paid' | 'pending'>(initialFilter);
  const [payments, setPayments] = useState<Payment[]>([
    { id: 1, name: 'Anjali Sharma', phone: '+91 98765 43210', amount: 4500, paid: true, dueDate: '2025-10-05', enrollmentDate: '2025-01-15', dueDays: 0 },
    { id: 2, name: 'Priya Patel', phone: '+91 98765 43211', amount: 4500, paid: false, dueDate: '2025-10-05', enrollmentDate: '2025-01-15', dueDays: 5 },
    { id: 3, name: 'Rahul Kumar', phone: '+91 98765 43212', amount: 4500, paid: false, dueDate: '2025-10-05', enrollmentDate: '2025-02-01', dueDays: 3 },
    { id: 4, name: 'Amit Singh', phone: '+91 98765 43213', amount: 4500, paid: true, dueDate: '2025-10-05', enrollmentDate: '2025-01-15', dueDays: 0 },
    { id: 5, name: 'Sneha Reddy', phone: '+91 98765 43214', amount: 4500, paid: true, dueDate: '2025-10-05', enrollmentDate: '2025-03-01', dueDays: 0 },
    { id: 6, name: 'Vikram Joshi', phone: '+91 98765 43215', amount: 4500, paid: false, dueDate: '2025-10-05', enrollmentDate: '2025-02-15', dueDays: 7 },
    { id: 7, name: 'Neha Gupta', phone: '+91 98765 43216', amount: 4500, paid: true, dueDate: '2025-10-05', enrollmentDate: '2025-01-15', dueDays: 0 },
    { id: 8, name: 'Rohan Verma', phone: '+91 98765 43217', amount: 4500, paid: false, dueDate: '2025-10-05', enrollmentDate: '2025-02-01', dueDays: 2 },
    { id: 9, name: 'Kavya Nair', phone: '+91 98765 43218', amount: 4500, paid: false, dueDate: '2025-10-05', enrollmentDate: '2025-03-01', dueDays: 4 },
    { id: 10, name: 'Arjun Mehta', phone: '+91 98765 43219', amount: 4500, paid: true, dueDate: '2025-10-05', enrollmentDate: '2025-01-15', dueDays: 0 },
  ]);

  const togglePaymentStatus = (id: number) => {
    setPayments(prev =>
      prev.map(p => p.id === id ? { ...p, paid: !p.paid } : p)
    );
    const payment = payments.find(p => p.id === id);
    if (payment) {
      const message = payment.paid 
        ? (language === 'marathi' ? 'पेमेंट प्रलंबित केले!' : language === 'hindi' ? 'पेमेंट pending में डाला!' : 'Payment marked as pending!')
        : getTranslation(language, 'paymentUpdated');
      toast.success(message);
    }
  };

  const filteredPayments = payments
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.phone.toLowerCase().includes(searchQuery.toLowerCase());
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
        {/* Search and Filter */}
        <div className="mb-4 space-y-3">
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
              <div className="flex flex-col gap-2">
                {/* Header with Name and Status */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-primary">
                    {payment.name}
                  </h3>
                  <div 
                    className="px-3 py-1 rounded-lg text-xs font-semibold"
                    style={{ 
                      background: payment.paid 
                        ? '#E8F5E9' 
                        : '#FFEBEE',
                      color: payment.paid ? '#0B8043' : '#D32F2F'
                    }}
                  >
                    {payment.paid ? 'Paid' : 'Due'}
                  </div>
                </div>

                {/* Contact and Enrollment Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div>{payment.phone}</div>
                  <div>•</div>
                  <div>Joined {new Date(payment.enrollmentDate).toLocaleDateString('en-IN', { 
                    month: 'short', 
                    year: 'numeric'
                  })}</div>
                </div>

                {/* Amount and Due Days */}
                <div className="flex items-center justify-between mt-1">
                  <div className="text-xl font-bold" style={{ 
                    color: payment.paid ? '#0B8043' : '#D32F2F' 
                  }}>
                    ₹{payment.amount.toLocaleString()}
                  </div>
                  {!payment.paid && payment.dueDays > 0 && (
                    <div className="text-sm font-medium text-destructive">
                      {payment.dueDays} days overdue
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => togglePaymentStatus(payment.id)}
                    className="flex-1 py-2.5 rounded-lg active:scale-95 transition-all text-sm font-semibold"
                    style={{ 
                      background: payment.paid 
                        ? '#FFF3E0'
                        : 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)',
                      color: payment.paid ? '#F57C00' : 'white',
                    }}
                  >
                    {payment.paid ? 'Mark as Unpaid' : 'Mark as Paid'}
                  </button>
                  {!payment.paid && (
                    <button
                      onClick={() => toast.success(`${payment.name} को याद दिलाया गया!`)}
                      className="px-4 py-2.5 rounded-lg active:scale-95 transition-all text-sm font-semibold"
                      style={{
                        background: 'linear-gradient(135deg, #F57C00 0%, #FFB74D 100%)',
                        color: 'white',
                      }}
                    >
                      Send Reminder
                    </button>
                  )}
                </div>
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
