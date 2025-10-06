import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Phone, Calendar, UserCircle, Mail, IndianRupee, XCircle } from 'lucide-react';
import { mockMembers, mockPayments, mockLeaves } from '../data/mockData';

export default function MemberProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const member = mockMembers.find(m => m.id === id);
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!member) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Member not found</p>
      </div>
    );
  }

  // Get member's payment history
  const memberPayments = mockPayments.filter(p => p.memberId === id);
  const totalPaid = memberPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  // Get member's leave history
  const memberLeaves = mockLeaves.filter(l => l.memberId === id);

  const handlePayment = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Payment recorded successfully!');
      setShowPaymentModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLeaveRequest = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Leave request submitted!');
      setShowLeaveModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = () => {
    switch (member.subscriptionStatus) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'expiring-soon':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'expired':
        return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const getStatusText = () => {
    switch (member.subscriptionStatus) {
      case 'active':
        return 'Active';
      case 'expiring-soon':
        return 'Expiring Soon';
      case 'expired':
        return 'Expired';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 pt-8 pb-20 rounded-b-3xl shadow-xl">
        <button
          onClick={() => navigate('/members')}
          className="flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity text-white"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
          <span className="font-medium text-white">Back</span>
        </button>
        
        <div className="text-center">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCircle className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-white">{member.name}</h1>
          <span
            className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusBadge()}`}
          >
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-12 pb-24 space-y-4 animate-fade-in">
        {/* Days Left Card */}
        <div className={`rounded-2xl shadow-lg p-6 border ${
          member.daysLeft >= 0
            ? member.daysLeft <= 7
              ? 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200'
              : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
            : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
        }`}>
          <p className={`text-sm font-medium mb-2 ${
            member.daysLeft >= 0
              ? member.daysLeft <= 7
                ? 'text-amber-700'
                : 'text-green-700'
              : 'text-red-700'
          }`}>
            Subscription Status
          </p>
          <p className={`text-4xl font-bold ${
            member.daysLeft >= 0
              ? member.daysLeft <= 7
                ? 'text-amber-700'
                : 'text-green-700'
              : 'text-red-700'
          }`}>
            {member.daysLeft >= 0 ? `${member.daysLeft} days` : 'Expired'}
          </p>
          {member.daysLeft < 0 && (
            <p className="text-red-600 text-sm mt-1">
              {Math.abs(member.daysLeft)} days ago
            </p>
          )}
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Contact Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Phone Number</p>
                <p className="font-medium text-slate-800">{member.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="font-medium text-slate-800">{member.name.toLowerCase().replace(' ', '.')}@email.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Subscription Details</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-slate-600 text-sm">Join Date</span>
              </div>
              <span className="font-medium text-slate-800">
                {new Date(member.joinDate).toLocaleDateString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-slate-600 text-sm">End Date</span>
              </div>
              <span className="font-medium text-slate-800">
                {new Date(member.subscriptionEndDate).toLocaleDateString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 text-sm">Member ID</span>
              <span className="font-medium text-slate-800">#{member.id.padStart(4, '0')}</span>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-slate-800">Payment History</h2>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="text-primary-600 text-sm font-medium hover:text-primary-700"
            >
              + Add
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200 mb-4">
            <p className="text-sm text-green-700 mb-1">Total Paid</p>
            <p className="text-3xl font-bold text-green-700">₹{totalPaid.toLocaleString('en-IN')}</p>
          </div>

          {memberPayments.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {memberPayments.slice(0, 5).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">₹{payment.amount.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(payment.date).toLocaleDateString('en-IN')} • {payment.months} month(s)
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full border border-green-200 capitalize">
                    {payment.method === 'upi' ? 'UPI' : payment.method.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 text-sm py-4">No payment history</p>
          )}
        </div>

        {/* Leave Management */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-800">Leave Records</h2>
            </div>
            <button
              onClick={() => setShowLeaveModal(true)}
              className="text-primary-600 text-sm font-medium hover:text-primary-700"
            >
              + Add
            </button>
          </div>

          {memberLeaves.length > 0 ? (
            <div className="space-y-2">
              {memberLeaves.map((leave) => (
                <div key={leave.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-slate-800">{leave.reason}</p>
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                      leave.status === 'approved' 
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : leave.status === 'pending'
                        ? 'bg-amber-100 text-amber-700 border-amber-200'
                        : 'bg-red-100 text-red-700 border-red-200'
                    }`}>
                      {leave.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {new Date(leave.startDate).toLocaleDateString('en-IN')} - {new Date(leave.endDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 text-sm py-4">No leave records</p>
          )}
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 text-green-700 border border-green-200 px-4 py-3 rounded-xl text-center font-medium">
            {successMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-primary-700 transition-colors"
          >
            Record Payment
          </button>
          
          <button className="w-full bg-white text-slate-700 py-3 rounded-xl font-semibold border border-slate-200 hover:bg-slate-50 transition-colors">
            Edit Details
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800">Record Payment</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100"
              >
                <XCircle className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="1500"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Duration (months)</label>
                <input
                  type="number"
                  placeholder="1"
                  defaultValue="1"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
                <select className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                  <option value="bank-transfer">Bank Transfer</option>
                </select>
              </div>

              <button
                onClick={handlePayment}
                disabled={isSubmitting}
                className="w-full bg-primary-600 disabled:bg-primary-400 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  'Record Payment'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800">Add Leave Record</h3>
              <button
                onClick={() => setShowLeaveModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100"
              >
                <XCircle className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Reason</label>
                <textarea
                  placeholder="Family function, vacation, etc."
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <button
                onClick={handleLeaveRequest}
                disabled={isSubmitting}
                className="w-full bg-primary-600 disabled:bg-primary-400 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  'Add Leave Record'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
