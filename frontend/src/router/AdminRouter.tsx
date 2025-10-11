import { AdminContainer } from '../components/admin';

interface AdminRouterProps {
  onLogout: () => void;
}

export function AdminRouter({}: AdminRouterProps) {
  return <AdminContainer />;
}
