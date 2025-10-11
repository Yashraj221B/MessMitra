import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, ShieldPlus, X } from 'lucide-react';
import { adminService, type AppUser, type CreateUserInput, type Mess } from '../../../services/admin.service';
import { toast } from 'sonner';

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (user: AppUser) => void;
}

interface FormValues {
  name: string;
  phone: string;
  email?: string;
  password: string;
  role: 'manager' | 'member';
  messId?: string;
}

export function CreateUserModal({ open, onClose, onCreated }: CreateUserModalProps) {
  const [messes, setMesses] = useState<Mess[]>([]);
  const [loadingMesses, setLoadingMesses] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
      role: 'member',
      messId: ''
    }
  });

  const selectedRole = watch('role');

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      name: '',
      phone: '',
      email: '',
      password: '',
      role: 'member',
      messId: ''
    });

    void loadMesses();
  }, [open, reset]);

  const loadMesses = async () => {
    try {
      setLoadingMesses(true);
      const data = await adminService.getMesses();
      setMesses(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load mess list');
    } finally {
      setLoadingMesses(false);
    }
  };

  const activeMessOptions = useMemo(() => {
    return messes
      .filter((mess) => mess.status === 'active')
      .map((mess) => ({ id: mess.id, name: mess.name }));
  }, [messes]);

  const closeModal = () => {
    if (submitting) return;
    onClose();
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true);

      if (!values.name?.trim()) {
        toast.error('Name is required');
        return;
      }

      if (!values.phone?.trim()) {
        toast.error('Phone number is required');
        return;
      }

      if (!values.password) {
        toast.error('Temporary password is required');
        return;
      }

      if (values.role === 'member' && !values.messId) {
        toast.error('Select a mess for the member');
        return;
      }

      const payload: CreateUserInput = {
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email?.trim() || null,
        password: values.password,
        role: values.role,
        messId: values.messId ? values.messId : null
      };

      const user = await adminService.createUser(payload);
      toast.success('User account created successfully');
      onCreated(user);
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-8">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Create User Account</h2>
            <p className="text-sm text-slate-500">Set up a new manager or member access</p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="max-h-[80vh] space-y-5 overflow-y-auto px-6 py-6">
          <div className="grid gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="User full name"
              />
              {errors.name && <span className="text-xs text-red-600">{errors.name.message}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Phone Number</label>
              <input
                type="tel"
                {...register('phone', { required: 'Phone number is required' })}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="10-digit mobile number"
              />
              {errors.phone && <span className="text-xs text-red-600">{errors.phone.message}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                {...register('email')}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="Optional email address"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Temporary Password</label>
              <input
                type="password"
                {...register('password', { required: 'Password is required', minLength: { value: 4, message: 'Use at least 4 characters' } })}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="Set a temporary password"
              />
              {errors.password && <span className="text-xs text-red-600">{errors.password.message}</span>}
              <span className="text-xs text-slate-500">Ask the user to change the password after first login.</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Role</label>
                <select
                  {...register('role')}
                  className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="manager">Manager</option>
                  <option value="member">Member</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Assign to Mess</label>
                <div className="relative">
                  <select
                    {...register('messId')}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">{selectedRole === 'member' ? 'Select mess (required)' : 'Optional'}</option>
                    {activeMessOptions.map((mess) => (
                      <option key={mess.id} value={mess.id}>
                        {mess.name}
                      </option>
                    ))}
                  </select>
                  {loadingMesses && (
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
                  )}
                </div>
                {selectedRole === 'member' && (
                  <span className="text-xs text-slate-500">Members must belong to a mess.</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldPlus className="h-4 w-4" />}<span>Create User</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
