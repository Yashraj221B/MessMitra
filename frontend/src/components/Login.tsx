import { useState } from 'react';
import { ArrowLeft, Phone, Lock, Sparkles, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface LoginProps {
  role: 'manager' | 'member';
  onBack: () => void;
  onLoginSuccess: (isExistingUser: boolean) => void;
}

export function Login({ role, onBack, onLoginSuccess }: LoginProps) {
  const [step, setStep] = useState<'phone' | 'password'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('1234');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phoneNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to check if user exists
    setTimeout(() => {
      // Check if user exists in mock database
      const existingUser = checkUserExists(phoneNumber, role);
      
      setIsLoading(false);
      setStep('password');
      
      if (existingUser) {
        toast.success(`Welcome back! Enter your password �`);
      } else {
        toast.success('Create a new password to continue 🎉');
      }
    }, 800);
  };

  // Mock function to check if user exists in database
  const checkUserExists = (phone: string, userRole: 'manager' | 'member'): boolean => {
    try {
      const usersData = localStorage.getItem('messmitra-users-db');
      if (!usersData) return false;
      
      const users = JSON.parse(usersData);
      return users.some((user: any) => user.phone === phone && user.role === userRole);
    } catch (error) {
      console.error('Error checking user:', error);
      return false;
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 4) {
      toast.error('Password must be at least 4 characters');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Check if user exists in database
      const isExistingUser = checkUserExists(phoneNumber, role);
      
      if (isExistingUser) {
        // Load existing user data and verify password
        const usersData = localStorage.getItem('messmitra-users-db');
        if (usersData) {
          const users = JSON.parse(usersData);
          const existingUser = users.find((user: any) => user.phone === phoneNumber && user.role === role);
          
          if (existingUser) {
            // In production, you'd verify password hash here
            // For now, we'll accept any password for existing users or check if password matches
            if (existingUser.password && existingUser.password !== password) {
              toast.error('Incorrect password. Please try again.');
              setPassword('');
              return;
            }
            
            // Set current user data
            localStorage.setItem('current-user', JSON.stringify(existingUser));
            toast.success(`Welcome back, ${existingUser.name}! 👋`);
            onLoginSuccess(true);
          }
        }
      } else {
        // New user - store phone, role, and password
        const newUser = {
          phone: phoneNumber,
          role: role,
          password: password
        };
        
        // Store in users database
        try {
          const usersData = localStorage.getItem('messmitra-users-db');
          const users = usersData ? JSON.parse(usersData) : [];
          users.push(newUser);
          localStorage.setItem('messmitra-users-db', JSON.stringify(users));
        } catch (error) {
          console.error('Error saving user:', error);
        }
        
        localStorage.setItem('current-user', JSON.stringify(newUser));
        toast.success('Welcome to MessMitra! 🎉');
        onLoginSuccess(false);
      }
    }, 1000);
  };

  const roleConfig = {
    manager: {
      title: 'Mess Owner Login',
      subtitle: 'मेस मालिक लॉगिन',
      emoji: '🧑‍🍳',
      gradient: 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)',
      color: '#0B8043',
      pattern: '🍛',
    },
    member: {
      title: 'Member Login',
      subtitle: 'मेंबर लॉगिन',
      emoji: '🎓',
      gradient: 'linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%)',
      color: '#FF6B35',
      pattern: '🍱',
    },
  };

  const config = roleConfig[role];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: config.gradient }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 text-5xl">{config.pattern}</div>
        <div className="absolute top-60 right-10 text-6xl">{config.pattern}</div>
        <div className="absolute bottom-32 left-16 text-7xl">{config.pattern}</div>
        <div className="absolute bottom-60 right-20 text-5xl">{config.pattern}</div>
      </div>

      {/* Floating blobs */}
      <motion.div
        className="absolute top-20 right-10 w-40 h-40 rounded-full"
        style={{ background: 'rgba(255,255,255,0.1)', filter: 'blur(60px)' }}
        animate={{ y: [0, 30, 0], x: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-32 left-10 w-48 h-48 rounded-full"
        style={{ background: 'rgba(255,255,255,0.08)', filter: 'blur(70px)' }}
        animate={{ y: [0, -35, 0], x: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Header */}
      <div className="relative z-10 px-4 py-5">
        <div className="flex items-center gap-3 mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-3 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)' }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.25)' }}>
              <span className="text-2xl">{config.emoji}</span>
            </div>
            <div>
              <h1 className="text-white" style={{ fontSize: '1.25rem', fontWeight: '700' }}>{config.title}</h1>
              <p className="text-white/90" style={{ fontSize: '0.875rem', fontWeight: '500' }}>{config.subtitle}</p>
            </div>
          </div>
        </div>
        {/* Progress Indicator */}
        <div className="flex items-center gap-2 px-4">
          <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.9)' }} />
          <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.3)' }} />
          <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.3)' }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <AnimatePresence mode="wait">
          {step === 'phone' ? (
            <motion.div
              key="phone"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md"
            >
              <div 
                className="rounded-3xl p-8 shadow-2xl"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div className="text-center mb-8">
                  <motion.div
                    className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-5 shadow-lg"
                    style={{ background: config.gradient }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Phone className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="mb-2" style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1C4532' }}>
                    Enter Mobile Number
                  </h2>
                  <p style={{ fontSize: '1rem', color: '#666', fontWeight: '500' }}>
                    Enter your phone to continue
                  </p>
                </div>

                <form onSubmit={handlePhoneSubmit} className="space-y-6">
                  <div>
                    <label className="block mb-3" style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1C4532' }}>
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-3 border-r-2" style={{ color: '#666', borderColor: '#E0E0E0' }}>
                        <span style={{ fontSize: '1.25rem' }}>🇮🇳</span>
                        <span style={{ fontWeight: '600' }}>+91</span>
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="10-digit mobile number"
                        className="w-full pl-28 pr-5 py-4 rounded-2xl border-2 transition-all focus:outline-none shadow-sm"
                        style={{
                          borderColor: phoneNumber.length === 10 ? config.color : '#E0E0E0',
                          fontSize: '1.125rem',
                          letterSpacing: '0.05em',
                          fontWeight: '600',
                          background: phoneNumber.length === 10 ? config.color + '08' : '#F8F9FA',
                        }}
                        maxLength={10}
                        autoFocus
                      />
                    </div>
                    {phoneNumber.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 px-2 flex items-center justify-between"
                        style={{ fontSize: '0.875rem' }}
                      >
                        <span style={{ color: phoneNumber.length === 10 ? config.color : '#999', fontWeight: '600' }}>
                          {phoneNumber.length === 10 ? '✓ Valid number' : `${phoneNumber.length}/10 digits`}
                        </span>
                        {phoneNumber.length === 10 && (
                          <CheckCircle2 className="w-4 h-4" style={{ color: config.color }} />
                        )}
                      </motion.div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={phoneNumber.length !== 10 || isLoading}
                    className="w-full py-4 rounded-2xl text-white transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                    style={{
                      background: phoneNumber.length === 10 ? config.gradient : '#CCC',
                      fontWeight: '700',
                      fontSize: '1.125rem',
                    }}
                  >
                    {phoneNumber.length === 10 && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    )}
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Checking...
                      </div>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Continue <Sparkles className="w-5 h-5" />
                      </span>
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center" style={{ color: '#666', fontSize: '0.8125rem' }}>
                  <p>By continuing, you agree to our <span style={{ color: config.color, fontWeight: '600' }}>Terms</span> & <span style={{ color: config.color, fontWeight: '600' }}>Privacy Policy</span></p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="password"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md"
            >
              <div 
                className="rounded-3xl p-8 shadow-2xl"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div className="text-center mb-8">
                  <motion.div
                    className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-5 shadow-lg"
                    style={{ background: config.gradient }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  >
                    <Lock className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="mb-2" style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1C4532' }}>
                    {checkUserExists(phoneNumber, role) ? 'Enter Password' : 'Create Password'}
                  </h2>
                  <p className="mb-3" style={{ fontSize: '1rem', color: '#666', fontWeight: '500' }}>
                    For <span style={{ color: config.color, fontWeight: '700' }}>+91 {phoneNumber}</span>
                  </p>
                  <button
                    onClick={() => setStep('phone')}
                    className="transition-all"
                    style={{ color: config.color, fontSize: '0.875rem', fontWeight: '700' }}
                  >
                    ✏️ Change number
                  </button>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block mb-3" style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1C4532' }}>
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-5 pr-14 py-4 rounded-2xl border-2 transition-all focus:outline-none shadow-sm"
                        style={{
                          borderColor: password.length >= 4 ? config.color : '#E0E0E0',
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          background: password.length >= 4 ? config.color + '08' : '#F8F9FA',
                        }}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all"
                        style={{ color: config.color }}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {password.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 px-2"
                        style={{ fontSize: '0.875rem' }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ background: password.length >= 4 ? config.color : '#CCC' }}
                          />
                          <span style={{ color: password.length >= 4 ? config.color : '#999', fontWeight: '600' }}>
                            {password.length >= 4 ? '✓ Minimum 4 characters' : 'At least 4 characters'}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={password.length < 4 || isLoading}
                    className="w-full py-4 rounded-2xl text-white transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                    style={{
                      background: password.length >= 4 ? config.gradient : '#CCC',
                      fontWeight: '700',
                      fontSize: '1.125rem',
                    }}
                  >
                    {password.length >= 4 && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    )}
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying...
                      </div>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        {checkUserExists(phoneNumber, role) ? 'Login' : 'Create Account'} <CheckCircle2 className="w-5 h-5" />
                      </span>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center" style={{ color: '#666', fontSize: '0.8125rem' }}>
                  <p>� Your password is encrypted and secure</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}