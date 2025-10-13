import { useState, useEffect } from 'react';
import { RoleSelection } from '../components/RoleSelection';
import { Login } from '../components/Login';
import { BasicDetails } from '../components/BasicDetails';
import { ManagerRouter } from './ManagerRouter';
import { MemberRouter } from './MemberRouter';
import { initializeMockDatabase } from '../utils/mockDatabase';
import type { Role } from '../types';

export type AppScreen = 'role-selection' | 'login' | 'basic-details' | 'app';

export function AppRouter() {
  const [screen, setScreen] = useState<AppScreen>('role-selection');
  const [role, setRole] = useState<Role | null>(null);

  // Initialize app and restore session
  useEffect(() => {
    initializeMockDatabase();
    
    const savedRole = localStorage.getItem('messmitra-role') as Role;
    const savedAuth = localStorage.getItem('messmitra-auth') === 'true';
    const savedBasicDetails = localStorage.getItem('messmitra-basic-details');
    
    if (savedRole && savedAuth && savedBasicDetails) {
      setRole(savedRole);
      setScreen('app');
    }
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
  const handleLoginSuccess = (isExistingUser: boolean) => {
    if (role) {
      localStorage.setItem('messmitra-role', role);
      localStorage.setItem('messmitra-auth', 'true');
    }
    
    // If existing user with complete profile, go to app
    if (isExistingUser) {
      const currentUser = localStorage.getItem('current-user');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        if (userData.name) {
          localStorage.setItem('messmitra-basic-details', JSON.stringify(userData));
          setScreen('app');
          return;
        }
      }
    }
    
    // New user or incomplete profile, go to basic details
    setScreen('basic-details');
  };

  // Handle basic details completion
  const handleBasicDetailsComplete = (details: any) => {
    const currentUser = localStorage.getItem('current-user');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      const completeData = { ...userData, ...details };
      localStorage.setItem('current-user', JSON.stringify(completeData));
    }
    localStorage.setItem('messmitra-basic-details', JSON.stringify(details));
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
    } else if (screen === 'basic-details') {
      setScreen('login');
      localStorage.removeItem('messmitra-auth');
      localStorage.removeItem('current-user');
    }
  };

  // Render appropriate screen
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
    
    case 'basic-details':
      return (
        <BasicDetails
          role={role!}
          onBack={handleBack}
          onComplete={handleBasicDetailsComplete}
        />
      );
    
    case 'app':
      return role === 'manager' ? (
        <ManagerRouter onLogout={handleLogout} />
      ) : (
        <MemberRouter onLogout={handleLogout} />
      );
    
    default:
      return null;
  }
}
