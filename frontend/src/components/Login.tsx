import { useState } from 'react';
import { ArrowLeft, Phone, Lock, Sparkles, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { authService } from '../services';

interface LoginProps {
  role: 'admin' | 'manager' | 'member';
  onBack: () => void;
  onLoginSuccess: () => void;
}

export function Login({ role, onBack, onLoginSuccess }: LoginProps) {
  const [step, setStep] = useState<'phone' | 'password'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phoneNumber.length === 0) {
      setPhoneError('Please enter your phone number');
      return;
    }
    
    if (phoneNumber.length < 10) {
      setPhoneError(`Phone number is incomplete. Need ${10 - phoneNumber.length} more digit${10 - phoneNumber.length > 1 ? 's' : ''}`);
      return;
    }
    
    if (phoneNumber.length !== 10) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setPhoneError('');
    
    // Move to password step
    setTimeout(() => {
      setIsLoading(false);
      setStep('password');
    }, 500);
  };  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length === 0) {
      setErrorMessage('Please enter your password');
      return;
    }
    
    if (password.length < 6) {
      setErrorMessage(`Password too short. Need ${6 - password.length} more character${6 - password.length > 1 ? 's' : ''}`);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Try login
      const loginResult = await authService.login({
        phone: phoneNumber,
        password: password,
        role: role
      });

      if (loginResult.success && loginResult.user) {
        // Store user data in localStorage
        localStorage.setItem('current-user', JSON.stringify(loginResult.user));
        
        // Removed annoying "Welcome back" toast - user can see they're logged in
        setIsLoading(false);
        onLoginSuccess(); // User exists and logged in successfully
      } else {
        setIsLoading(false);
        setErrorMessage('Login failed. Please try again.');
      }
    } catch (loginError: any) {
      // Show appropriate error message based on status code
      console.error('Login error:', loginError);
      setIsLoading(false);
      
      if (loginError.response?.status === 404) {
        setErrorMessage('Account not found. Please contact your admin to create your account.');
      } else if (loginError.response?.status === 401) {
        setErrorMessage('Incorrect password. Please double-check and try again.');
      } else if (loginError.response?.status === 403) {
        setErrorMessage(loginError.response?.data?.message || 'Account not approved yet. Please wait for approval.');
      } else {
        setErrorMessage(loginError.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    }
  };

  const roleConfig = {
    admin: {
      title: 'Platform Admin Login',
      subtitle: 'प्लेटफार्म प्रशासक लॉगिन',
      emoji: '🛡️',
      gradient: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
      color: '#6366F1',
      pattern: '⚙️',
    },
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
                    {/* Phone Validation Messages */}
                    <AnimatePresence mode="wait">
                      {phoneError ? (
                        <motion.div
                          key="phone-error"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="mt-3 px-4 py-3 rounded-xl"
                          style={{ 
                            background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
                            border: '1.5px solid #FCA5A5',
                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)'
                          }}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#FCA5A5' }}>
                              <span style={{ fontSize: '0.7rem' }}>✕</span>
                            </div>
                            <span style={{ 
                              fontSize: '0.875rem', 
                              color: '#991B1B', 
                              fontWeight: '600',
                              lineHeight: '1.4'
                            }}>
                              {phoneError}
                            </span>
                          </div>
                        </motion.div>
                      ) : phoneNumber.length > 0 && (
                        <motion.div
                          key="phone-validation"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
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
                    </AnimatePresence>
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
                    Enter Password
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
                          borderColor: password.length >= 6 ? config.color : '#E0E0E0',
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          background: password.length >= 6 ? config.color + '08' : '#F8F9FA',
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
                    {/* Password Validation and Error Messages */}
                    <AnimatePresence mode="wait">
                      {errorMessage ? (
                        <motion.div
                          key="password-error"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="mt-3 px-4 py-3 rounded-xl"
                          style={{ 
                            background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
                            border: '1.5px solid #FCA5A5',
                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)'
                          }}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#FCA5A5' }}>
                              <span style={{ fontSize: '0.7rem' }}>✕</span>
                            </div>
                            <span style={{ 
                              fontSize: '0.875rem', 
                              color: '#991B1B', 
                              fontWeight: '600',
                              lineHeight: '1.4'
                            }}>
                              {errorMessage}
                            </span>
                          </div>
                        </motion.div>
                      ) : password.length > 0 && (
                        <motion.div
                          key="password-validation"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="mt-3 px-2"
                          style={{ fontSize: '0.875rem' }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ background: password.length >= 6 ? config.color : '#CCC' }}
                            />
                            <span style={{ color: password.length >= 6 ? config.color : '#999', fontWeight: '600' }}>
                              {password.length >= 6 ? '✓ Minimum 6 characters' : `${password.length}/6 characters minimum`}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    type="submit"
                    disabled={password.length < 6 || isLoading}
                    className="w-full py-4 rounded-2xl text-white transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                    style={{
                      background: password.length >= 6 ? config.gradient : '#CCC',
                      fontWeight: '700',
                      fontSize: '1.125rem',
                    }}
                  >
                    {password.length >= 6 && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    )}
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Connecting...
                      </div>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Continue <CheckCircle2 className="w-5 h-5" />
                      </span>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center" style={{ color: '#666', fontSize: '0.8125rem' }}>
                  <p>🔒 Your password is encrypted and secure</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
