import { useState } from 'react';
import { ArrowLeft, Download, IndianRupee, Check, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { MemberBottomNav } from './MemberBottomNav';

interface PaymentHistoryProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

interface Payment {
  id: number;
  month: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
  dueDate: string;
}

export function PaymentHistory({ currentScreen, onNavigate, onBack }: PaymentHistoryProps) {
  const [payments] = useState<Payment[]>([
    { id: 1, month: 'October 2025', amount: 4500, status: 'pending', dueDate: '2025-10-10' },
    { id: 2, month: 'September 2025', amount: 4500, status: 'paid', paidDate: '2025-09-05', dueDate: '2025-09-10' },
    { id: 3, month: 'August 2025', amount: 4500, status: 'paid', paidDate: '2025-08-07', dueDate: '2025-08-10' },
    { id: 4, month: 'July 2025', amount: 4500, status: 'paid', paidDate: '2025-07-04', dueDate: '2025-07-10' },
    { id: 5, month: 'June 2025', amount: 4500, status: 'paid', paidDate: '2025-06-08', dueDate: '2025-06-10' },
  ]);

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  const getStatusConfig = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return {
          icon: Check,
          label: 'Paid',
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
      case 'overdue':
        return {
          icon: AlertCircle,
          label: 'Overdue',
          color: '#D32F2F',
          bg: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)',
          borderColor: '#FFCDD2'
        };
    }
  };

  const handlePayNow = (payment: Payment) => {
    // Removed success toast - payment gateway will show confirmation
  };

  const handleDownloadReceipt = (payment: Payment) => {
    // Removed success toast - download will start, browser shows notification
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
              पेमेंट हिस्ट्री
            </h1>
            <p className="text-white/80" style={{ fontSize: '0.85rem' }}>Payment History</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <span className="text-2xl">💳</span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-xl" style={{ 
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="flex items-center gap-2 text-white/80 mb-1">
              <Check className="w-4 h-4" />
              <span style={{ fontSize: '0.7rem', fontWeight: '600' }}>Total Paid</span>
            </div>
            <div className="text-white" style={{ fontSize: '1.3rem', fontWeight: '700' }}>₹{totalPaid.toLocaleString()}</div>
            <div className="text-white/60" style={{ fontSize: '0.7rem' }}>{payments.filter(p => p.status === 'paid').length} months</div>
          </div>
          <div className="p-3 rounded-xl" style={{ 
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="flex items-center gap-2 text-white/80 mb-1">
              <Clock className="w-4 h-4" />
              <span style={{ fontSize: '0.7rem', fontWeight: '600' }}>Pending</span>
            </div>
            <div className="text-white" style={{ fontSize: '1.3rem', fontWeight: '700' }}>₹{totalPending.toLocaleString()}</div>
            <div className="text-white/60" style={{ fontSize: '0.7rem' }}>{payments.filter(p => p.status === 'pending').length} month</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-28">
        {/* Payment List */}
        <div className="flex flex-col gap-3">
          {payments.map((payment, index) => {
            const config = getStatusConfig(payment.status);
            const StatusIcon = config.icon;
            
            return (
              <motion.div
                key={payment.id}
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
                  className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-20"
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

                <div className="flex items-start gap-3 mb-3 relative z-10">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ 
                      background: config.color,
                      boxShadow: `0 4px 12px ${config.color}40`
                    }}
                  >
                    <IndianRupee className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1C4532', marginBottom: '2px' }}>
                      {payment.month}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '4px' }}>
                      {payment.status === 'paid' 
                        ? `Paid on ${new Date(payment.paidDate!).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}`
                        : `Due: ${new Date(payment.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`
                      }
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: config.color }}>
                      ₹{payment.amount.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 relative z-10">
                  {payment.status === 'paid' ? (
                    <button
                      onClick={() => handleDownloadReceipt(payment)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg active:scale-95 transition-all"
                      style={{ 
                        background: 'white',
                        color: config.color,
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Download className="w-4 h-4" />
                      Download Receipt
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handlePayNow(payment)}
                        className="flex-1 py-2.5 rounded-lg active:scale-95 transition-all"
                        style={{ 
                          background: 'linear-gradient(135deg, #48C479 0%, #23AE5F 100%)',
                          color: 'white',
                          fontSize: '0.9rem',
                          fontWeight: '700'
                        }}
                      >
                        Pay Now
                      </button>
                      <button
                        className="px-4 py-2.5 rounded-lg active:scale-95 transition-all"
                        style={{ 
                          background: 'white',
                          color: '#666',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                        }}
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Payment Info Card */}
        <div className="mt-6 p-5 rounded-2xl" style={{ 
          background: 'linear-gradient(135deg, #FFF9E6 0%, #FFF3D6 100%)',
          border: '1.5px solid #FFE082'
        }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <div style={{ fontSize: '1rem', fontWeight: '700', color: '#F57C00', marginBottom: '4px' }}>
                Payment Information
              </div>
              <div style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.6' }}>
                • Monthly fee: ₹4,500<br />
                • Due date: 10th of every month<br />
                • Late payment fine: ₹100 after due date<br />
                • Pay online to get instant receipt
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <MemberBottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
    </div>
  );
}
