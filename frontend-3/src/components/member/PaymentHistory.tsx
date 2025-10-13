import { useState } from 'react';
import { ArrowLeft, Download, IndianRupee, Check, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
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
  const [payments, setPayments] = useState<Payment[]>([
    { id: 1, month: 'October 2025', amount: 4500, status: 'pending', dueDate: '2025-10-10' },
    { id: 2, month: 'September 2025', amount: 4500, status: 'paid', paidDate: '2025-09-05', dueDate: '2025-09-10' },
    { id: 3, month: 'August 2025', amount: 4500, status: 'paid', paidDate: '2025-08-07', dueDate: '2025-08-10' },
    { id: 4, month: 'July 2025', amount: 4500, status: 'paid', paidDate: '2025-07-04', dueDate: '2025-07-10' },
    { id: 5, month: 'June 2025', amount: 4500, status: 'paid', paidDate: '2025-06-08', dueDate: '2025-06-10' },
  ]);

  const handleMarkAsPaid = (payment: Payment) => {
    // Send notification to owner
    toast.success('Payment notification sent to owner for approval');
    
    // In a real implementation, this would be an API call to notify the owner
    // For demo purposes, we'll simulate the owner's approval after 2 seconds
    setTimeout(() => {
      // Update payment status
      setPayments(prevPayments => 
        prevPayments.map(p => 
          p.id === payment.id 
            ? { ...p, status: 'paid', paidDate: new Date().toISOString().split('T')[0] }
            : p
        )
      );

      // Update subscription end date (extend by 30 days)
      const currentEndDate = new Date(localStorage.getItem('subscription-end-date') || new Date().setDate(new Date().getDate() + 30));
      const newEndDate = new Date(currentEndDate.setDate(currentEndDate.getDate() + 30));
      localStorage.setItem('subscription-end-date', newEndDate.toISOString());

      // Update next payment date
      localStorage.setItem('next-payment-date', newEndDate.toISOString());

      toast.success('Payment approved! Subscription extended.');
    }, 2000);
  };

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

  const handleDownloadReceipt = (payment: Payment) => {
    toast.success(`Downloading receipt for ${payment.month}! 📥`);
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
              Payment History
            </h1>
            <p className="text-white/80" style={{ fontSize: '0.85rem' }}>View your payments</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <span className="text-2xl">💳</span>
          </div>
        </div>

        {/* Payment Info */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-xl" style={{ 
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="flex items-center gap-2 text-white/80 mb-1">
              <Clock className="w-4 h-4" />
              <span style={{ fontSize: '0.7rem', fontWeight: '600' }}>Next Payment</span>
            </div>
            <div className="text-white" style={{ fontSize: '1.3rem', fontWeight: '700' }}>
              {new Date(localStorage.getItem('next-payment-date') || new Date().setDate(new Date().getDate() + 30)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </div>
          </div>
          <div className="p-3 rounded-xl" style={{ 
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="flex items-center gap-2 text-white/80 mb-1">
              <Check className="w-4 h-4" />
              <span style={{ fontSize: '0.7rem', fontWeight: '600' }}>Monthly Fee</span>
            </div>
            <div className="text-white" style={{ fontSize: '1.3rem', fontWeight: '700' }}>₹4,500</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {/* Payment List */}
        <div className="py-4 space-y-4">
          {payments.map((payment, index) => {
            const config = getStatusConfig(payment.status);
            const StatusIcon = config.icon;
            
            return (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-2xl relative overflow-hidden"
                style={{ 
                  background: config.bg,
                  border: `1px solid ${config.borderColor}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
              >
                {/* Decorative circle */}
                <div 
                  className="absolute -top-8 -right-8 w-20 h-20 rounded-full opacity-20"
                  style={{ background: config.color }}
                />

                {/* Status Badge */}
                <div 
                  className="absolute top-4 right-4 px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                  style={{ 
                    background: 'white',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    color: config.color,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  <StatusIcon className="w-3.5 h-3.5" />
                  {config.label}
                </div>

                <div className="flex items-start gap-4 relative z-10">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ 
                      background: 'rgba(72, 196, 121, 0.1)',
                      color: config.color
                    }}
                  >
                    <IndianRupee className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex flex-col gap-1">
                        <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1C4532' }}>
                          {payment.month}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
                          {payment.status === 'paid' 
                            ? `Paid on ${new Date(payment.paidDate!).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`
                            : `Due: ${new Date(payment.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`
                          }
                        </div>
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '700', color: config.color, marginRight: '80px' }}>
                        ₹{payment.amount.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center justify-end">
                      {payment.status === 'paid' ? (
                        <button 
                          onClick={() => handleDownloadReceipt(payment)}
                          className="px-4 py-1.5 rounded-lg text-sm font-medium active:scale-95 transition-all flex items-center gap-2"
                          style={{ 
                            background: 'rgba(72, 196, 121, 0.1)',
                            color: '#1C4532'
                          }}
                        >
                          <Download className="w-4 h-4" />
                          Receipt
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleMarkAsPaid(payment)}
                          className="px-4 py-1.5 rounded-lg text-sm font-medium active:scale-95 transition-all"
                          style={{ 
                            background: 'rgba(72, 196, 121, 0.1)',
                            color: '#1C4532'
                          }}
                        >
                          I Have Paid
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Payment Info Card */}
        <div className="mt-6 p-4 rounded-2xl" style={{ 
          background: 'rgba(255, 152, 0, 0.1)',
          border: '1px solid rgba(255, 152, 0, 0.2)'
        }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-1">💡</span>
            <div className="flex-1">
              <div style={{ fontSize: '1rem', fontWeight: '600', color: '#F57C00', marginBottom: '4px' }}>
                Quick Info
              </div>
              <div className="space-y-1.5" style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.5' }}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 opacity-60"></span>
                  Monthly Fee: ₹4,500
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 opacity-60"></span>
                  Due Date: 10th of every month
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 opacity-60"></span>
                  Late Fine: ₹100
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom spacing for navigation bar */}
        <div className="h-6"></div>
      </div>
    </div>
  );
}
