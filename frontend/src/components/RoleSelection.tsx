import { ChefHat, Users, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface RoleSelectionProps {
  onSelectRole: (role: 'admin' | 'manager' | 'member') => void;
}

export function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 text-6xl">🍛</div>
        <div className="absolute top-40 right-10 text-5xl">🥗</div>
        <div className="absolute bottom-32 left-16 text-7xl">🍱</div>
        <div className="absolute bottom-20 right-20 text-6xl">🍜</div>
        <div className="absolute top-60 left-1/2 text-4xl">🥘</div>
      </div>

      {/* Floating Shapes */}
      <motion.div
        className="absolute top-20 right-10 w-32 h-32 rounded-full"
        style={{ background: 'rgba(255,255,255,0.1)', filter: 'blur(40px)' }}
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-32 left-10 w-40 h-40 rounded-full"
        style={{ background: 'rgba(255,255,255,0.08)', filter: 'blur(50px)' }}
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo & Branding */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-6 shadow-2xl"
              style={{ 
                background: 'linear-gradient(135deg, #FFD93D 0%, #FF9E2C 100%)',
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              <span className="text-5xl">🍱</span>
            </motion.div>
            <h1 className="mb-3 text-white" style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
              MessMitra
            </h1>
            <p className="text-white/90" style={{ fontSize: '1.125rem', fontWeight: '500' }}>
              Your Mess, Simplified ✨
            </p>
          </motion.div>

          {/* Role Selection Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl p-6 shadow-2xl"
            style={{ 
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <h2 className="text-center mb-6" style={{ fontSize: '1.375rem', fontWeight: '700', color: '#1C4532' }}>
              Select Your Role
            </h2>
            
            <div className="space-y-4">
              {/* Platform Admin Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectRole('admin')}
                className="w-full p-5 rounded-2xl transition-all relative overflow-hidden group"
                style={{ 
                  background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
                  boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
                }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white" style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                        Platform Admin
                      </h3>
                      <p className="text-white/90" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                        प्लेटफार्म प्रशासक
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>

              {/* Mess Manager Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectRole('manager')}
                className="w-full p-5 rounded-2xl transition-all relative overflow-hidden group"
                style={{ 
                  background: 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)',
                  boxShadow: '0 8px 20px rgba(11, 128, 67, 0.3)',
                }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                      <ChefHat className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white" style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                        Mess Manager
                      </h3>
                      <p className="text-white/90" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                        मेस व्यवस्थापक
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>

              {/* Member Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectRole('member')}
                className="w-full p-5 rounded-2xl transition-all relative overflow-hidden group"
                style={{ 
                  background: 'linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%)',
                  boxShadow: '0 8px 20px rgba(255, 107, 53, 0.3)',
                }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white" style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                        Mess Member
                      </h3>
                      <p className="text-white/90" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                        मेस सदस्य
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-6"
              style={{ color: '#666', fontSize: '0.875rem' }}
            >
              🔐 Your choice will be remembered
            </motion.p>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-6"
          >
            <p className="text-white/80" style={{ fontSize: '0.875rem' }}>
              Made with ❤️ for college students<br/>By Yashraj221B
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}