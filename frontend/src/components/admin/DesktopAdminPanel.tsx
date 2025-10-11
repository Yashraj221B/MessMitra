import { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Search, 
  CheckCircle,
  Trash2,
  Ban,
  RotateCw
} from 'lucide-react';
import { toast } from 'sonner';
import { adminService, type PlatformStats, type Mess, type AppUser } from '../../services/admin.service';
import { storageService } from '../../services/storage.service';

export function DesktopAdminPanel() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'messes' | 'users'>('dashboard');
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [messes, setMesses] = useState<Mess[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const statsData = await adminService.getPlatformStats();
        setStats(statsData);
      } else if (activeTab === 'messes') {
        const messesData = await adminService.getMesses();
        setMesses(messesData);
      } else if (activeTab === 'users') {
        const usersData = await adminService.getUsers();
        setUsers(usersData);
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    storageService.clearAuth();
    window.location.href = '/';
  };

  const handleApproveMess = async (messId: string) => {
    try {
      await adminService.approveMess(messId);
      toast.success('Mess approved successfully');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve mess');
    }
  };

  const handleSuspendMess = async (messId: string) => {
    if (!confirm('Are you sure you want to suspend this mess?')) return;
    try {
      await adminService.suspendMess(messId);
      toast.success('Mess suspended successfully');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to suspend mess');
    }
  };

  const handleActivateMess = async (messId: string) => {
    try {
      await adminService.activateMess(messId);
      toast.success('Mess activated successfully');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to activate mess');
    }
  };

  const handleSuspendUser = async (userId: string) => {
    if (!confirm('Are you sure you want to suspend this user?')) return;
    try {
      await adminService.suspendUser(userId);
      toast.success('User suspended successfully');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to suspend user');
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      await adminService.activateUser(userId);
      toast.success('User activated successfully');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to activate user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await adminService.deleteUser(userId);
      toast.success('User deleted successfully');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  const handleChangeUserRole = async (userId: string, newRole: 'manager' | 'member') => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    try {
      await adminService.changeUserRole(userId, newRole);
      toast.success('User role changed successfully');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to change user role');
    }
  };

  // Filter data based on search
  const filteredMesses = messes.filter(mess => 
    mess.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mess.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MessMitra Admin Panel</h1>
                <p className="text-sm text-gray-500">Platform Administration</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition ${
                activeTab === 'dashboard'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Dashboard
              </div>
            </button>
            <button
              onClick={() => setActiveTab('messes')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition ${
                activeTab === 'messes'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Messes
              </div>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition ${
                activeTab === 'users'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Users
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && stats && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Platform Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Messes"
                    value={stats.totalMesses}
                    subtitle={`${stats.activeMesses} active, ${stats.suspendedMesses} suspended`}
                    icon={Building2}
                    color="blue"
                  />
                  <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    subtitle={`${stats.totalManagers} managers, ${stats.totalMembers} members`}
                    icon={Users}
                    color="green"
                  />
                  <StatCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    subtitle={`₹${stats.pendingPayments.toLocaleString()} pending`}
                    icon={TrendingUp}
                    color="purple"
                  />
                  <StatCard
                    title="Average Rating"
                    value={stats.averageRating.toFixed(1)}
                    subtitle={`${stats.totalFeedbacks} feedbacks`}
                    icon={CheckCircle}
                    color="yellow"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Health</h3>
                    <div className="space-y-3">
                      <HealthItem label="Active Messes" value={stats.activeMesses} total={stats.totalMesses} />
                      <HealthItem label="Active Members" value={stats.activeMembers} total={stats.totalMembers} />
                      <HealthItem label="Pending Verifications" value={stats.pendingMesses} alert />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveTab('messes')}
                        className="w-full px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition text-left flex items-center justify-between"
                      >
                        <span>Manage Messes</span>
                        <Building2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setActiveTab('users')}
                        className="w-full px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-left flex items-center justify-between"
                      >
                        <span>Manage Users</span>
                        <Users className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Messes Tab */}
            {activeTab === 'messes' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Messes Management</h2>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search messes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mess Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Owner
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Members
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Monthly Fee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredMesses.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                            No messes found
                          </td>
                        </tr>
                      ) : (
                        filteredMesses.map((mess) => (
                          <tr key={mess.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{mess.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{mess.ownerName}</div>
                              <div className="text-sm text-gray-500">{mess.ownerPhone}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 max-w-xs truncate">{mess.address}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {mess.currentMembers} / {mess.capacity}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">₹{mess.monthlyFee}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                mess.status === 'active' 
                                  ? 'bg-green-100 text-green-800'
                                  : mess.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {mess.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end gap-2">
                                {mess.status === 'pending' && (
                                  <button
                                    onClick={() => handleApproveMess(mess.id)}
                                    className="text-green-600 hover:text-green-900"
                                    title="Approve"
                                  >
                                    <CheckCircle className="w-5 h-5" />
                                  </button>
                                )}
                                {mess.status === 'active' && (
                                  <button
                                    onClick={() => handleSuspendMess(mess.id)}
                                    className="text-red-600 hover:text-red-900"
                                    title="Suspend"
                                  >
                                    <Ban className="w-5 h-5" />
                                  </button>
                                )}
                                {mess.status === 'suspended' && (
                                  <button
                                    onClick={() => handleActivateMess(mess.id)}
                                    className="text-green-600 hover:text-green-900"
                                    title="Activate"
                                  >
                                    <RotateCw className="w-5 h-5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mess
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.id.substring(0, 8)}...</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.phone}</div>
                              <div className="text-sm text-gray-500">{user.email || 'No email'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.role === 'admin'
                                  ? 'bg-purple-100 text-purple-800'
                                  : user.role === 'manager'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.messName || 'No mess'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.status === 'active' 
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end gap-2">
                                {/* Admin users cannot be modified */}
                                {user.role === 'admin' ? (
                                  <span className="text-xs text-gray-500 italic">System Admin</span>
                                ) : (
                                  <>
                                    {user.status === 'active' ? (
                                      <button
                                        onClick={() => handleSuspendUser(user.id)}
                                        className="text-red-600 hover:text-red-900"
                                        title="Suspend"
                                      >
                                        <Ban className="w-5 h-5" />
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleActivateUser(user.id)}
                                        className="text-green-600 hover:text-green-900"
                                        title="Activate"
                                      >
                                        <RotateCw className="w-5 h-5" />
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleDeleteUser(user.id)}
                                      className="text-red-600 hover:text-red-900"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-5 h-5" />
                                    </button>
                                    <select
                                      value={user.role}
                                      onChange={(e) => handleChangeUserRole(user.id, e.target.value as 'manager' | 'member')}
                                      className="text-sm border border-gray-300 rounded px-2 py-1"
                                    >
                                      <option value="manager">Manager</option>
                                      <option value="member">Member</option>
                                    </select>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// Helper Components
function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: string | number; 
  subtitle: string; 
  icon: any; 
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

function HealthItem({ 
  label, 
  value, 
  total, 
  alert 
}: { 
  label: string; 
  value: number; 
  total?: number; 
  alert?: boolean;
}) {
  const percentage = total ? (value / total) * 100 : 0;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-700">{label}</span>
        <span className={`text-sm font-medium ${alert && value > 0 ? 'text-red-600' : 'text-gray-900'}`}>
          {value}{total && ` / ${total}`}
        </span>
      </div>
      {total && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${alert ? 'bg-red-600' : 'bg-indigo-600'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}
