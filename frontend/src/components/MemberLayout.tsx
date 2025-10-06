import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, User, Home, Settings } from 'lucide-react';
import { useMemberAuth } from '../contexts/MemberAuthContext';

interface MemberLayoutProps {
  children: ReactNode;
}

export default function MemberLayout({ children }: MemberLayoutProps) {
  const navigate = useNavigate();
  const { member, logout } = useMemberAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{member?.name}</p>
              <p className="text-xs text-slate-500">Member Dashboard</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-lg mx-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            <NavLink
              to="/member/dashboard"
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Home className={`w-6 h-6 mb-1 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                    Home
                  </span>
                </>
              )}
            </NavLink>
            <NavLink
              to="/member/settings"
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Settings className={`w-6 h-6 mb-1 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                    Settings
                  </span>
                </>
              )}
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
}
