import { useNavigate } from 'react-router-dom';
import { LogOut, User, Phone, Mail, Utensils, ChevronRight } from 'lucide-react';
import { mockUser } from '../data/mockData';

export default function Settings() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Mock logout - just navigate to login
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-linear-to-r from-primary-600 to-primary-700 text-white px-6 pt-8 pb-20 rounded-b-3xl shadow-xl">
        <h1 className="text-2xl font-bold mb-2 text-white">Settings</h1>
        <p className="text-white text-sm">Manage your account and mess details</p>
      </div>

      {/* Profile Section */}
      <div className="px-6 -mt-12 pb-24 space-y-4 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-linear-to-br from-primary-50 to-primary-100 p-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{mockUser.name}</h2>
                <p className="text-slate-600 text-sm">{mockUser.email}</p>
              </div>
            </div>
          </div>

          {/* Mess Details */}
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Mess Details
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Mess Name</p>
                  <p className="font-medium text-slate-800">{mockUser.messName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Phone Number</p>
                  <p className="font-medium text-slate-800">{mockUser.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Email Address</p>
                  <p className="font-medium text-slate-800">{mockUser.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-100">
            <span className="font-medium text-slate-700">Edit Profile</span>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-100">
            <span className="font-medium text-slate-700">Change Password</span>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-100">
            <span className="font-medium text-slate-700">Notifications</span>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
            <span className="font-medium text-slate-700">Help & Support</span>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-600 py-4 rounded-xl font-semibold border-2 border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>

        {/* App Info */}
        <div className="text-center pt-4">
          <p className="text-slate-400 text-xs">MessMitra v1.0.0</p>
          <p className="text-slate-400 text-xs mt-1">Made with ❤️ for Mess Owners</p>
        </div>
      </div>
    </div>
  );
}
