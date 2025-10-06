import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Phone, Mail, Utensils, ChevronRight, Lock, Bell, HelpCircle, Edit2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Dialog, ConfirmDialog } from '../components/common';

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    messName: user?.messName || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newEnrollments: true,
    expiringSubscriptions: true,
    leaveRequests: true,
    paymentReminders: true,
  });

  if (!user) return null;

  const handleUpdateProfile = () => {
    if (!profileData.name.trim() || !profileData.email.trim() || !profileData.phone.trim() || !profileData.messName.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    // API call would go here
    showToast('Profile updated successfully!', 'success');
    setIsEditProfileOpen(false);
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showToast('Please fill in all password fields', 'error');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    // API call would go here
    showToast('Password changed successfully!', 'success');
    setIsChangePasswordOpen(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleSaveNotifications = () => {
    // API call would go here
    showToast('Notification preferences saved!', 'success');
    setIsNotificationsOpen(false);
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-linear-to-r from-primary-600 to-primary-700 text-white px-6 pt-8 pb-20 rounded-b-3xl shadow-xl">
        <h1 className="text-2xl font-bold mb-2 text-white">Settings</h1>
        <p className="text-white text-sm">Manage your account and mess details</p>
      </div>

      {/* Profile Section */}
      <div className="px-6 -mt-12 pb-24 space-y-4 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-linear-to-br from-primary-50 to-primary-100 p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
                  <p className="text-slate-600 text-sm">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="text-primary-600 hover:text-primary-700 bg-white rounded-full p-2 shadow-sm"
              >
                <Edit2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mess Details */}
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Mess Details
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Mess Name</p>
                  <p className="font-medium text-slate-800">{user.messName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Phone Number</p>
                  <p className="font-medium text-slate-800">{user.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Email Address</p>
                  <p className="font-medium text-slate-800">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <button
            onClick={() => setIsChangePasswordOpen(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-100"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-700">Change Password</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
          
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-100"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-700">Notifications</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-700">Help & Support</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setIsLogoutConfirmOpen(true)}
          className="w-full bg-red-50 text-red-600 py-4 rounded-xl font-semibold border-2 border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>

        {/* App Info */}
        <div className="text-center pt-4">
          <p className="text-slate-400 text-xs">MessMitra v1.0.0</p>
          <p className="text-slate-400 text-xs mt-1">Made with ❤️ for Mess Owners</p>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        title="Edit Profile"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={profileData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileData({ ...profileData, name: e.target.value })}
            placeholder="Enter your name"
          />
          <Input
            label="Email"
            type="email"
            value={profileData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileData({ ...profileData, email: e.target.value })}
            placeholder="your.email@example.com"
          />
          <Input
            label="Phone Number"
            value={profileData.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileData({ ...profileData, phone: e.target.value })}
            placeholder="+91 98765 43210"
          />
          <Input
            label="Mess Name"
            value={profileData.messName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileData({ ...profileData, messName: e.target.value })}
            placeholder="Enter mess name"
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsEditProfileOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile}>Save Changes</Button>
          </div>
        </div>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        title="Change Password"
      >
        <div className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            placeholder="Enter current password"
          />
          <Input
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            placeholder="Enter new password"
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            placeholder="Confirm new password"
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsChangePasswordOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePassword}>Change Password</Button>
          </div>
        </div>
      </Dialog>

      {/* Notifications Dialog */}
      <Dialog
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        title="Notification Preferences"
      >
        <div className="space-y-4">
          <div className="space-y-3">
            {[
              { key: 'newEnrollments', label: 'New Enrollments', desc: 'Get notified when new members enroll' },
              { key: 'expiringSubscriptions', label: 'Expiring Subscriptions', desc: 'Alerts when member subscriptions are expiring' },
              { key: 'leaveRequests', label: 'Leave Requests', desc: 'Notifications for pending leave approvals' },
              { key: 'paymentReminders', label: 'Payment Reminders', desc: 'Reminders for pending payments' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{label}</p>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings[key as keyof typeof notificationSettings]}
                    onChange={(e) =>
                      setNotificationSettings({ ...notificationSettings, [key]: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsNotificationsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNotifications}>Save Preferences</Button>
          </div>
        </div>
      </Dialog>

      {/* Logout Confirmation */}
      <ConfirmDialog
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        variant="warning"
      />
    </div>
  );
}
