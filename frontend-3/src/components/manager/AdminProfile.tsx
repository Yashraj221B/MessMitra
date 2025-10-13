import { useState, useEffect } from 'react';
import { ArrowLeft, User, Building2, Home, Phone, Edit2, Save, X, Languages, Bell, LogOut, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { toast } from 'sonner';
import { updateUser } from '../../utils/mockDatabase';
import { getTranslation } from '../../utils/translations';
import { useLanguage } from '../../contexts/LanguageContext';

interface AdminProfileProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
  onLogout?: () => void;
}

export function AdminProfile({ onBack, onLogout }: AdminProfileProps) {
  const { language, setLanguage } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [messName, setMessName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    try {
      const currentUser = localStorage.getItem('current-user');
      if (currentUser) {
        const data = JSON.parse(currentUser);
        setName(data.name || '');
        setMessName(data.messName || '');
        setAddress(data.address || '');
        setPhone(data.phone || '');
      }
      
      // Load notification preference
      const savedNotifications = localStorage.getItem('messmitra-notifications');
      setNotifications(savedNotifications !== 'false');
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
          messName,
          address
        };
        
        // Update in localStorage
        localStorage.setItem('current-user', JSON.stringify(updatedData));
        localStorage.setItem('messmitra-basic-details', JSON.stringify({
          name,
          messName,
          address
        }));
        
        // Update in database
        updateUser(data.phone, 'manager', { name, messName, address });
        
        toast.success(getTranslation(language, 'profileUpdated'));
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
        setMessName(data.messName || '');
        setAddress(data.address || '');
      }
    } catch (error) {
      console.error('Error reloading user data:', error);
    }
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
        <div className="flex items-center mb-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl active:scale-95 transition-all"
            style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-white" style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
              {getTranslation(language, 'myAccount')}
            </h1>
          </div>
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
            <span style={{ fontSize: '3rem' }}>🧑‍🍳</span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1A1F36', marginBottom: '4px' }}>
            {name}
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            {language === 'marathi' ? 'मेस मालक' : language === 'hindi' ? 'मेस मालिक' : 'Mess Owner'}
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
              👤 {getTranslation(language, 'yourName')}
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

          {/* Mess Name */}
          <div className="p-4 rounded-2xl" style={{ background: 'white', border: '1.5px solid #E5E7EB' }}>
            <Label style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
              🍽️ {getTranslation(language, 'messName')}
            </Label>
            {isEditing ? (
              <Input
                type="text"
                value={messName}
                onChange={(e) => setMessName(e.target.value)}
                className="h-11 rounded-xl border-2"
                style={{ fontSize: '0.9375rem' }}
              />
            ) : (
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5" style={{ color: '#6B7280' }} />
                <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1A1F36' }}>{messName}</span>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="p-4 rounded-2xl" style={{ background: 'white', border: '1.5px solid #E5E7EB' }}>
            <Label style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
              🏠 {getTranslation(language, 'address')}
            </Label>
            {isEditing ? (
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl border-2 resize-none"
                style={{ 
                  borderColor: '#E5E7EB',
                  fontSize: '0.9375rem',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
                }}
              />
            ) : (
              <div className="flex items-start gap-3">
                <Home className="w-5 h-5 mt-0.5" style={{ color: '#6B7280' }} />
                <span style={{ fontSize: '0.9375rem', fontWeight: '500', color: '#1A1F36', lineHeight: '1.5' }}>{address}</span>
              </div>
            )}
          </div>

          {/* Phone (Non-editable) */}
          <div className="p-4 rounded-2xl" style={{ background: '#F9FAFB', border: '1.5px solid #E5E7EB' }}>
            <Label style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
              📱 Phone Number
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

        {/* Settings Section */}
        {!isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1A1F36', marginBottom: '12px' }}>
              ⚙️ {getTranslation(language, 'settings')}
            </h3>

            <div className="space-y-3">
              {/* Language Selector */}
              <button
                onClick={() => setShowLanguageDialog(true)}
                className="w-full p-4 rounded-2xl text-left active:scale-[0.99] transition-all"
                style={{ background: 'white', border: '1.5px solid #E5E7EB' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
                      background: 'linear-gradient(135deg, #E8F5E9 0%, #F1F8F4 100%)'
                    }}>
                      <Languages className="w-5 h-5" style={{ color: '#0B8043' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1A1F36', marginBottom: '2px' }}>
                        🌐 {getTranslation(language, 'language')}
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                        {language === 'marathi' ? 'मराठी' : language === 'hindi' ? 'हिंदी' : 'English'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5" style={{ color: '#6B7280' }} />
                </div>
              </button>

              {/* Notifications */}
              <div className="p-4 rounded-2xl" style={{ background: 'white', border: '1.5px solid #E5E7EB' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
                      background: 'linear-gradient(135deg, #E3F2FD 0%, #F1F8FE 100%)'
                    }}>
                      <Bell className="w-5 h-5" style={{ color: '#60A5FA' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1A1F36', marginBottom: '2px' }}>
                        🔔 {getTranslation(language, 'notifications')}
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                        {getTranslation(language, 'enableNotifications')}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={(checked) => {
                      setNotifications(checked);
                      localStorage.setItem('messmitra-notifications', String(checked));
                      toast.success(checked ? 'Notifications enabled! 🔔' : 'Notifications disabled');
                    }}
                  />
                </div>
              </div>

              {/* Logout */}
              <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogTrigger asChild>
                  <button
                    className="w-full p-4 rounded-2xl text-left active:scale-[0.99] transition-all"
                    style={{ background: '#FEF1F5', border: '1.5px solid rgba(239, 68, 68, 0.2)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
                        background: 'rgba(239, 68, 68, 0.12)'
                      }}>
                        <LogOut className="w-5 h-5" style={{ color: '#EF4444' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#EF4444', marginBottom: '2px' }}>
                          🚪 {getTranslation(language, 'logout')}
                        </p>
                        <p style={{ fontSize: '0.8125rem', color: '#EF4444' }}>
                          Sign out from your account
                        </p>
                      </div>
                    </div>
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{getTranslation(language, 'areYouSure')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {getTranslation(language, 'logoutMessage')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{getTranslation(language, 'cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={onLogout || onBack}>
                      {getTranslation(language, 'logout')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </motion.div>
        )}

        {/* Language Selection Dialog */}
        <AlertDialog open={showLanguageDialog} onOpenChange={setShowLanguageDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>🌐 {getTranslation(language, 'selectLanguage')}</AlertDialogTitle>
              <AlertDialogDescription>
                {language === 'marathi' ? 'आपली पसंतीची भाषा निवडा' : language === 'hindi' ? 'अपनी पसंदीदा भाषा चुनें' : 'Choose your preferred language'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-2 py-4">
              {/* Marathi */}
              <button
                onClick={() => {
                  setLanguage('marathi');
                  setShowLanguageDialog(false);
                  toast.success('भाषा बदलली! मराठी निवडले 🎉');
                }}
                className="w-full p-4 rounded-xl text-left active:scale-[0.99] transition-all"
                style={{ 
                  background: language === 'marathi' ? 'linear-gradient(135deg, #E8F5E9 0%, #F1F8F4 100%)' : 'white',
                  border: language === 'marathi' ? '2px solid #0B8043' : '1.5px solid #E5E7EB'
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: '1rem', fontWeight: '600', color: '#1A1F36', marginBottom: '2px' }}>
                      मराठी
                    </p>
                    <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                      Marathi
                    </p>
                  </div>
                  {language === 'marathi' && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#0B8043' }}>
                      <span style={{ color: 'white', fontSize: '0.875rem' }}>✓</span>
                    </div>
                  )}
                </div>
              </button>

              {/* Hindi */}
              <button
                onClick={() => {
                  setLanguage('hindi');
                  setShowLanguageDialog(false);
                  toast.success('भाषा बदल गई! हिंदी चुना गया 🎉');
                }}
                className="w-full p-4 rounded-xl text-left active:scale-[0.99] transition-all"
                style={{ 
                  background: language === 'hindi' ? 'linear-gradient(135deg, #E8F5E9 0%, #F1F8F4 100%)' : 'white',
                  border: language === 'hindi' ? '2px solid #0B8043' : '1.5px solid #E5E7EB'
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: '1rem', fontWeight: '600', color: '#1A1F36', marginBottom: '2px' }}>
                      हिंदी
                    </p>
                    <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                      Hindi
                    </p>
                  </div>
                  {language === 'hindi' && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#0B8043' }}>
                      <span style={{ color: 'white', fontSize: '0.875rem' }}>✓</span>
                    </div>
                  )}
                </div>
              </button>

              {/* English */}
              <button
                onClick={() => {
                  setLanguage('english');
                  setShowLanguageDialog(false);
                  toast.success('Language changed! English selected 🎉');
                }}
                className="w-full p-4 rounded-xl text-left active:scale-[0.99] transition-all"
                style={{ 
                  background: language === 'english' ? 'linear-gradient(135deg, #E8F5E9 0%, #F1F8F4 100%)' : 'white',
                  border: language === 'english' ? '2px solid #0B8043' : '1.5px solid #E5E7EB'
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: '1rem', fontWeight: '600', color: '#1A1F36', marginBottom: '2px' }}>
                      English
                    </p>
                    <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                      English
                    </p>
                  </div>
                  {language === 'english' && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#0B8043' }}>
                      <span style={{ color: 'white', fontSize: '0.875rem' }}>✓</span>
                    </div>
                  )}
                </div>
              </button>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowLanguageDialog(false)}>
                {getTranslation(language, 'cancel')}
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>


      </div>
    </div>
  );
}
