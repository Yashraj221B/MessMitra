import { LayoutDashboard, Building2, Users, BarChart3, Settings } from 'lucide-react';

interface AdminBottomNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export function AdminBottomNav({ currentScreen, onNavigate }: AdminBottomNavProps) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'messes',
      label: 'Messes',
      icon: Building2,
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-xl transition-all active:scale-95"
              style={{
                background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)' : 'transparent',
              }}
            >
              <div
                className="relative flex items-center justify-center mb-1"
                style={{
                  width: '28px',
                  height: '28px',
                }}
              >
                <Icon
                  className="w-5 h-5 transition-colors"
                  style={{
                    color: isActive ? '#6366F1' : '#9CA3AF',
                    strokeWidth: isActive ? 2.5 : 2,
                  }}
                />
                {isActive && (
                  <div
                    className="absolute inset-0 rounded-full animate-pulse"
                    style={{
                      background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
                    }}
                  />
                )}
              </div>
              <span
                className="text-xs font-medium transition-colors"
                style={{
                  color: isActive ? '#6366F1' : '#9CA3AF',
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
