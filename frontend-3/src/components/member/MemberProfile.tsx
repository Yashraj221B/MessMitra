import { useState, useEffect } from 'react';
import { ArrowLeft, User, GraduationCap, Phone, Edit2, Save, X, LogOut, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { toast } from 'sonner';
import { updateUser } from '../../utils/mockDatabase';

interface MemberProfileProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
  onLogout?: () => void;
}

export function MemberProfile({ onBack, onLogout }: Pick<MemberProfileProps, 'onBack' | 'onLogout'>) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [education, setEducation] = useState('');
  const [phone, setPhone] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    try {
      const currentUser = localStorage.getItem('current-user');
      if (currentUser) {
        const data = JSON.parse(currentUser);
        setName(data.name || '');
        setEducation(data.education || '');
        setPhone(data.phone || '');
        setNotifications(data.notifications !== false); // default to true
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);

  const handleSave = () => {
    try {
      const currentUser = localStorage.getItem('current-user');
      if (currentUser) {
        const data = JSON.parse(currentUser);
        const updatedData = {
          ...data,
          name,
          education,
          notifications
        };
        
        // Update in localStorage
        localStorage.setItem('current-user', JSON.stringify(updatedData));
        localStorage.setItem('messmitra-basic-details', JSON.stringify({
          name,
          education
        }));
        
        // Update in database
        updateUser(data.phone, 'member', { name, education, notifications });
        
        toast.success('Profile updated successfully! ✅');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      toast.error('Failed to save profile');
    }
  };

  const handleCancel = () => {
    // Reload original data
    try {
      const currentUser = localStorage.getItem('current-user');
      if (currentUser) {
        const data = JSON.parse(currentUser);
        setName(data.name || '');
        setEducation(data.education || '');
        setNotifications(data.notifications !== false);
      }
    } catch (error) {
      console.error('Error reloading user data:', error);
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    try {
      localStorage.clear();
      if (onLogout) {
        onLogout();
      }
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFBFC' }}>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 pt-6 pb-5" 
        style={{ 
          background: 'linear-gradient(135deg, #0B8043 0%, #48C479 100%)',
          boxShadow: '0 8px 24px rgba(11, 128, 67, 0.12)'
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl active:scale-95 transition-all"
            style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white flex-1 text-center" style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
            Account Settings
          </h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-xl active:scale-95 transition-all"
              style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}
            >
              <Edit2 className="w-5 h-5 text-white" />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="p-2 rounded-xl active:scale-95 transition-all"
                style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={handleSave}
                className="p-2 rounded-xl active:scale-95 transition-all"
                style={{ background: 'rgba(255, 255, 255, 0.95)' }}
              >
                <Save className="w-5 h-5" style={{ color: '#0B8043' }} />
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        {/* Profile Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 text-center"
        >
          <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ 
            background: 'linear-gradient(135deg, #E8F5E9 0%, #F1F8F4 100%)',
            border: '4px solid white',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}>
            <span style={{ fontSize: '3rem' }}>🎓</span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1A1F36', marginBottom: '4px' }}>
            {name}
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            Student
          </p>
        </motion.div>

        {/* Profile Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="p-4 rounded-2xl" style={{ background: 'white', border: '1.5px solid #E5E7EB' }}>
            <Label style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
              Your Name
            </Label>
            {isEditing ? (
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 rounded-xl border-2"
                style={{ fontSize: '0.9375rem' }}
              />
            ) : (
              <div className="flex items-center gap-3">
                <User className="w-5 h-5" style={{ color: '#6B7280' }} />
                <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1A1F36' }}>{name}</span>
              </div>
            )}
          </div>

          {/* Education */}
          <div className="p-4 rounded-2xl" style={{ background: 'white', border: '1.5px solid #E5E7EB' }}>
            <Label style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
              Education Details
            </Label>
            {isEditing ? (
              <Input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="h-11 rounded-xl border-2"
                style={{ fontSize: '0.9375rem' }}
              />
            ) : (
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5" style={{ color: '#6B7280' }} />
                <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1A1F36' }}>{education}</span>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="p-4 rounded-2xl" style={{ background: 'white', border: '1.5px solid #E5E7EB' }}>
            <Label style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
              Notifications
            </Label>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5" style={{ color: '#6B7280' }} />
                <div>
                  <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1A1F36', display: 'block', marginBottom: '2px' }}>Enable Notifications</span>
                  <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Get updates about menu changes and more</span>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className="w-12 h-7 rounded-full transition-all duration-200 relative"
                style={{
                  background: notifications ? '#0B8043' : '#E5E7EB',
                  padding: '2px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}
                aria-pressed={notifications}
                role="switch"
              >
                <div
                  className="w-5 h-5 rounded-full transition-all duration-200 absolute"
                  style={{
                    background: 'white',
                    left: notifications ? '26px' : '2px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </button>
            </div>
          </div>

          {/* Phone (Non-editable) */}
          <div className="p-4 rounded-2xl" style={{ background: '#F9FAFB', border: '1.5px solid #E5E7EB' }}>
            <Label style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
              Phone Number
            </Label>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5" style={{ color: '#6B7280' }} />
              <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1A1F36' }}>+91 {phone}</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '6px' }}>
              Phone number cannot be changed
            </p>
          </div>
        </motion.div>

        {/* Info Card */}
        {!isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-4 rounded-2xl"
            style={{ 
              background: '#FFF9F0',
              border: '1px solid rgba(255, 144, 102, 0.2)'
            }}
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255, 144, 102, 0.15)' }}>
                <span style={{ fontSize: '1rem' }}>💡</span>
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1A1F36', marginBottom: '4px' }}>
                  Keep your profile updated
                </p>
                <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: '1.5' }}>
                  Your information helps mess owners identify you and manage attendance better.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Logout Button */}
        {!isEditing && onLogout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
              <AlertDialogTrigger asChild>
                <button
                  className="w-full p-4 rounded-2xl transition-all flex items-center justify-between group"
                  style={{ 
                    background: '#FEF2F2',
                    border: '1.5px solid #FEE2E2'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FEE2E2' }}>
                      <LogOut className="w-5 h-5" style={{ color: '#DC2626' }} />
                    </div>
                    <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#DC2626' }}>
                      Logout
                    </span>
                  </div>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to logout? You'll need to login again to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    style={{ background: '#DC2626' }}
                  >
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </motion.div>
        )}
      </div>
    </div>
  );
}
