import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, AlertCircle, CheckCircle, Utensils, UserPlus, Clock, QrCode, XCircle, IndianRupee } from 'lucide-react';
import { mockMembers, mockAttendance, mockPendingMembers } from '../data/mockData';

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedPending, setSelectedPending] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Calculate today's headcount
  const todayDate = '2025-10-06';
  const todayAttendance = mockAttendance.filter(a => a.date === todayDate);
  const lunchCount = todayAttendance.filter(a => a.lunch).length;
  const dinnerCount = todayAttendance.filter(a => a.dinner).length;

  // Calculate upcoming renewals (within 7 days)
  const upcomingRenewals = mockMembers.filter(
    m => m.subscriptionStatus === 'expiring-soon' && m.daysLeft <= 7
  ).length;

  const hasMembers = mockMembers.length > 0;
  const hasPendingApprovals = mockPendingMembers.length > 0;

  const handleApprove = (memberId: string) => {
    setSelectedPending(memberId);
    setShowPaymentModal(true);
  };

  const handleReject = async (_memberId: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In production: await api.rejectMember(_memberId)
      alert('Member enrollment rejected');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSubmit = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // In production: await api.approveMember(selectedPending, paymentData)
      alert('Member approved and activated!');
      setShowPaymentModal(false);
      setSelectedPending(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Empty state when no members exist
  if (!hasMembers) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 pt-8 pb-20 rounded-b-3xl shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">MessMitra</h1>
              <p className="text-white text-sm">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="px-6 -mt-12 pb-24 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 text-center">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-primary-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Welcome to MessMitra!</h2>
            <p className="text-slate-600 mb-6">
              Get started by adding your first member to begin managing your mess.
            </p>
            <button
              onClick={() => navigate('/add-member')}
              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-primary-700 transition-colors"
            >
              Add First Member
            </button>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800 font-medium mb-2">💡 Quick Tip</p>
            <p className="text-sm text-blue-700">
              Once you add members, you'll be able to track attendance, manage subscriptions, and generate reports from this dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 pt-8 pb-20 rounded-b-3xl shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Utensils className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">MessMitra</h1>
            <p className="text-white text-sm">Dashboard</p>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-white text-sm mb-1">Today's Date</p>
          <p className="text-xl font-semibold text-white">
            {new Date(todayDate).toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-12 pb-6 space-y-4 animate-fade-in">
        {/* Pending Approvals Section */}
        {hasPendingApprovals && (
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl shadow-xl p-6 border border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Pending Approvals</h2>
                  <p className="text-white/80 text-xs">{mockPendingMembers.length} new enrollment(s)</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/generate-qr')}
                className="bg-white/20 backdrop-blur px-3 py-2 rounded-lg text-white text-sm font-medium hover:bg-white/30 transition-colors flex items-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                New QR
              </button>
            </div>

            <div className="space-y-2">
              {mockPendingMembers.map((member) => (
                <div key={member.id} className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-white">{member.name}</p>
                      <p className="text-white/70 text-sm">{member.phone}</p>
                      <p className="text-white/60 text-xs mt-1">{member.email}</p>
                    </div>
                    <div className="flex items-center gap-1 text-white/80 text-xs">
                      <Clock className="w-3 h-3" />
                      {new Date(member.enrollmentDate).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleApprove(member.id)}
                      disabled={isProcessing}
                      className="bg-green-600 disabled:bg-green-400 text-white py-2 rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(member.id)}
                      disabled={isProcessing}
                      className="bg-red-600/80 disabled:bg-red-400 text-white py-2 rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Today's Headcount Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">Today's Headcount</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
              <p className="text-orange-600 text-sm font-medium mb-1">Lunch</p>
              <p className="text-3xl font-bold text-orange-700">{lunchCount}</p>
              <p className="text-orange-600 text-xs mt-1">members</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <p className="text-blue-600 text-sm font-medium mb-1">Dinner</p>
              <p className="text-3xl font-bold text-blue-700">{dinnerCount}</p>
              <p className="text-blue-600 text-xs mt-1">members</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Total active members</span>
              <span className="font-semibold text-slate-800">{mockMembers.filter(m => m.subscriptionStatus === 'active' || m.subscriptionStatus === 'expiring-soon').length}</span>
            </div>
          </div>
        </div>

        {/* Upcoming Renewals Card */}
        <div 
          className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => navigate('/members?filter=expiring')}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-800">Upcoming Renewals</h2>
              <p className="text-slate-500 text-sm">Next 7 days</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-5xl font-bold text-amber-700">{upcomingRenewals}</p>
                <p className="text-amber-600 text-sm mt-1">members expiring soon</p>
              </div>
              <Users className="w-12 h-12 text-amber-400" />
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-primary-600 text-sm font-medium">Tap to view details →</p>
          </div>
        </div>

        {/* Quick Action */}
        <button
          onClick={() => navigate('/generate-qr')}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <UserPlus className="w-6 h-6" />
          <span>Generate Enrollment QR</span>
        </button>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="bg-white rounded-xl p-4 text-center border border-slate-100 shadow-sm">
            <p className="text-2xl font-bold text-green-600">
              {mockMembers.filter(m => m.subscriptionStatus === 'active').length}
            </p>
            <p className="text-xs text-slate-600 mt-1">Active</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center border border-slate-100 shadow-sm">
            <p className="text-2xl font-bold text-amber-600">
              {mockMembers.filter(m => m.subscriptionStatus === 'expiring-soon').length}
            </p>
            <p className="text-xs text-slate-600 mt-1">Expiring</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center border border-slate-100 shadow-sm">
            <p className="text-2xl font-bold text-red-600">
              {mockMembers.filter(m => m.subscriptionStatus === 'expired').length}
            </p>
            <p className="text-xs text-slate-600 mt-1">Expired</p>
          </div>
        </div>
      </div>

      {/* Payment Modal for Approval */}
      {showPaymentModal && selectedPending && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800">Activate Member</h3>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedPending(null);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100"
              >
                <XCircle className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {(() => {
              const pending = mockPendingMembers.find(m => m.id === selectedPending);
              return pending ? (
                <>
                  <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-200">
                    <p className="text-xs text-slate-600 mb-1">Approving</p>
                    <p className="font-bold text-slate-800">{pending.name}</p>
                    <p className="text-sm text-slate-600">{pending.phone}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Amount (₹) *
                      </label>
                      <input
                        type="number"
                        placeholder="1500"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Duration (months) *
                      </label>
                      <input
                        type="number"
                        placeholder="1"
                        defaultValue="1"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Payment Method *
                      </label>
                      <select className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option value="cash">Cash</option>
                        <option value="upi">UPI</option>
                        <option value="card">Card</option>
                        <option value="bank-transfer">Bank Transfer</option>
                      </select>
                    </div>

                    <button
                      onClick={handlePaymentSubmit}
                      disabled={isProcessing}
                      className="w-full bg-primary-600 disabled:bg-primary-400 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <IndianRupee className="w-5 h-5" />
                          Approve & Record Payment
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : null;
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
