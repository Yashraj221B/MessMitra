import { useNavigate } from 'react-router-dom';
import { Utensils, ShieldCheck, UserCircle } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full animate-fade-in">
        {/* Logo and Branding */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl mb-6 shadow-2xl">
            <Utensils className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3">
            Welcome to MessMitra
          </h1>
          <p className="text-lg text-slate-600">
            Your Complete Mess Management Solution
          </p>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Member Login Card */}
          <button
            onClick={() => navigate('/member/login')}
            className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-8 border-2 border-transparent hover:border-primary-500 text-left"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <UserCircle className="w-9 h-9 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">
              I'm a Member
            </h2>
            <p className="text-slate-600 mb-4">
              Access your meal plans, view today's menu, and mark attendance with QR codes.
            </p>
            <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
              <span>Login with OTP</span>
              <span className="text-xl ml-1">→</span>
            </div>
          </button>

          {/* Manager Login Card */}
          <button
            onClick={() => navigate('/manager/login')}
            className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-8 border-2 border-transparent hover:border-primary-500 text-left"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-9 h-9 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">
              I'm a Manager
            </h2>
            <p className="text-slate-600 mb-4">
              Manage members, track attendance, handle subscriptions, and view reports.
            </p>
            <div className="flex items-center text-primary-600 font-semibold group-hover:gap-2 transition-all">
              <span>Login with Email</span>
              <span className="text-xl ml-1">→</span>
            </div>
          </button>
        </div>

        {/* Features */}
        <div className="bg-white/50 backdrop-blur rounded-2xl p-6 border border-white/60">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">QR Attendance</h3>
              <p className="text-xs text-slate-600">Contactless meal tracking</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Easy Payments</h3>
              <p className="text-xs text-slate-600">Track subscriptions effortlessly</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Smart Reports</h3>
              <p className="text-xs text-slate-600">Data-driven insights</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500">
            New to MessMitra?{' '}
            <button className="text-primary-600 font-semibold hover:text-primary-700">
              Contact your mess manager
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
