import { useState, useEffect, lazy, Suspense } from 'react';
import { RoleSelection } from '../components/RoleSelection';
import { Login } from '../components/Login';
import { MobileContainer } from '../components/MobileContainer';
import type { Role } from '../types';

// Lazy load routers for better performance
const AdminRouter = lazy(() => import('./AdminRouter').then(m => ({ default: m.AdminRouter })));
const ManagerRouter = lazy(() => import('./ManagerRouter').then(m => ({ default: m.ManagerRouter })));
const MemberRouter = lazy(() => import('./MemberRouter').then(m => ({ default: m.MemberRouter })));

export type AppScreen = 'role-selection' | 'login' | 'app';

export function AppRouter() {
  const [screen, setScreen] = useState<AppScreen>('role-selection');
  const [role, setRole] = useState<Role | null>(null);

  // Initialize app and restore session (using JWT tokens from cookies)
  useEffect(() => {
    // Check if user has valid JWT token in cookies
    // The backend will validate the token automatically
    // For now, just start at role selection
    // TODO: Add auto-login with JWT token validation
  }, []);

  // Handle role selection
  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    
    // Set default language based on role
    if (!localStorage.getItem('messmitra-language')) {
      const defaultLanguage = selectedRole === 'manager' ? 'marathi' : 'english';
      localStorage.setItem('messmitra-language', defaultLanguage);
    }
    
    setScreen('login');
  };

  // Handle successful login
  const handleLoginSuccess = () => {
    if (role) {
      localStorage.setItem('messmitra-role', role);
      localStorage.setItem('messmitra-auth', 'true');
    }
    
    // Store user data as basic details (admin has already provided everything)
    try {
      const currentUserStr = localStorage.getItem('current-user');
      if (currentUserStr) {
        const userData = JSON.parse(currentUserStr);
        localStorage.setItem('messmitra-basic-details', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    
    // All users go directly to app (admin has created all accounts with complete details)
    setScreen('app');
  };

  // Handle logout
  const handleLogout = () => {
    setRole(null);
    setScreen('role-selection');
    localStorage.removeItem('messmitra-role');
    localStorage.removeItem('messmitra-auth');
    localStorage.removeItem('messmitra-basic-details');
    localStorage.removeItem('messmitra-language');
    localStorage.removeItem('current-user');
  };

  // Handle back navigation
  const handleBack = () => {
    if (screen === 'login') {
      setScreen('role-selection');
      setRole(null);
      localStorage.removeItem('messmitra-auth');
      localStorage.removeItem('current-user');
    }
  };

  // Render appropriate screen
  // Admin gets full-width desktop layout, others get mobile container
  const content = (() => {
    switch (screen) {
      case 'role-selection':
        return <RoleSelection onSelectRole={handleRoleSelect} />;
      
      case 'login':
        return (
          <Login
            role={role!}
            onBack={handleBack}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      
      case 'app':
        return (
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-slate-100">
              <div className="text-center">
                <div className="animate-spin w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600 font-semibold text-lg">Loading dashboard...</p>
                <p className="text-gray-500 text-sm mt-2">Please wait while we prepare your workspace</p>
              </div>
            </div>
          }>
            {role === 'admin' ? (
              // Admin gets full desktop layout - NO mobile container
              <AdminRouter onLogout={handleLogout} />
            ) : role === 'manager' ? (
              <ManagerRouter onLogout={handleLogout} />
            ) : (
              <MemberRouter onLogout={handleLogout} />
            )}
          </Suspense>
        );
      
      default:
        return null;
    }
  })();

  // Wrap non-admin screens in mobile container
  if (screen === 'app' && role === 'admin') {
    return content;
  }

  return <MobileContainer>{content}</MobileContainer>;
}
