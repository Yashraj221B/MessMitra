import { useState } from 'react';
// Core
import { AdminDashboard } from '../components/manager/AdminDashboard';
import { AdminProfile } from '../components/manager/AdminProfile';
// Operations
import { MenuPlanner } from '../components/manager/operations/MenuPlanner';
import { Attendance } from '../components/manager/operations/Attendance';
// Finances
import { Billing } from '../components/manager/finances/Billing';
// Communication
import { Announcements } from '../components/manager/communication/Announcements';
import { Notifications } from '../components/manager/communication/Notifications';
// Management
import { MemberManagement } from '../components/manager/management/MemberManagement';
import { JoinRequests } from '../components/manager/management/JoinRequests';
import { MessQR } from '../components/manager/management/MessQR';
// Analytics
import { RatingsView } from '../components/manager/analytics/RatingsView';

export type ManagerScreen = 
  | 'dashboard' 
  | 'menu-planner' 
  | 'attendance' 
  | 'billing' 
  | 'announcements' 
  | 'members' 
  | 'ratings' 
  | 'settings' 
  | 'notifications'
  | 'mess-qr'
  | 'join-requests';

interface ManagerRouterProps {
  onLogout: () => void;
}

export function ManagerRouter({ onLogout }: ManagerRouterProps) {
  const [currentScreen, setCurrentScreen] = useState<ManagerScreen>('dashboard');

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as ManagerScreen);
  };

  const handleBack = () => {
    setCurrentScreen('dashboard');
  };

  const renderScreen = () => {
    const commonProps = {
      currentScreen,
      onNavigate: handleNavigate,
    };

    switch (currentScreen) {
      case 'dashboard':
        return (
          <AdminDashboard
            {...commonProps}
            onLogout={onLogout}
          />
        );

      case 'menu-planner':
        return (
          <MenuPlanner
            {...commonProps}
            onBack={handleBack}
          />
        );

      case 'attendance':
        return (
          <Attendance
            {...commonProps}
            onBack={handleBack}
          />
        );

      case 'billing':
        return (
          <Billing
            {...commonProps}
            onBack={handleBack}
          />
        );

      case 'announcements':
        return (
          <Announcements
            {...commonProps}
            onBack={handleBack}
          />
        );

      case 'members':
        return (
          <MemberManagement
            {...commonProps}
            onBack={handleBack}
          />
        );

      case 'ratings':
        return (
          <RatingsView
            {...commonProps}
            onBack={handleBack}
          />
        );

      case 'notifications':
        return (
          <Notifications
            {...commonProps}
            onBack={handleBack}
          />
        );

      case 'mess-qr':
        return (
          <MessQR
            {...commonProps}
            onBack={handleBack}
          />
        );

      case 'join-requests':
        return (
          <JoinRequests
            {...commonProps}
            onBack={handleBack}
          />
        );

      case 'settings':
        return (
          <AdminProfile
            {...commonProps}
            onBack={handleBack}
            onLogout={onLogout}
          />
        );

      default:
        return (
          <AdminDashboard
            {...commonProps}
            onLogout={onLogout}
          />
        );
    }
  };

  return <>{renderScreen()}</>;
}
