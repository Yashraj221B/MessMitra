import { useNavigate } from 'react-router-dom';
import { Users, AlertCircle, CheckCircle, Utensils } from 'lucide-react';
import { mockMembers, mockAttendance } from '../data/mockData';

export default function Dashboard() {
  const navigate = useNavigate();

  // Calculate today's headcount
  const todayDate = '2025-10-04';
  const todayAttendance = mockAttendance.filter(a => a.date === todayDate);
  const lunchCount = todayAttendance.filter(a => a.lunch).length;
  const dinnerCount = todayAttendance.filter(a => a.dinner).length;

  // Calculate upcoming renewals (within 7 days)
  const upcomingRenewals = mockMembers.filter(
    m => m.subscriptionStatus === 'expiring-soon' && m.daysLeft <= 7
  ).length;

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
          onClick={() => navigate('/attendance')}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          Mark Today's Attendance
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
    </div>
  );
}
