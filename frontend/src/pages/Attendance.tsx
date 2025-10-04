import { useState } from 'react';
import { CheckCircle, Coffee, Moon } from 'lucide-react';
import { mockMembers } from '../data/mockData';

interface AttendanceState {
  [memberId: string]: {
    lunch: boolean;
    dinner: boolean;
  };
}

export default function Attendance() {
  const activeMembers = mockMembers.filter(
    m => m.subscriptionStatus === 'active' || m.subscriptionStatus === 'expiring-soon'
  );

  const [attendance, setAttendance] = useState<AttendanceState>(() => {
    const initial: AttendanceState = {};
    activeMembers.forEach(member => {
      initial[member.id] = { lunch: false, dinner: false };
    });
    return initial;
  });

  const toggleLunch = (memberId: string) => {
    setAttendance(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        lunch: !prev[memberId].lunch,
      },
    }));
  };

  const toggleDinner = (memberId: string) => {
    setAttendance(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        dinner: !prev[memberId].dinner,
      },
    }));
  };

  const markAllPresent = () => {
    const allPresent: AttendanceState = {};
    activeMembers.forEach(member => {
      allPresent[member.id] = { lunch: true, dinner: true };
    });
    setAttendance(allPresent);
  };

  const lunchCount = Object.values(attendance).filter(a => a.lunch).length;
  const dinnerCount = Object.values(attendance).filter(a => a.dinner).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 pt-8 pb-8 rounded-b-3xl shadow-xl sticky top-0 z-20">
        <h1 className="text-2xl font-bold mb-4 text-white">Today's Attendance</h1>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Coffee className="w-4 h-4 text-white" />
              <span className="text-xs font-medium text-white">Lunch</span>
            </div>
            <p className="text-2xl font-bold text-white">{lunchCount}</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Moon className="w-4 h-4 text-white" />
              <span className="text-xs font-medium text-white">Dinner</span>
            </div>
            <p className="text-2xl font-bold text-white">{dinnerCount}</p>
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 sticky top-[180px] z-10 shadow-sm">
        <button
          onClick={markAllPresent}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          Mark All Present
        </button>
      </div>

      {/* Attendance List */}
      <div className="px-6 py-4 space-y-3 pb-24 animate-fade-in">
        {activeMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-800">{member.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">ID: #{member.id.padStart(4, '0')}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  member.subscriptionStatus === 'expiring-soon'
                    ? 'bg-amber-100 text-amber-700 border-amber-200'
                    : 'bg-green-100 text-green-700 border-green-200'
                }`}
              >
                {member.daysLeft} days left
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => toggleLunch(member.id)}
                className={`py-3 rounded-lg font-medium transition-all ${
                  attendance[member.id].lunch
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Coffee className="w-4 h-4" />
                  <span>Lunch</span>
                </div>
              </button>

              <button
                onClick={() => toggleDinner(member.id)}
                className={`py-3 rounded-lg font-medium transition-all ${
                  attendance[member.id].dinner
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Moon className="w-4 h-4" />
                  <span>Dinner</span>
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="fixed bottom-20 left-0 right-0 px-6 pb-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-6">
        <div className="max-w-lg mx-auto">
          <button
            className="w-full bg-primary-600 text-white py-4 rounded-xl font-semibold shadow-xl hover:bg-primary-700 transition-colors"
          >
            Save Attendance
          </button>
        </div>
      </div>
    </div>
  );
}
