import { useMemo, useState, lazy, Suspense } from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  IndianRupee,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu
} from 'lucide-react';
import { storageService } from '../../services/storage.service';

// Lazy load page components for better performance
const DashboardOverview = lazy(() => import('./dashboard/DashboardOverview.tsx').then(m => ({ default: m.DashboardOverview })));
const MessManagementPage = lazy(() => import('./dashboard/MessManagementPage.tsx').then(m => ({ default: m.MessManagementPage })));
const UserManagementPage = lazy(() => import('./dashboard/UserManagementPage.tsx').then(m => ({ default: m.UserManagementPage })));
const PaymentManagementPage = lazy(() => import('./dashboard/PaymentManagementPage.tsx').then(m => ({ default: m.PaymentManagementPage })));
const FeedbackManagementPage = lazy(() => import('./dashboard/FeedbackManagementPage.tsx').then(m => ({ default: m.FeedbackManagementPage })));
const AnalyticsPage = lazy(() => import('./dashboard/AnalyticsPage.tsx').then(m => ({ default: m.AnalyticsPage })));
const SettingsPage = lazy(() => import('./dashboard/SettingsPage.tsx').then(m => ({ default: m.SettingsPage })));

type Page = 'dashboard' | 'messes' | 'users' | 'payments' | 'feedback' | 'analytics' | 'settings';

export function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [messRefreshKey, ] = useState(0);
  const [userRefreshKey, ] = useState(0);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      storageService.clearAuth();
      window.location.href = '/';
    }
  };

  const navSections = useMemo(
    () => [
      {
        title: 'Overview',
        items: [
          {
            id: 'dashboard' as Page,
            label: 'Executive Summary',
            description: 'Platform health & KPIs',
            icon: LayoutDashboard
          },
          {
            id: 'analytics' as Page,
            label: 'Analytics',
            description: 'Usage trends & adoption',
            icon: BarChart3
          }
        ]
      },
      {
        title: 'Operations',
        items: [
          {
            id: 'messes' as Page,
            label: 'Mess Management',
            description: 'Approve, edit & supervise',
            icon: Building2
          },
          {
            id: 'users' as Page,
            label: 'User Management',
            description: 'Roles, access & members',
            icon: Users
          },
          {
            id: 'payments' as Page,
            label: 'Payments',
            description: 'Dues, settlements & ledger',
            icon: IndianRupee
          },
          {
            id: 'feedback' as Page,
            label: 'Feedback & Ratings',
            description: 'Member insights & responses',
            icon: MessageSquare
          }
        ]
      },
      {
        title: 'Control',
        items: [
          {
            id: 'settings' as Page,
            label: 'Platform Settings',
            description: 'Policies & preferences',
            icon: Settings
          }
        ]
      }
    ],
    []
  );

  const searchPlaceholder = useMemo(() => {
    switch (currentPage) {
      case 'messes':
        return 'Search messes by name, owner or location...';
      case 'users':
        return 'Search members by name, phone or mess...';
      case 'payments':
        return 'Search payments by user, mess or status...';
      case 'feedback':
        return 'Search feedback by mess, user or keyword...';
      default:
        return 'Search across MessMitra admin data...';
    }
  }, [currentPage]);

  const handleChangePage = (page: Page) => {
    setCurrentPage(page);
    // Close sidebar on mobile after navigation
    setSidebarOpen(false);
  };

  const renderPage = () => {
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading page...</p>
          </div>
        </div>
      }>
        {(() => {
          switch (currentPage) {
            case 'dashboard':
              return <DashboardOverview />;
            case 'messes':
              return (
                <MessManagementPage
                  searchQuery={searchQuery}
                  refreshKey={messRefreshKey}
                />
              );
            case 'users':
              return (
                <UserManagementPage
                  searchQuery={searchQuery}
                  refreshKey={userRefreshKey}
                />
              );
            case 'payments':
              return <PaymentManagementPage searchQuery={searchQuery} />;
            case 'feedback':
              return <FeedbackManagementPage searchQuery={searchQuery} />;
            case 'analytics':
              return <AnalyticsPage />;
            case 'settings':
              return <SettingsPage />;
            default:
              return <DashboardOverview />;
          }
        })()}
      </Suspense>
    );
  };



  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 text-slate-900">
      {/* Backdrop overlay - only visible on mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Fixed overlay on mobile, static on desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 flex-shrink-0 transform bg-white transition-transform duration-300 ease-in-out border-r border-slate-200 shadow-xl lg:relative lg:z-auto lg:translate-x-0 lg:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 px-6 py-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-lg font-bold text-white shadow-lg">
              MM
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">MessMitra Admin</p>
              <p className="text-xs text-slate-500">Control Center</p>
            </div>
          </div>

          <nav className="flex-1 space-y-6 overflow-y-auto px-4 pb-6">
            {navSections.map((section) => (
              <div key={section.title}>
                <p className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {section.title}
                </p>
                <div className="mt-2 space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleChangePage(item.id)}
                        className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm ${
                              isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </span>
                          <div className="space-y-0.5">
                            <p className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-800'}`}>
                              {item.label}
                            </p>
                            <p className={`text-xs ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="border-t border-slate-200 px-4 py-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-between rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <span className="flex items-center gap-2">
                <LogOut className="h-4 w-4" /> Logout
              </span>
              <span className="text-xs text-red-400">Secure exit</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex-shrink-0 border-b border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-4 px-4 py-4 lg:px-6">
            {/* Mobile menu button - only visible on mobile/tablet */}
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 lg:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-700 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex items-center gap-3">
              <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div className="flex items-center gap-3 rounded-2xl bg-slate-100 px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-semibold text-white">
                  A
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-slate-800">Admin</p>
                  <p className="text-slate-500">Super Administrator</p>
                </div>
              </div>
            </div>
          </div>


        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
