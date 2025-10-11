import { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  IndianRupee, 
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { adminService, type PlatformStats } from '../../../services/admin.service';
import { toast } from 'sonner';

export function DashboardOverview() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await adminService.getPlatformStats();
      setStats(data);
    } catch (error: any) {
      toast.error('Failed to load statistics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Failed to load dashboard data
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Messes',
      value: stats.totalMesses,
      icon: Building2,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      change: `${stats.activeMesses} active`,
      trend: 'up' as const
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      change: `${stats.activeMembers} active`,
      trend: 'up' as const
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      change: `₹${stats.pendingPayments} pending`,
      trend: 'down' as const
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      change: `${stats.totalFeedbacks} reviews`,
      trend: 'up' as const
    },
  ];

  const statusCards = [
    {
      title: 'Pending Messes',
      value: stats.pendingMesses,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Suspended Messes',
      value: stats.suspendedMesses,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Total Managers',
      value: stats.totalManagers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Monitor your platform's performance and key metrics</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const TrendIcon = card.trend === 'up' ? ArrowUp : ArrowDown;
          
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-3">{card.value}</p>
                  <div className="flex items-center gap-1.5 mt-3">
                    <TrendIcon className={`w-3.5 h-3.5 ${card.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className="text-xs font-medium text-gray-600">{card.change}</span>
                  </div>
                </div>
                <div className={`${card.color} rounded-xl p-3 shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statusCards.map((card, index) => {
          const Icon = card.icon;
          
          return (
            <div
              key={index}
              className={`${card.bgColor} rounded-xl p-6 border border-gray-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className={`text-2xl font-bold ${card.color} mt-1`}>{card.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${card.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left">
            <CheckCircle className="w-6 h-6 text-indigo-600 mb-2" />
            <div className="font-medium text-gray-900">Approve Pending Messes</div>
            <div className="text-sm text-gray-600">{stats.pendingMesses} awaiting approval</div>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left">
            <IndianRupee className="w-6 h-6 text-indigo-600 mb-2" />
            <div className="font-medium text-gray-900">Review Payments</div>
            <div className="text-sm text-gray-600">₹{stats.pendingPayments} pending</div>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left">
            <AlertCircle className="w-6 h-6 text-indigo-600 mb-2" />
            <div className="font-medium text-gray-900">View Feedback</div>
            <div className="text-sm text-gray-600">{stats.totalFeedbacks} total reviews</div>
          </button>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health</h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Active Messes</span>
              <span className="text-sm font-semibold text-gray-900">
                {stats.activeMesses}/{stats.totalMesses}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${(stats.activeMesses / stats.totalMesses) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Active Members</span>
              <span className="text-sm font-semibold text-gray-900">
                {stats.activeMembers}/{stats.totalMembers}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${(stats.activeMembers / (stats.totalMembers || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
