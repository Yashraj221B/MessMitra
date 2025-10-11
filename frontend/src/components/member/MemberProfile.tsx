import { useState, useEffect } from 'react';
import { ArrowLeft, User, Home, IdCard, Phone, Edit2, Save, X, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { toast } from 'sonner';
import { userService } from '../../services';

interface MemberProfileProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
  onLogout?: () => void;
}

export function MemberProfile({ onBack, onLogout }: MemberProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [memberId, setMemberId] = useState('');
  const [phone, setPhone] = useState('');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await userService.getProfile();
      setName(profile.name || '');
      setPhone(profile.phone || '');
      setMemberId(profile.id || '');
      setRoom(''); // TODO: Add room field to user profile in backend
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast.error(error.response?.data?.message || 'Failed to load profile');
    }
  };

  const handleSave = async () => {
    try {
      // TODO: Add room field to backend user profile model
      await userService.updateProfile({ name });
      
      // Removed success toast - form closes and shows updated name
      setIsEditing(false);
      await loadProfile(); // Reload to get fresh data
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(error.response?.data?.message || 'Failed to save profile');
    }
  };

  const handleCancel = () => {
    // Reload original data from backend
    loadProfile();
    setIsEditing(false);
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
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl active:scale-95 transition-all"
            style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl flex items-center gap-2 active:scale-95 transition-all"
              style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}
            >
              <Edit2 className="w-4 h-4 text-white" />
              <span className="text-white" style={{ fontSize: '0.875rem', fontWeight: '600' }}>Edit</span>
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
                className="px-4 py-2 rounded-xl flex items-center gap-2 active:scale-95 transition-all"
                style={{ background: 'rgba(255, 255, 255, 0.95)' }}
              >
                <Save className="w-4 h-4" style={{ color: '#0B8043' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0B8043' }}>Save</span>
              </button>
            </div>
          )}
        </div>
        <h1 className="text-white" style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '4px' }}>
          My Account
        </h1>
        <p className="text-white/90" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
          मेरा खाता
        </p>
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
            Student • विद्यार्थी
          </p>
        </motion.div>

        {/* Profile Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* Name */}
          <div className="p-4 rounded-2xl" style={{ background: 'white', border: '1.5px solid #E5E7EB' }}>
            <Label style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
              Your Name • आपका नाम
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

          {/* Room Number */}
          <div className="p-4 rounded-2xl" style={{ background: 'white', border: '1.5px solid #E5E7EB' }}>
            <Label style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
              Room Number • कमरा नंबर
            </Label>
            {isEditing ? (
              <Input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="h-11 rounded-xl border-2"
                style={{ fontSize: '0.9375rem' }}
              />
            ) : (
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5" style={{ color: '#6B7280' }} />
                <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1A1F36' }}>{room}</span>
              </div>
            )}
          </div>

          {/* Student ID */}
          <div className="p-4 rounded-2xl" style={{ background: 'white', border: '1.5px solid #E5E7EB' }}>
            <Label style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
              Member ID • सदस्य आईडी
            </Label>
            {isEditing ? (
              <Input
                type="text"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                className="h-11 rounded-xl border-2"
                style={{ fontSize: '0.9375rem' }}
              />
            ) : (
              <div className="flex items-center gap-3">
                <IdCard className="w-5 h-5" style={{ color: '#6B7280' }} />
                <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1A1F36' }}>{memberId}</span>
              </div>
            )}
          </div>

          {/* Phone (Non-editable) */}
          <div className="p-4 rounded-2xl" style={{ background: '#F9FAFB', border: '1.5px solid #E5E7EB' }}>
            <Label style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
              Phone Number • फ़ोन नंबर
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
                    onClick={onLogout}
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
