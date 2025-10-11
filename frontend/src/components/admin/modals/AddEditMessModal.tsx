import { useState, useEffect } from 'react';
import { X, Building2, MapPin, IndianRupee, Users, Loader2, User } from 'lucide-react';
import { toast } from 'sonner';

interface MessFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  monthlyFee: number;
  capacity: number;
  ownerId: string;
}

interface AddEditMessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mess?: {
    id: string;
    name: string;
    address: string;
    phone: string | null;
    email: string | null;
    monthlyFee: number;
    capacity: number;
  };
  mode: 'add' | 'edit';
}

export function AddEditMessModal({ isOpen, onClose, onSuccess, mess, mode }: AddEditMessModalProps) {
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState<Array<{ id: string; name: string; phone: string }>>([]);
  const [loadingManagers, setLoadingManagers] = useState(false);
  const [formData, setFormData] = useState<MessFormData>({
    name: '',
    address: '',
    phone: '',
    email: '',
    monthlyFee: 0,
    capacity: 50,
    ownerId: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof MessFormData, string>>>({});

  // Reset and populate form data when modal opens or mess changes
  useEffect(() => {
    if (isOpen) {
      if (mess && mode === 'edit') {
        // Edit mode - populate with existing mess data
        setFormData({
          name: mess.name || '',
          address: mess.address || '',
          phone: mess.phone || '',
          email: mess.email || '',
          monthlyFee: mess.monthlyFee || 0,
          capacity: mess.capacity || 50,
          ownerId: '', // Not editable in edit mode
        });
      } else {
        // Add mode - reset to defaults
        setFormData({
          name: '',
          address: '',
          phone: '',
          email: '',
          monthlyFee: 0,
          capacity: 50,
          ownerId: '',
        });
      }
      setErrors({});
      
      // Load managers for add mode
      if (mode === 'add') {
        loadManagers();
      }
    }
  }, [isOpen, mess, mode]);

  const loadManagers = async () => {
    setLoadingManagers(true);
    try {
      const { adminService } = await import('../../../services/admin.service');
      const allManagers = await adminService.getManagers();
      // Filter managers who don't already own a mess
      const availableManagers = allManagers.filter(m => !m.messId);
      setManagers(availableManagers);
    } catch (error) {
      console.error('Failed to load managers:', error);
      toast.error('Failed to load managers');
    } finally {
      setLoadingManagers(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof MessFormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'Mess name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (mode === 'add' && !formData.ownerId) newErrors.ownerId = 'Please select a manager';
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (formData.monthlyFee < 0) newErrors.monthlyFee = 'Monthly fee cannot be negative';
    if (formData.capacity <= 0) newErrors.capacity = 'Capacity must be positive';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'add') {
        // Admin creates mess - use admin service
        const { adminService } = await import('../../../services/admin.service');
        await adminService.createMess({
          name: formData.name,
          ownerId: formData.ownerId,
          address: formData.address,
          capacity: formData.capacity,
          monthlyFee: formData.monthlyFee,
          phone: formData.phone || null,
          email: formData.email || null,
        });
        toast.success('Mess created successfully! Manager has been assigned.');
      } else if (mess) {
        // Update existing mess - use mess service
        const { messService } = await import('../../../services/mess.service');
        await messService.updateMess(mess.id, {
          name: formData.name,
          address: formData.address,
          monthlyFee: formData.monthlyFee,
          maxMembers: formData.capacity,
        } as any);
        toast.success('Mess updated successfully!');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Mess operation error:', error);
      toast.error(error.response?.data?.message || `Failed to ${mode} mess`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {mode === 'add' ? 'Add New Mess' : 'Edit Mess'}
              </h2>
              <p className="text-sm text-white/80">
                {mode === 'add' ? 'Create a new mess in the system' : 'Update mess information'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-5">
            {/* Mess Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mess Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Shivaji Mess"
                  disabled={loading}
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Owner/Manager Selection (Add mode only) */}
            {mode === 'add' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assign Manager <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <select
                    value={formData.ownerId}
                    onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none ${
                      errors.ownerId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading || loadingManagers}
                  >
                    <option value="">
                      {loadingManagers ? 'Loading managers...' : 'Select a manager'}
                    </option>
                    {managers.map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.name} - {manager.phone}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.ownerId && <p className="mt-1 text-sm text-red-500">{errors.ownerId}</p>}
                {!loadingManagers && managers.length === 0 && (
                  <p className="mt-1 text-sm text-amber-600">
                    ⚠️ No available managers. Create a manager user first!
                  </p>
                )}
              </div>
            )}

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter complete address"
                  rows={3}
                  disabled={loading}
                />
              </div>
              {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
            </div>

            {/* Phone & Email Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="10-digit number"
                  disabled={loading}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="email@example.com"
                  disabled={loading}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
            </div>

            {/* Monthly Fee & Capacity Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Monthly Fee <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.monthlyFee}
                    onChange={(e) => setFormData({ ...formData, monthlyFee: parseInt(e.target.value) || 0 })}
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                      errors.monthlyFee ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    disabled={loading}
                  />
                </div>
                {errors.monthlyFee && <p className="mt-1 text-sm text-red-500">{errors.monthlyFee}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Capacity <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                      errors.capacity ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="50"
                    disabled={loading}
                  />
                </div>
                {errors.capacity && <p className="mt-1 text-sm text-red-500">{errors.capacity}</p>}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Saving...' : mode === 'add' ? 'Create Mess' : 'Update Mess'}
          </button>
        </div>
      </div>
    </div>
  );
}
