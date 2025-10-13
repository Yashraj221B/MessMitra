import { useState } from 'react';
import { MemberHome } from '../components/member/MemberHome';
import { LeaveManagement } from '../components/member/LeaveManagement';
import { QRCodeScreen } from '../components/member/QRCodeScreen';
import { Feedback } from '../components/member/Feedback';
import { PaymentHistory } from '../components/member/PaymentHistory';
import { MenuCalendar } from '../components/member/MenuCalendar';
import { FoodRating } from '../components/member/FoodRating';
import { MemberProfile } from '../components/member/MemberProfile';
import { JoinMess } from '../components/member/JoinMess';
import { Notifications } from '../components/member/Notifications';

export type MemberScreen = 
  | 'home' 
  | 'leave' 
  | 'qr-code' 
  | 'feedback' 
  | 'payment' 
  | 'menu-calendar' 
  | 'food-rating' 
  | 'settings'
  | 'join-mess'
  | 'notifications';

interface MemberRouterProps {
  onLogout: () => void;
}

export function MemberRouter({ onLogout }: MemberRouterProps) {
  const [currentScreen, setCurrentScreen] = useState<MemberScreen>('home');

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as MemberScreen);
  };

  const handleBack = () => {
    setCurrentScreen('home');
  };

  const renderScreen = () => {
    const commonProps = {
      currentScreen,
      onNavigate: handleNavigate,
    };

    switch (currentScreen) {
      case 'home':
        return (
          <MemberHome
            {...commonProps}
          />
        );

      case 'leave':
        return (
          <LeaveManagement
            {...commonProps}
            onBack={handleBack}
          />
        );

      case 'qr-code':
        return (
          <QRCodeScreen
            {...commonProps}
            onBack={handleBack}
          />
        );

      case 'feedback':
        return (
          <Feedback
            {...commonProps}
            onBack={handleBack}
          />
        );

      case 'payment':
        return (
          <PaymentHistory
            {...commonProps}
            onBack={handleBack}
          />
        );

      case 'menu-calendar':
        return (
          <MenuCalendar
            {...commonProps}
            onBack={handleBack}
          />
        );

      case 'food-rating':
        return (
          <FoodRating
            {...commonProps}
            onBack={handleBack}
          />
        );

      case 'join-mess':
        return (
          <JoinMess
            {...commonProps}
            onBack={handleBack}
          />
        );

      case 'settings':
        return (
          <MemberProfile
            {...commonProps}
            onBack={handleBack}
            onLogout={onLogout}
          />
        );

      case 'notifications':
        return (
          <Notifications
            {...commonProps}
            onBack={handleBack}
          />
        );

      default:
        return (
          <MemberHome
            {...commonProps}
          />
        );
    }
  };

  return <>{renderScreen()}</>;
}
