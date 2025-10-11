import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Plus, UserPlus, X } from 'lucide-react';
import { adminService, type AppUser, type CreateMessInput, type Mess } from '../../../services/admin.service';
import { toast } from 'sonner';

interface CreateMessModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (mess: Mess) => void;
}

type ManagerMode = 'existing' | 'new';

interface FormValues {
  name: string;
  address: string;
  capacity: number;
  monthlyFee: number;
  phone?: string;
  email?: string;
  description?: string;
  securityDeposit?: number;
  ownerId?: string;
  managerName?: string;
  managerPhone?: string;
  managerEmail?: string;
  managerPassword?: string;
}

export function CreateMessModal({ open, onClose, onCreated }: CreateMessModalProps) {
  const [managerMode, setManagerMode] = useState<ManagerMode>('existing');
  const [managers, setManagers] = useState<AppUser[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(false);
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
      address: '',
      capacity: 50,
      monthlyFee: 2500,
      phone: '',
      email: '',
      description: '',
      securityDeposit: 0,
      ownerId: ''
    }
  });

  const selectedOwnerId = watch('ownerId');

  useEffect(() => {
    if (!open) {
      return;
    }

    setManagerMode('existing');
    reset({
      name: '',
      address: '',
      capacity: 50,
      monthlyFee: 2500,
      phone: '',
      email: '',
      description: '',
      securityDeposit: 0,
      ownerId: ''
    });

    void loadManagers();
  }, [open, reset]);

  const loadManagers = async () => {
    try {
      setLoadingManagers(true);
      const data = await adminService.getManagers();
      setManagers(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load managers');
    } finally {
      setLoadingManagers(false);
    }
  };

  const managerOptions = useMemo(() => {
    return managers.map((manager) => ({
      id: manager.id,
      label: manager.messName ? `${manager.name} • ${manager.messName}` : manager.name,
      disabled: manager.status !== 'active'
    }));
  }, [managers]);

  const closeModal = () => {
    if (submitting) return;
    onClose();
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true);

      let ownerId = values.ownerId || '';

      if (managerMode === 'existing') {
        if (!ownerId) {
          toast.error('Select a manager to own this mess');
          return;
        }
      } else {
        if (!values.managerName || !values.managerPhone || !values.managerPassword) {
          toast.error('Provide manager details to create a new account');
          return;
        }

        const newManager = await adminService.createUser({
          name: values.managerName.trim(),
          phone: values.managerPhone.trim(),
          email: values.managerEmail?.trim() || null,
          password: values.managerPassword,
          role: 'manager'
        });

        ownerId = newManager.id;
      }

      const payload: CreateMessInput = {
        name: values.name.trim(),
        address: values.address.trim(),
        capacity: Number(values.capacity),
        monthlyFee: Number(values.monthlyFee),
        ownerId,
        phone: values.phone?.trim() || null,
        email: values.email?.trim() || null,
        description: values.description?.trim() || null,
        securityDeposit: values.securityDeposit ? Number(values.securityDeposit) : 0
      };

      const mess = await adminService.createMess(payload);
      toast.success('Mess created successfully');
      onCreated(mess);
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create mess');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-8">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Create New Mess</h2>
            <p className="text-sm text-slate-500">Add a new mess and assign an owner manager</p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="max-h-[80vh] space-y-6 overflow-y-auto px-6 py-6">
          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Mess Details</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Mess Name</label>
                <input
                  type="text"
                  {...register('name', { required: 'Mess name is required' })}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="Shree Sai Mess"
                />
                {errors.name && <span className="text-xs text-red-600">{errors.name.message}</span>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Monthly Fee (₹)</label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  {...register('monthlyFee', {
                    required: 'Monthly fee is required',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Monthly fee cannot be negative' }
                  })}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
                {errors.monthlyFee && <span className="text-xs text-red-600">{errors.monthlyFee.message}</span>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Capacity</label>
                <input
                  type="number"
                  min={1}
                  {...register('capacity', {
                    required: 'Capacity is required',
                    valueAsNumber: true,
                    min: { value: 1, message: 'Capacity must be at least 1' }
                  })}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
                {errors.capacity && <span className="text-xs text-red-600">{errors.capacity.message}</span>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Security Deposit (₹)</label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  {...register('securityDeposit', { valueAsNumber: true, min: { value: 0, message: 'Security deposit cannot be negative' } })}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
                {errors.securityDeposit && <span className="text-xs text-red-600">{errors.securityDeposit.message}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Address</label>
              <textarea
                rows={3}
                {...register('address', { required: 'Address is required' })}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="Complete mess address"
              />
              {errors.address && <span className="text-xs text-red-600">{errors.address.message}</span>}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Contact Phone</label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="Manager phone number"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Contact Email</label>
                <input
                  type="email"
                  {...register('email')}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="contact@messmitra.com"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea
                rows={3}
                {...register('description')}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="Share a short description about facilities, timings, etc."
              />
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Assign Owner</h3>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <button
                    type="button"
                    onClick={() => setManagerMode('existing')}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 transition ${
                      managerMode === 'existing'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Existing
                  </button>
                  <button
                    type="button"
                    onClick={() => setManagerMode('new')}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 transition ${
                      managerMode === 'new'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    New Manager
                  </button>
                </div>
              </div>
            </div>

            {managerMode === 'existing' ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Select Manager</label>
                <div className="relative">
                  <select
                    {...register('ownerId')}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">Choose a manager</option>
                    {managerOptions.map((option) => (
                      <option key={option.id} value={option.id} disabled={option.disabled}>
                        {option.label}
                        {option.disabled ? ' (suspended)' : ''}
                      </option>
                    ))}
                  </select>
                  {loadingManagers && (
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
                  )}
                </div>
                {!selectedOwnerId && (
                  <p className="text-xs text-slate-500">Only active managers can be assigned as owners.</p>
                )}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Manager Name</label>
                  <input
                    type="text"
                    {...register('managerName')}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    placeholder="Manager full name"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Phone</label>
                  <input
                    type="tel"
                    {...register('managerPhone')}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    placeholder="Manager phone number"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Email (optional)</label>
                  <input
                    type="email"
                    {...register('managerEmail')}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    placeholder="manager@messmitra.com"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Temporary Password</label>
                  <input
                    type="password"
                    {...register('managerPassword')}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    placeholder="Set a temporary password"
                  />
                  <span className="text-xs text-slate-500">Share the password with the manager so they can log in.</span>
                </div>
              </div>
            )}
          </section>

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
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}<span>Create Mess</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
