import { useState, useEffect } from 'react';
import { Users, Building2, TrendingUp, IndianRupee, AlertCircle, CheckCircle, Clock, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { AdminBottomNav } from './AdminBottomNav';
import { Card, CardContent } from '../ui/card';
import { adminService, type PlatformStats } from '../../services/admin.service';

interface PlatformAdminDashboardProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export function PlatformAdminDashboard({ currentScreen, onNavigate }: PlatformAdminDashboardProps) {
  const [stats, setStats] = useState<PlatformStats>({
    totalMesses: 0,
    activeMesses: 0,
    pendingMesses: 0,
    suspendedMesses: 0,
    totalManagers: 0,
    totalMembers: 0,
    activeMembers: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    averageRating: 0,
    totalFeedbacks: 0,
  });

  useEffect(() => {
    loadPlatformStats();
  }, []);

  const loadPlatformStats = async () => {
    try {
      const data = await adminService.getPlatformStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading platform stats:', error);
      toast.error('Failed to load platform statistics');
    }
  };

  const statCards = [
    {
      title: 'Total Messes',
      value: stats.totalMesses,
      icon: Building2,
      color: '#0B8043',
      bgColor: 'rgba(11, 128, 67, 0.1)',
      change: `${stats.activeMesses} active`,
    },
    {
      title: 'Total Managers',
      value: stats.totalManagers,
      icon: Shield,
      color: '#2563EB',
      bgColor: 'rgba(37, 99, 235, 0.1)',
    },
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: Users,
      color: '#7C3AED',
      bgColor: 'rgba(124, 58, 237, 0.1)',
    },
    {
      title: 'Active Users',
      value: stats.totalUsers,
      icon: CheckCircle,
      color: '#059669',
      bgColor: 'rgba(5, 150, 105, 0.1)',
    },
  ];

  const actionCards = [
    {
      title: 'Pending Verifications',
      value: stats.pendingMesses,
      icon: Clock,
      color: '#F59E0B',
      action: () => onNavigate('verifications'),
    },
    {
      title: 'Avg Rating',
      value: stats.averageRating.toFixed(1),
      icon: AlertCircle,
      color: '#EF4444',
      action: () => onNavigate('support'),
    },
    {
      title: 'Platform Revenue',
      value: `₹${(stats.totalRevenue / 1000).toFixed(1)}K`,
      icon: IndianRupee,
      color: '#10B981',
      action: () => onNavigate('revenue'),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="px-5 pt-6 pb-5 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white text-2xl font-bold mb-1">Platform Admin</h1>
            <p className="text-indigo-100 text-sm">MessMitra Control Center</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="text-indigo-100 text-xs mb-1">Active Messes</div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-300" />
              <span className="text-white text-lg font-bold">{stats.activeMesses}</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="text-indigo-100 text-xs mb-1">Total Revenue</div>
            <div className="text-white text-lg font-bold">₹{(stats.totalRevenue / 1000).toFixed(0)}K</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-5 pb-24">
        {/* Platform Stats */}
        <div className="mb-6">
          <h2 className="text-gray-800 font-bold text-lg mb-3">Platform Overview</h2>
          <div className="grid grid-cols-2 gap-3">
            {statCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div
                      className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center"
                      style={{ backgroundColor: card.bgColor }}
                    >
                      <card.icon className="w-5 h-5" style={{ color: card.color }} />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
                    <div className="text-sm text-gray-600">{card.title}</div>
                    {card.change && (
                      <div className="text-xs text-green-600 font-semibold mt-1">{card.change}</div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Items */}
        <div className="mb-6">
          <h2 className="text-gray-800 font-bold text-lg mb-3">Action Required</h2>
          <div className="space-y-3">
            {actionCards.map((card, index) => (
              <motion.button
                key={card.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                onClick={card.action}
                className="w-full"
              >
                <Card className="border-none shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${card.color}15` }}
                      >
                        <card.icon className="w-6 h-6" style={{ color: card.color }} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm text-gray-600 mb-1">{card.title}</div>
                        <div className="text-2xl font-bold" style={{ color: card.color }}>
                          {card.value}
                        </div>
                      </div>
                      <div className="text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-gray-800 font-bold text-lg mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('messes')}
              className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <Building2 className="w-8 h-8 text-indigo-600 mb-2" />
              <div className="text-sm font-semibold text-gray-900">Manage Messes</div>
            </button>
            <button
              onClick={() => onNavigate('users')}
              className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <Users className="w-8 h-8 text-purple-600 mb-2" />
              <div className="text-sm font-semibold text-gray-900">Manage Users</div>
            </button>
            <button
              onClick={() => onNavigate('analytics')}
              className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
              <div className="text-sm font-semibold text-gray-900">Analytics</div>
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <Shield className="w-8 h-8 text-blue-600 mb-2" />
              <div className="text-sm font-semibold text-gray-900">Settings</div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <AdminBottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
    </div>
  );
}
