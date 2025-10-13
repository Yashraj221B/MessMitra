import { useState } from 'react';
// Core
import { AdminDashboard } from '../components/manager/AdminDashboard';
import { AdminProfile } from '../components/manager/AdminProfile';
// Operations
import { MenuPlannerNew as MenuPlanner } from '../components/manager/operations/MenuPlannerNew';
import { AttendanceNew as Attendance } from '../components/manager/operations/AttendanceNew';
// Finances
import { Billing } from '../components/manager/finances/Billing';
// Communication
import { Announcements } from '../components/manager/communication/Announcements';
import { Notifications } from '../components/manager/communication/Notifications';
import { FeedbackManagement } from '../components/manager';
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
  | 'attendance-present'
  | 'attendance-absent'
  | 'billing' 
  | 'billing-pending'
  | 'announcements' 
  | 'members' 
  | 'ratings' 
  | 'settings' 
  | 'notifications'
  | 'feedback'
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
      case 'attendance-present':
      case 'attendance-absent':
        return (
          <Attendance
            {...commonProps}
            onBack={handleBack}
            initialTab={
              currentScreen === 'attendance-present' ? 'present' :
              currentScreen === 'attendance-absent' ? 'absent' :
              'all'
            }
          />
        );

      case 'billing':
      case 'billing-pending':
        return (
          <Billing
            {...commonProps}
            onBack={handleBack}
            initialFilter={currentScreen === 'billing-pending' ? 'pending' : 'all'}
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

      case 'feedback':
        return (
          <FeedbackManagement
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
