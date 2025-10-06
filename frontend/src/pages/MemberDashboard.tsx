import { useState } from 'react';
import { Calendar, QrCode, Utensils, Clock } from 'lucide-react';
import { mockMenu } from '../data/mockData';
import { useMemberAuth } from '../contexts/MemberAuthContext';

export default function MemberDashboard() {
  const { member: mockMemberData } = useMemberAuth();
  const [showQR, setShowQR] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner'>('lunch');

  const today = new Date().toISOString().split('T')[0];
  const todayMenu = mockMenu.filter(m => m.date === today);

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '☀️';
      case 'dinner':
        return '🌙';
      default:
        return '🍽️';
    }
  };

  const getStatusColor = () => {
    if (!mockMemberData) return 'text-slate-600';
    if (mockMemberData.daysLeft <= 3) return 'text-red-600';
    if (mockMemberData.daysLeft <= 7) return 'text-amber-600';
    return 'text-green-600';
  };

  const getStatusBg = () => {
    if (!mockMemberData) return 'bg-slate-50 border-slate-200';
    if (mockMemberData.daysLeft <= 3) return 'bg-red-50 border-red-200';
    if (mockMemberData.daysLeft <= 7) return 'bg-amber-50 border-amber-200';
    return 'bg-green-50 border-green-200';
  };

  // Generate mock QR data
  const qrData = JSON.stringify({
    memberId: mockMemberData?.id || 'unknown',
    mealType: selectedMeal,
    date: today,
    timestamp: Date.now(),
  });

  if (!mockMemberData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 pt-6 pb-16 rounded-b-3xl shadow-xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Welcome Back!</h1>
          <p className="text-white text-sm">{mockMemberData?.name}</p>
        </div>

        {/* Expiry Card */}
        <div className="bg-white/20 backdrop-blur rounded-xl p-4">
          <p className="text-white text-sm mb-2">Subscription Status</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-white">{mockMemberData?.daysLeft} days</p>
              <p className="text-white text-xs mt-1">
                Expires: {new Date(mockMemberData?.subscriptionEndDate || '').toLocaleDateString('en-IN')}
              </p>
            </div>
            <Calendar className="w-10 h-10 text-white/60" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-8 pb-6 space-y-4 animate-fade-in">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowQR(true)}
            className="bg-gradient-to-br from-primary-600 to-primary-700 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <QrCode className="w-8 h-8 text-white mx-auto mb-2" />
            <p className="font-semibold text-sm text-white">Show QR</p>
            <p className="text-xs text-white/80">For attendance</p>
          </button>

          <div className={`${getStatusBg()} border p-4 rounded-xl text-center`}>
            <Clock className={`w-8 h-8 ${getStatusColor()} mx-auto mb-2`} />
            <p className={`font-semibold text-sm ${getStatusColor()}`}>
              {(mockMemberData?.daysLeft || 0) <= 3 ? 'Expiring Soon!' : 'Active'}
            </p>
            <p className="text-xs text-slate-600">{mockMemberData?.daysLeft} days left</p>
          </div>
        </div>

        {/* Today's Menu */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Utensils className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-slate-800">Today's Menu</h2>
          </div>

          <div className="space-y-3">
            {todayMenu.length > 0 ? (
              todayMenu.map((menu) => (
                <div
                  key={menu.id}
                  className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getMealIcon(menu.mealType)}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 capitalize">
                        {menu.mealType}
                      </p>
                      {menu.description && (
                        <p className="text-xs text-slate-500">{menu.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {menu.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white text-slate-700 text-xs font-medium rounded-full border border-slate-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 py-4">No menu available for today</p>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800 font-medium mb-2">💡 How to mark attendance:</p>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Tap "Show QR" button above</li>
            <li>Select your meal (Breakfast/Lunch/Dinner)</li>
            <li>Show the QR code to the manager</li>
            <li>Manager will scan to mark your attendance</li>
          </ol>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-3">Your Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Member ID</span>
              <span className="font-semibold text-slate-800">#{(mockMemberData?.id || '').padStart(4, '0')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Phone</span>
              <span className="font-semibold text-slate-800">{mockMemberData?.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Email</span>
              <span className="font-semibold text-slate-800 text-xs">{mockMemberData?.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Your QR Code</h3>
              <p className="text-slate-600 text-sm">Show this to the manager</p>
            </div>

            {/* Meal Selection */}
            <div className="flex gap-2 mb-6">
              {(['breakfast', 'lunch', 'dinner'] as const).map((meal) => (
                <button
                  key={meal}
                  onClick={() => setSelectedMeal(meal)}
                  className={`flex-1 py-2 rounded-lg font-medium text-sm capitalize transition-all ${
                    selectedMeal === meal
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {meal}
                </button>
              ))}
            </div>

            {/* QR Code Display - In production, use actual QR library */}
            <div className="bg-white p-6 rounded-2xl border-4 border-primary-600 mb-6">
              <div className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="w-32 h-32 text-primary-600 mx-auto mb-4" />
                  <p className="text-xs text-slate-500 font-mono max-w-[200px] break-all">
                    {qrData.substring(0, 50)}...
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
              <p className="text-xs text-green-800 text-center">
                ✓ QR Code for <strong className="capitalize">{selectedMeal}</strong> on{' '}
                {new Date().toLocaleDateString('en-IN')}
              </p>
            </div>

            <button
              onClick={() => setShowQR(false)}
              className="w-full bg-slate-700 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
