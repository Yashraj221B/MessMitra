import { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Lock, Shield, Loader2, Building2 } from 'lucide-react';
import { toast } from 'sonner';

interface UserFormData {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'member';
  messId?: string;
}

interface AddEditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    role: string;
  };
  mode: 'add' | 'edit';
}

export function AddEditUserModal({ isOpen, onClose, onSuccess, user, mode }: AddEditUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [messes, setMesses] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingMesses, setLoadingMesses] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: 'member',
    messId: undefined,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});

  // Reset and populate form data when modal opens or user changes
  useEffect(() => {
    if (isOpen) {
      if (user && mode === 'edit') {
        // Edit mode - populate with existing user data
        setFormData({
          name: user.name || '',
          phone: user.phone || '',
          email: user.email || '',
          password: '',
          role: (user.role as any) || 'member',
          messId: undefined,
        });
      } else {
        // Add mode - reset to defaults
        setFormData({
          name: '',
          phone: '',
          email: '',
          password: '',
          role: 'member',
          messId: undefined,
        });
      }
      setErrors({});
      
      // Load messes for add mode
      if (mode === 'add') {
        loadMesses();
      }
    }
  }, [isOpen, user, mode]);

  const loadMesses = async () => {
    setLoadingMesses(true);
    try {
      const { adminService } = await import('../../../services/admin.service');
      const allMesses = await adminService.getMesses();
      setMesses(allMesses.map(m => ({ id: m.id, name: m.name })));
    } catch (error) {
      console.error('Failed to load messes:', error);
      // Don't show error toast, just log it
    } finally {
      setLoadingMesses(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (mode === 'add' && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (mode === 'add' && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

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
      const { adminService } = await import('../../../services/admin.service');
      
      if (mode === 'add') {
        // Admin creates user - use admin service instead of registration
        const { adminService } = await import('../../../services/admin.service');
        
        await adminService.createUser({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          role: formData.role as 'manager' | 'member',
          messId: formData.messId || null,
        });
        
        toast.success('User created successfully!');
      } else if (user) {
        // Update existing user - check what changed
        const updates: { name?: string; email?: string } = {};
        let changesMade = false;

        // Check for name changes
        if (formData.name !== user.name) {
          updates.name = formData.name;
          changesMade = true;
        }

        // Check for email changes
        if (formData.email !== user.email) {
          updates.email = formData.email;
          changesMade = true;
        }

        // Update user details if changed
        if (Object.keys(updates).length > 0) {
          await adminService.updateUser(user.id, updates);
        }

        // Update role separately if changed
        if (formData.role !== user.role) {
          await adminService.changeUserRole(user.id, formData.role);
          changesMade = true;
        }

        if (changesMade) {
          toast.success('User updated successfully!');
        } else {
          toast.info('No changes made');
        }
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('User operation error:', error);
      toast.error(error.response?.data?.message || `Failed to ${mode} user`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const roleOptions = [
    { value: 'member', label: 'Member', color: 'from-blue-500 to-cyan-500', desc: 'Regular mess member' },
    { value: 'manager', label: 'Manager', color: 'from-purple-500 to-pink-500', desc: 'Can manage a mess' },
    { value: 'admin', label: 'Admin', color: 'from-red-500 to-orange-500', desc: 'Full system access' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {mode === 'add' ? 'Add New User' : 'Edit User'}
              </h2>
              <p className="text-sm text-white/80">
                {mode === 'add' ? 'Create a new user account' : 'Update user information'}
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
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                  disabled={loading}
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="10-digit number"
                  disabled={loading || mode === 'edit'}
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              {mode === 'edit' && <p className="mt-1 text-xs text-gray-500">Phone number cannot be changed</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="email@example.com"
                  disabled={loading || mode === 'edit'}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              {mode === 'edit' && <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>}
            </div>

            {/* Password (only for add mode) */}
            {mode === 'add' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Min. 6 characters"
                    disabled={loading}
                  />
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                User Role <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {roleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: option.value as any })}
                    disabled={loading}
                    className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                      formData.role === option.value
                        ? 'border-transparent shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {formData.role === option.value && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-10 rounded-xl`} />
                    )}
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center mb-2`}>
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div className="font-semibold text-gray-900">{option.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mess Selection (Optional - for Members only) */}
            {mode === 'add' && formData.role === 'member' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assign to Mess (Optional)
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <select
                    value={formData.messId || ''}
                    onChange={(e) => setFormData({ ...formData, messId: e.target.value || undefined })}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                    disabled={loading || loadingMesses}
                  >
                    <option value="">
                      {loadingMesses ? 'Loading messes...' : 'No mess (can join later)'}
                    </option>
                    {messes.map((mess) => (
                      <option key={mess.id} value={mess.id}>
                        {mess.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Members can also join a mess later using QR code
                </p>
              </div>
            )}

            {/* Manager Note */}
            {mode === 'add' && formData.role === 'manager' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Note:</strong> After creating this manager, you can assign them to a mess using "Add New Mess" and selecting them as the owner.
                </p>
              </div>
            )}
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
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Saving...' : mode === 'add' ? 'Create User' : 'Update User'}
          </button>
        </div>
      </div>
    </div>
  );
}
