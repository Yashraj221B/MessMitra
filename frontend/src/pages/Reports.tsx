import { TrendingUp, Users, Utensils, IndianRupee, Calendar } from 'lucide-react';
import { mockMembers, mockPayments, mockAttendance } from '../data/mockData';

export default function Reports() {
  // Calculate statistics
  const totalMembers = mockMembers.length;
  const activeMembers = mockMembers.filter(
    m => m.subscriptionStatus === 'active' || m.subscriptionStatus === 'expiring-soon'
  ).length;
  const expiredMembers = mockMembers.filter(m => m.subscriptionStatus === 'expired').length;

  // Calculate revenue
  const totalRevenue = mockPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const thisMonthRevenue = mockPayments
    .filter(p => {
      const paymentDate = new Date(p.date);
      const now = new Date();
      return paymentDate.getMonth() === now.getMonth() && 
             paymentDate.getFullYear() === now.getFullYear() &&
             p.status === 'completed';
    })
    .reduce((sum, p) => sum + p.amount, 0);

  // Calculate meal stats (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  });

  const totalMealsServed = mockAttendance.filter(a => 
    last7Days.includes(a.date)
  ).reduce((sum, a) => sum + (a.lunch ? 1 : 0) + (a.dinner ? 1 : 0), 0);

  // New members this month
  const newMembersThisMonth = mockMembers.filter(m => {
    const joinDate = new Date(m.joinDate);
    const now = new Date();
    return joinDate.getMonth() === now.getMonth() && 
           joinDate.getFullYear() === now.getFullYear();
  }).length;

  // Payment method breakdown
  const paymentMethods = mockPayments
    .filter(p => p.status === 'completed')
    .reduce((acc, p) => {
      acc[p.method] = (acc[p.method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 pt-8 pb-8 rounded-b-3xl shadow-xl sticky top-0 z-20">
        <h1 className="text-2xl font-bold mb-2 text-white">Reports & Analytics</h1>
        <p className="text-white text-sm">Monthly performance overview</p>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-4 pb-24 animate-fade-in">
        {/* Revenue Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-xs text-slate-600">Total Revenue</p>
            </div>
            <p className="text-2xl font-bold text-slate-800">₹{totalRevenue.toLocaleString('en-IN')}</p>
            <p className="text-xs text-green-600 mt-1">All time</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs text-slate-600">This Month</p>
            </div>
            <p className="text-2xl font-bold text-slate-800">₹{thisMonthRevenue.toLocaleString('en-IN')}</p>
            <p className="text-xs text-blue-600 mt-1">October 2025</p>
          </div>
        </div>

        {/* Member Statistics */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-slate-800">Member Statistics</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600">Total Members</span>
              <span className="text-lg font-bold text-slate-800">{totalMembers}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
              <span className="text-sm text-green-700">Active Members</span>
              <span className="text-lg font-bold text-green-700">{activeMembers}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
              <span className="text-sm text-red-700">Expired</span>
              <span className="text-lg font-bold text-red-700">{expiredMembers}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
              <span className="text-sm text-blue-700">New This Month</span>
              <span className="text-lg font-bold text-blue-700">{newMembersThisMonth}</span>
            </div>
          </div>
        </div>

        {/* Meal Statistics */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Utensils className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-slate-800">Meal Statistics</h2>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
            <p className="text-sm text-orange-700 mb-2">Total Meals Served</p>
            <p className="text-4xl font-bold text-orange-700">{totalMealsServed}</p>
            <p className="text-xs text-orange-600 mt-2">Last 7 days</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <p className="text-xs text-slate-600 mb-1">Avg/Day</p>
              <p className="text-xl font-bold text-slate-800">
                {Math.round(totalMealsServed / 7)}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <p className="text-xs text-slate-600 mb-1">Avg/Member</p>
              <p className="text-xl font-bold text-slate-800">
                {activeMembers > 0 ? Math.round((totalMealsServed / 7) / activeMembers * 2) : 0}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-slate-800">Payment Methods</h2>
          </div>

          <div className="space-y-2">
            {Object.entries(paymentMethods).map(([method, count]) => (
              <div key={method} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-700 capitalize">
                  {method === 'upi' ? 'UPI' : method.replace('-', ' ')}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-600"
                      style={{ width: `${(count / mockPayments.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-800 min-w-[2rem] text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Indicator */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl shadow-sm border border-primary-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700 mb-1">Growth Rate</p>
              <p className="text-3xl font-bold text-primary-700">
                {totalMembers > 0 ? Math.round((newMembersThisMonth / totalMembers) * 100) : 0}%
              </p>
              <p className="text-xs text-primary-600 mt-1">This month</p>
            </div>
            <TrendingUp className="w-16 h-16 text-primary-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
