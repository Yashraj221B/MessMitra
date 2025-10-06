import { useState } from 'react';
import { Lock, Bell, HelpCircle, LogOut, Edit2 } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Dialog, ConfirmDialog } from '../components/common';
import { useMemberAuth } from '../contexts/MemberAuthContext';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

export function MemberSettings() {
  const { member, logout } = useMemberAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const [profileData, setProfileData] = useState({
    name: member?.name || '',
    phone: member?.phone || '',
    email: member?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    messUpdates: true,
    menuChanges: true,
    subscriptionReminders: true,
    leaveApprovals: true,
  });

  const handleUpdateProfile = () => {
    if (!profileData.name.trim() || !profileData.phone.trim()) {
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
    navigate('/member/login');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Profile Info */}
      <Card className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Profile Information</h2>
            <p className="text-sm text-gray-500">Your personal details</p>
          </div>
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="text-green-600 hover:text-green-700"
          >
            <Edit2 className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Name</span>
            <span className="font-medium text-gray-900">{member?.name}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Phone</span>
            <span className="font-medium text-gray-900">{member?.phone}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Email</span>
            <span className="font-medium text-gray-900">{member?.email || 'Not provided'}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Member ID</span>
            <span className="font-medium text-gray-900">{member?.id}</span>
          </div>
        </div>
      </Card>

      {/* Settings Options */}
      <div className="space-y-3">
        <button
          onClick={() => setIsChangePasswordOpen(true)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-gray-400" />
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Change Password</h3>
              <p className="text-sm text-gray-500">Update your password</p>
            </div>
          </div>
          <span className="text-gray-400">›</span>
        </button>

        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-gray-400" />
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-500">Manage notification preferences</p>
            </div>
          </div>
          <span className="text-gray-400">›</span>
        </button>

        <button
          className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="h-5 w-5 text-gray-400" />
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Help & Support</h3>
              <p className="text-sm text-gray-500">Get help or contact support</p>
            </div>
          </div>
          <span className="text-gray-400">›</span>
        </button>

        <button
          onClick={() => setIsLogoutConfirmOpen(true)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-red-200 hover:border-red-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <LogOut className="h-5 w-5 text-red-500" />
            <div className="text-left">
              <h3 className="font-medium text-red-600">Logout</h3>
              <p className="text-sm text-gray-500">Sign out of your account</p>
            </div>
          </div>
        </button>
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
            label="Phone Number"
            value={profileData.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileData({ ...profileData, phone: e.target.value })}
            placeholder="+91 98765 43210"
          />
          <Input
            label="Email (optional)"
            type="email"
            value={profileData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileData({ ...profileData, email: e.target.value })}
            placeholder="your.email@example.com"
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
              { key: 'messUpdates', label: 'Mess Updates', desc: 'Notifications about mess status and announcements' },
              { key: 'menuChanges', label: 'Menu Changes', desc: 'Get notified when daily menu is updated' },
              { key: 'subscriptionReminders', label: 'Subscription Reminders', desc: 'Reminders about subscription renewal' },
              { key: 'leaveApprovals', label: 'Leave Approvals', desc: 'Updates on your leave request status' },
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
