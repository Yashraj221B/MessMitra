import { useState } from 'react';
import { ArrowLeft, QrCode, Download, Share2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { MemberBottomNav } from './MemberBottomNav';

interface QRCodeScreenProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

export function QRCodeScreen({ currentScreen, onNavigate, onBack }: QRCodeScreenProps) {
  const [brightness, setBrightness] = useState(100);

  const handleDownload = () => {
    toast.success('QR Code डाउनलोड हो रहा है! 📥');
  };

  const handleShare = () => {
    toast.success('QR Code शेयर हो रहा है! 📤');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #F1F8F4 0%, #FFFFFF 100%)' }}>
      {/* Modern Header */}
      <div className="px-4 pt-4 pb-4" style={{ 
        background: 'linear-gradient(135deg, #48C479 0%, #23AE5F 100%)',
        borderBottomLeftRadius: '24px',
        borderBottomRightRadius: '24px',
        boxShadow: '0 4px 20px rgba(72, 196, 121, 0.2)'
      }}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl active:scale-95 transition-all"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white mb-0.5" style={{ fontSize: '1.35rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
              मेरा QR Code
            </h1>
            <p className="text-white/80" style={{ fontSize: '0.85rem' }}>My QR Code</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <span className="text-2xl">📱</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-28">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          {/* Student Info Card */}
          <div className="mb-6 p-4 rounded-2xl text-center" style={{ 
            background: 'linear-gradient(135deg, #48C479 0%, #23AE5F 100%)',
            boxShadow: '0 8px 24px rgba(72, 196, 121, 0.3)'
          }}>
            <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ 
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              border: '3px solid rgba(255,255,255,0.3)'
            }}>
              <span style={{ fontSize: '2rem' }}>🎓</span>
            </div>
            <div className="text-white" style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '4px' }}>
              Anjali Sharma
            </div>
            <div className="text-white/90" style={{ fontSize: '0.9rem', marginBottom: '2px' }}>
              Room H1-201
            </div>
            <div className="text-white/80" style={{ fontSize: '0.85rem' }}>
              Student ID: MS2025001
            </div>
          </div>

          {/* QR Code Card */}
          <div className="relative mb-6">
            <div 
              className="p-6 rounded-2xl flex items-center justify-center relative overflow-hidden" 
              style={{ 
                background: 'white',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                border: '3px solid #E8F5E9'
              }}
            >
              {/* Decorative corners */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 rounded-tl-xl" style={{ borderColor: '#48C479' }} />
              <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 rounded-tr-xl" style={{ borderColor: '#48C479' }} />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 rounded-bl-xl" style={{ borderColor: '#48C479' }} />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 rounded-br-xl" style={{ borderColor: '#48C479' }} />

              {/* QR Code Placeholder */}
              <div 
                className="aspect-square w-64 rounded-xl flex items-center justify-center relative"
                style={{ 
                  background: `linear-gradient(135deg, #F1F8F4 0%, #E8F5E9 100%)`,
                  filter: `brightness(${brightness}%)`
                }}
              >
                <QrCode className="w-48 h-48" style={{ color: '#1C4532' }} />
                
                {/* Center logo */}
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ 
                    background: 'linear-gradient(135deg, #48C479 0%, #23AE5F 100%)',
                    boxShadow: '0 2px 8px rgba(72, 196, 121, 0.4)'
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>🍽️</span>
                </div>
              </div>
            </div>

            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ 
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              }}
              animate={{ 
                x: ['-100%', '200%'] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                ease: 'linear'
              }}
            />
          </div>

          {/* Brightness Control */}
          <div className="mb-6 p-4 rounded-xl" style={{ 
            background: 'white',
            border: '1.5px solid #E8F5E9',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" style={{ color: '#48C479' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1C4532' }}>
                  Brightness • चमक
                </span>
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#48C479' }}>
                {brightness}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ 
                background: `linear-gradient(to right, #48C479 0%, #48C479 ${(brightness - 50) / (150 - 50) * 100}%, #E0E0E0 ${(brightness - 50) / (150 - 50) * 100}%, #E0E0E0 100%)`,
                outline: 'none'
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl active:scale-95 transition-all"
              style={{ 
                background: 'linear-gradient(135deg, #48C479 0%, #23AE5F 100%)',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '700',
                boxShadow: '0 4px 12px rgba(72, 196, 121, 0.3)'
              }}
            >
              <Download className="w-5 h-5" />
              Download
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl active:scale-95 transition-all"
              style={{ 
                background: 'white',
                color: '#48C479',
                fontSize: '1rem',
                fontWeight: '700',
                border: '2px solid #48C479',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>

          {/* Instructions */}
          <div className="p-4 rounded-xl" style={{ 
            background: 'linear-gradient(135deg, #FFF9E6 0%, #FFF3D6 100%)',
            border: '1.5px solid #FFE082'
          }}>
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">💡</span>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#F57C00', marginBottom: '4px' }}>
                  कैसे इस्तेमाल करें?
                </div>
                <div style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.6' }}>
                  • हाज़िरी के समय QR code दिखाएं<br />
                  • Admin इसे स्कैन करेगा<br />
                  • Automatic हाज़िरी हो जाएगी ✅
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <MemberBottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
    </div>
  );
}
