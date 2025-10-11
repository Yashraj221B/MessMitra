import { useState, useEffect } from 'react';
import { 
  Users, 
  Filter,
  Ban,
  RotateCw,
  Trash2,
  Eye,
  Phone,
  Mail,
  Building2,
  Shield,
  Calendar,
  XCircle,
  CheckCircle,
  Edit,
  Plus
} from 'lucide-react';
import { adminService, type AppUser } from '../../../services/admin.service';
import { toast } from 'sonner';
import { AddEditUserModal } from '../modals/AddEditUserModal';

interface UserManagementPageProps {
  searchQuery: string;
  refreshKey: number;
}

export function UserManagementPage({ searchQuery, refreshKey }: UserManagementPageProps) {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<'all' | 'manager' | 'member' | 'admin'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended'>('all');
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<AppUser | null>(null);

  useEffect(() => {
    loadUsers();
  }, [refreshKey]);

  const loadUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error: any) {
      toast.error('Failed to load users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendUser = async (userId: string) => {
    if (!confirm('Are you sure you want to suspend this user?')) return;
    try {
      await adminService.suspendUser(userId);
      toast.success('User suspended successfully');
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to suspend user');
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      await adminService.activateUser(userId);
      toast.success('User activated successfully');
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to activate user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await adminService.deleteUser(userId);
      toast.success('User deleted successfully');
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  const handleChangeRole = async (userId: string, newRole: 'manager' | 'member') => {
    try {
      await adminService.changeUserRole(userId, newRole);
      toast.success('User role updated successfully');
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to change user role');
    }
  };

  const filteredUsers = users.filter((user) => {
    // Role filter
    if (filterRole !== 'all' && user.role !== filterRole) return false;
    
    // Status filter
    if (filterStatus !== 'all' && user.status !== filterStatus) return false;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.phone.includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.messName?.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.status === 'active').length;
  const suspendedUsers = users.filter((user) => user.status === 'suspended').length;
  const managersCount = users.filter((user) => user.role === 'manager').length;
  const membersCount = users.filter((user) => user.role === 'member').length;

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-800 border-purple-200',
      manager: 'bg-blue-100 text-blue-800 border-blue-200',
      member: 'bg-green-100 text-green-800 border-green-200',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[role as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-8 pb-10 pt-6">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">People Platform</p>
            <h1 className="text-3xl font-semibold leading-snug">User Management</h1>
            <p className="max-w-2xl text-sm text-white/80">
              Create accounts, manage access levels and keep members in sync with their mess memberships.
              The search bar supports phone, email and mess name lookups instantly.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void loadUsers()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/25 hover:shadow-lg"
            >
              <RotateCw className="h-4 w-4" /> Refresh
            </button>
            <button
              type="button"
              onClick={() => {
                setUserToEdit(null);
                setModalMode('add');
                setIsModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-indigo-900/20 transition hover:-translate-y-0.5 hover:bg-white/90"
            >
              <Plus className="h-4 w-4" /> New User
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-widest text-white/60">Total Users</span>
              <Users className="h-5 w-5 text-white" />
            </div>
            <p className="mt-2 text-3xl font-semibold">{totalUsers}</p>
            <p className="text-xs text-white/75">Managers {managersCount} · Members {membersCount}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-widest text-white/60">Active</span>
              <CheckCircle className="h-5 w-5 text-emerald-300" />
            </div>
            <p className="mt-2 text-3xl font-semibold">{activeUsers}</p>
            <p className="text-xs text-white/75">Ready to access the platform</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-widest text-white/60">Suspended</span>
              <Ban className="h-5 w-5 text-rose-300" />
            </div>
            <p className="mt-2 text-3xl font-semibold">{suspendedUsers}</p>
            <p className="text-xs text-white/75">Users needing review</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-widest text-white/60">Search Results</span>
              <Eye className="h-5 w-5 text-white" />
            </div>
            <p className="mt-2 text-3xl font-semibold">{filteredUsers.length}</p>
            <p className="text-xs text-white/75">Matching current filters</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Filter className="h-4 w-4" />
            <span>Refine by role &amp; status</span>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Role</span>
              {(['all', 'admin', 'manager', 'member'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFilterRole(role)}
                  className={`rounded-full px-3 py-1.5 font-medium transition ${
                    filterRole === role
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</span>
              {(['all', 'active', 'suspended'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilterStatus(status)}
                  className={`rounded-full px-3 py-1.5 font-medium transition ${
                    filterStatus === status
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        {searchQuery && (
          <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">
            Showing results for “{searchQuery}”
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mess
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email || 'No email'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{user.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4">
                    {user.messName ? (
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span>{user.messName}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No mess</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedUser(user)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserToEdit(user);
                          setModalMode('edit');
                          setIsModalOpen(true);
                        }}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      
                      {user.role !== 'admin' && (
                        <>
                          {user.status === 'active' ? (
                            <button
                              type="button"
                              onClick={() => handleSuspendUser(user.id)}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                              title="Suspend User"
                            >
                              <Ban className="w-4 h-4 text-red-600" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleActivateUser(user.id)}
                              className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                              title="Activate User"
                            >
                              <RotateCw className="w-4 h-4 text-green-600" />
                            </button>
                          )}
                          
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      )}
                      
                      {user.role === 'admin' && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 rounded text-xs text-purple-600">
                          <Shield className="w-3 h-3" />
                          <span>Protected</span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 p-16 text-center">
          <Users className="mb-4 h-12 w-12 text-slate-300" />
          <p className="text-sm text-slate-500">No users found for the current filters.</p>
          <button
            type="button"
            onClick={() => {
              setUserToEdit(null);
              setModalMode('add');
              setIsModalOpen(true);
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" /> Invite someone new
          </button>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-2xl">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedUser.name}</h2>
                    <p className="text-gray-600 mt-1">{selectedUser.email || 'No email provided'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Role</div>
                  {getRoleBadge(selectedUser.role)}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Status</div>
                  {getStatusBadge(selectedUser.status)}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Phone</div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Phone className="w-4 h-4" />
                    <span>{selectedUser.phone}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Email</div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Mail className="w-4 h-4" />
                    <span>{selectedUser.email || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              {selectedUser.messName && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-600 mb-2">Mess Information</div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Building2 className="w-4 h-4" />
                    <span className="font-medium">{selectedUser.messName}</span>
                  </div>
                  {selectedUser.joinStatus && (
                    <div className="mt-2 text-sm text-gray-600">
                      Join Status: <span className="font-medium">{selectedUser.joinStatus}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                </div>
                {selectedUser.lastLogin && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                    <Calendar className="w-4 h-4" />
                    <span>Last login {new Date(selectedUser.lastLogin).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {selectedUser.role !== 'admin' && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-600 mb-3">Change Role</div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleChangeRole(selectedUser.id, 'manager')}
                      disabled={selectedUser.role === 'manager'}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Make Manager
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChangeRole(selectedUser.id, 'member')}
                      disabled={selectedUser.role === 'member'}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Make Member
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit User Modal */}
      <AddEditUserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setUserToEdit(null);
        }}
        onSuccess={() => {
          loadUsers();
        }}
        user={userToEdit || undefined}
        mode={modalMode}
      />
    </div>
  );
}
