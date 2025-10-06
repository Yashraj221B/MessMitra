import { Navigate } from 'react-router-dom';
import { useMemberAuth } from '../contexts/MemberAuthContext';

interface MemberProtectedRouteProps {
  children: React.ReactNode;
}

export default function MemberProtectedRoute({ children }: MemberProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useMemberAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/member/login" replace />;
  }

  return <>{children}</>;
}
