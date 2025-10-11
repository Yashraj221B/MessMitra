import { useState, useEffect } from 'react';
import { ArrowLeft, Download, Share2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import QRCode from 'react-qr-code';
import { MemberBottomNav } from './MemberBottomNav';
import { userService } from '../../services';

interface QRCodeScreenProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

export function QRCodeScreen({ currentScreen, onNavigate, onBack }: QRCodeScreenProps) {
  const [brightness, setBrightness] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    id: '',
    name: 'Loading...',
    phone: '',
    messId: ''
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const profile = await userService.getProfile();
      setUserData({
        id: profile.id,
        name: profile.name || profile.phone,
        phone: profile.phone,
        messId: profile.messId || 'Not joined yet'
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load profile');
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    try {
      const svg = document.querySelector('#member-qr-code svg');
      if (!svg) {
        toast.error('QR Code not found');
        return;
      }

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx!.fillStyle = 'white';
        ctx!.fillRect(0, 0, canvas.width, canvas.height);
        ctx!.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${userData.name}-QR-Code.png`;
            a.click();
            URL.revokeObjectURL(url);
            // Removed success toast - browser download notification handles this
          }
        });
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download QR code');
    }
  };

  const handleShare = async () => {
    try {
      const svg = document.querySelector('#member-qr-code svg');
      if (!svg) {
        toast.error('QR Code not found');
        return;
      }

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx!.fillStyle = 'white';
        ctx!.fillRect(0, 0, canvas.width, canvas.height);
        ctx!.drawImage(img, 0, 0);
        
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], `${userData.name}-QR.png`, { type: 'image/png' });
            
            if (navigator.share && navigator.canShare({ files: [file] })) {
              try {
                await navigator.share({
                  files: [file],
                  title: 'My Mess QR Code',
                  text: `${userData.name}'s Mess QR Code`
                });
                // Removed success toast - system share dialog is feedback
              } catch (err: any) {
                if (err.name !== 'AbortError') {
                  console.error('Share error:', err);
                  toast.error('Failed to share');
                }
              }
            } else {
              // Fallback: copy to clipboard
              toast.info('Sharing not supported. Downloading instead...');
              handleDownload();
            }
          }
        });
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to share QR code');
    }
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
          {/* Student Info Card - Real Data */}
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
              {isLoading ? 'Loading...' : userData.name}
            </div>
            <div className="text-white/90" style={{ fontSize: '0.9rem', marginBottom: '2px' }}>
              {userData.phone}
            </div>
            <div className="text-white/80" style={{ fontSize: '0.85rem' }}>
              User ID: {userData.id || '---'}
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

              {/* QR Code - Real Scannable */}
              <div 
                id="member-qr-code"
                className="aspect-square w-64 rounded-xl flex items-center justify-center p-4 bg-white"
                style={{ 
                  filter: `brightness(${brightness}%)`
                }}
              >
                {!isLoading && userData.id ? (
                  <QRCode
                    value={JSON.stringify({
                      userId: userData.id,
                      name: userData.name,
                      phone: userData.phone,
                      messId: userData.messId,
                      type: 'member'
                    })}
                    size={220}
                    level="H"
                    fgColor="#1C4532"
                    bgColor="#FFFFFF"
                  />
                ) : (
                  <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-2" />
                    <p style={{ fontSize: '0.85rem', color: '#666' }}>Loading QR...</p>
                  </div>
                )}
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
