import { useState, useEffect } from 'react';
import { 
  Building2, 
  Filter,
  CheckCircle,
  XCircle,
  Ban,
  RotateCw,
  Eye,
  MapPin,
  Phone,
  Mail,
  Users,
  IndianRupee,
  Calendar,
  Clock,
  Edit,
  Plus
} from 'lucide-react';
import { adminService, type Mess } from '../../../services/admin.service';
import { toast } from 'sonner';
import { AddEditMessModal } from '../modals/AddEditMessModal';

interface MessManagementPageProps {
  searchQuery: string;
  refreshKey: number;
}

export function MessManagementPage({ searchQuery, refreshKey }: MessManagementPageProps) {
  const [messes, setMesses] = useState<Mess[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');
  const [selectedMess, setSelectedMess] = useState<Mess | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messToEdit, setMessToEdit] = useState<Mess | null>(null);

  useEffect(() => {
    loadMesses();
  }, [refreshKey]);

  const loadMesses = async () => {
    try {
      const data = await adminService.getMesses();
      setMesses(data);
    } catch (error: any) {
      toast.error('Failed to load messes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveMess = async (messId: string) => {
    try {
      await adminService.approveMess(messId);
      toast.success('Mess approved successfully');
      loadMesses();
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve mess');
    }
  };

  const handleSuspendMess = async (messId: string) => {
    if (!confirm('Are you sure you want to suspend this mess?')) return;
    try {
      await adminService.suspendMess(messId);
      toast.success('Mess suspended successfully');
      loadMesses();
    } catch (error: any) {
      toast.error(error.message || 'Failed to suspend mess');
    }
  };

  const handleActivateMess = async (messId: string) => {
    try {
      await adminService.activateMess(messId);
      toast.success('Mess activated successfully');
      loadMesses();
    } catch (error: any) {
      toast.error(error.message || 'Failed to activate mess');
    }
  };

  const filteredMesses = messes.filter((mess) => {
    // Status filter
    if (filterStatus !== 'all' && mess.status !== filterStatus) return false;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        mess.name.toLowerCase().includes(query) ||
        mess.address.toLowerCase().includes(query) ||
        mess.ownerName.toLowerCase().includes(query) ||
        mess.ownerPhone.includes(query)
      );
    }
    
    return true;
  });

  const totalMesses = messes.length;
  const activeMesses = messes.filter((mess) => mess.status === 'active').length;
  const suspendedMesses = messes.filter((mess) => mess.status === 'suspended').length;
  const pendingMesses = messes.filter((mess) => mess.status === 'pending').length;

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      suspended: 'bg-red-100 text-red-800 border-red-200',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
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
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Mess Operations</p>
            <h1 className="text-3xl font-semibold leading-snug">Mess Management</h1>
            <p className="max-w-2xl text-sm text-white/80">
              Keep every mess on the platform organised. Review onboarding requests, track performance and
              support managers without leaving this view.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void loadMesses()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/25 hover:shadow-lg"
            >
              <RotateCw className="h-4 w-4" /> Refresh
            </button>
            <button
              type="button"
              onClick={() => {
                setMessToEdit(null);
                setModalMode('add');
                setIsModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2 text-sm font-semibold text-indigo-600 shadow-lg shadow-indigo-900/20 transition hover:-translate-y-0.5 hover:bg-white/90"
            >
              <Plus className="h-4 w-4" /> Add New Mess
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-white/70">Total Messes</span>
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <p className="mt-2 text-3xl font-semibold">{totalMesses}</p>
            <p className="text-xs text-white/75">Across the entire platform</p>
          </div>
          <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-white/70">Active</span>
              <CheckCircle className="h-5 w-5 text-emerald-300" />
            </div>
            <p className="mt-2 text-3xl font-semibold">{activeMesses}</p>
            <p className="text-xs text-white/75">Currently serving members</p>
          </div>
          <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-white/70">Attention</span>
              <Clock className="h-5 w-5 text-amber-300" />
            </div>
            <p className="mt-2 text-3xl font-semibold">{pendingMesses + suspendedMesses}</p>
            <p className="text-xs text-white/75">Pending ({pendingMesses}) · Suspended ({suspendedMesses})</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Filter className="h-4 w-4" />
            <span>Filter by status</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'active', 'pending', 'suspended'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
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
        {searchQuery && (
          <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">
            Showing results for “{searchQuery}”
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {filteredMesses.map((mess) => (
          <div
            key={mess.id}
            className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{mess.name}</h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{mess.address}</span>
                  </div>
                </div>
                {getStatusBadge(mess.status)}
              </div>
            </div>

            {/* Details */}
            <div className="p-6 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {mess.currentMembers}/{mess.capacity} members
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <IndianRupee className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">₹{mess.monthlyFee}/month</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <div className="text-sm text-gray-600 mb-1">Owner Details</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-900">{mess.ownerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-3 h-3" />
                    <span>{mess.ownerPhone}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
                <Calendar className="w-3 h-3" />
                <span>Created {new Date(mess.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedMess(mess)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <Eye className="w-4 h-4" />
                View
              </button>

              <button
                type="button"
                onClick={() => {
                  setMessToEdit(mess);
                  setModalMode('edit');
                  setIsModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              
              {mess.status === 'pending' && (
                <button
                  type="button"
                  onClick={() => handleApproveMess(mess.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
              )}
              
              {mess.status === 'active' && (
                <button
                  type="button"
                  onClick={() => handleSuspendMess(mess.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  <Ban className="w-4 h-4" />
                  Suspend
                </button>
              )}
              
              {mess.status === 'suspended' && (
                <button
                  type="button"
                  onClick={() => handleActivateMess(mess.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <RotateCw className="w-4 h-4" />
                  Activate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredMesses.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 p-16 text-center">
          <Building2 className="mb-4 h-12 w-12 text-slate-300" />
          <p className="text-sm text-slate-500">No messes found for the current filters.</p>
          <button
            type="button"
            onClick={() => {
              setMessToEdit(null);
              setModalMode('add');
              setIsModalOpen(true);
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" /> Add your first mess
          </button>
        </div>
      )}

      {/* Mess Details Modal */}
      {selectedMess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedMess.name}</h2>
                  <p className="text-gray-600 mt-1">{selectedMess.address}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMess(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Status</div>
                  {getStatusBadge(selectedMess.status)}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Capacity</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {selectedMess.currentMembers}/{selectedMess.capacity}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Monthly Fee</div>
                  <div className="text-lg font-semibold text-gray-900">₹{selectedMess.monthlyFee}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Created</div>
                  <div className="text-sm text-gray-900">
                    {new Date(selectedMess.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm font-medium text-gray-600 mb-3">Owner Information</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{selectedMess.ownerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{selectedMess.ownerPhone}</span>
                  </div>
                  {selectedMess.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{selectedMess.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Mess Modal */}
      <AddEditMessModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setMessToEdit(null);
        }}
        onSuccess={() => {
          loadMesses();
        }}
        mess={messToEdit || undefined}
        mode={modalMode}
      />
    </div>
  );
}
