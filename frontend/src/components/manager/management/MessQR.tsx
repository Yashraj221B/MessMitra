import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { BottomNav } from '../BottomNav';
import QRCode from 'react-qr-code';
import { useState, useEffect } from 'react';
import { userService, messService } from '../../../services';

interface MessQRProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

export function MessQR({ currentScreen, onNavigate, onBack }: MessQRProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [messData, setMessData] = useState({
    messId: '',
    messName: 'Loading...',
    ownerName: 'Loading...',
    phone: ''
  });

  useEffect(() => {
    loadMessData();
  }, []);

  const loadMessData = async () => {
    try {
      setIsLoading(true);
      const profile = await userService.getProfile();
      
      if (!profile.messId) {
        toast.error('पहले mess बनाएं!');
        onBack();
        return;
      }

      const mess = await messService.getMessById(profile.messId);
      setMessData({
        messId: mess.id,
        messName: mess.name,
        ownerName: profile.name || 'Mess Owner',
        phone: profile.phone
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load mess data');
      console.error('Error loading mess:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Our Mess',
          text: `Scan this QR code to join ${messData.messName}!\nMess ID: ${messData.messId}`,
        });
        toast.success('शेयर किया गया!');
      } catch (error) {
        console.log('Share canceled');
      }
    } else {
      // Fallback for browsers that don't support share
      navigator.clipboard.writeText(`Mess ID: ${messData.messId}`);
      toast.success('Mess ID कॉपी हो गया!');
    }
  };

  const handleDownload = () => {
    const svg = document.querySelector('#mess-qr-code');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${messData.messName}-QR.png`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success('QR Code downloaded!');
          }
        });
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    } else {
      toast.error('Failed to download QR code');
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #F1F8F4 0%, #FFFFFF 100%)' }}>
      {/* Modern Header */}
      <div className="px-4 pt-4 pb-4" style={{ 
        background: 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)',
        borderBottomLeftRadius: '24px',
        borderBottomRightRadius: '24px',
        boxShadow: '0 4px 20px rgba(11, 128, 67, 0.2)'
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
              Mess QR Code
            </h1>
            <p className="text-white/80" style={{ fontSize: '0.85rem' }}>Students को join करने के लिए</p>
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
      <div className="flex-1 overflow-y-auto p-6 pb-28 flex flex-col items-center">
        {/* Instructions */}
        <div className="w-full max-w-md mb-6">
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
                  Students इस QR code को स्कैन करके अपने आप mess में join हो सकते हैं। आपको बस उनकी request approve करनी होगी।
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <div className="p-6 rounded-3xl relative overflow-hidden" style={{ 
            background: 'white',
            boxShadow: '0 8px 32px rgba(11, 128, 67, 0.15)',
            border: '3px solid #E8F5E9'
          }}>
            {/* Decorative Elements */}
            <div 
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10"
              style={{ background: '#48C479' }}
            />
            <div 
              className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full opacity-10"
              style={{ background: '#0B8043' }}
            />

            {/* Content */}
            <div className="relative z-10">
              <div className="text-center mb-4">
                <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1C4532', marginBottom: '4px' }}>
                  {messData.messName}
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#666' }}>
                  {messData.ownerName}
                </p>
              </div>

              {/* QR Code */}
              <div className="bg-white p-4 rounded-2xl mb-4 flex items-center justify-center" style={{ 
                border: '2px solid #E8F5E9'
              }}>
                <QRCode 
                  id="mess-qr-code"
                  value={JSON.stringify(messData)} 
                  size={220}
                  level="H"
                  fgColor="#0B8043"
                />
              </div>

              {/* Mess ID */}
              <div className="text-center mb-4">
                <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '4px' }}>
                  Mess ID
                </div>
                <div 
                  className="inline-block px-4 py-2 rounded-lg"
                  style={{ 
                    background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: '#0B8043',
                    letterSpacing: '0.1em'
                  }}
                >
                  {isLoading ? 'Loading...' : messData.messId}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 py-3 px-4 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                  style={{ 
                    background: 'white',
                    border: '2px solid #E8F5E9',
                    color: '#0B8043',
                    fontSize: '0.9rem',
                    fontWeight: '700'
                  }}
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 py-3 px-4 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                  style={{ 
                    background: 'linear-gradient(135deg, #48C479 0%, #23AE5F 100%)',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    boxShadow: '0 4px 12px rgba(72, 196, 121, 0.3)'
                  }}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info Cards */}
        <div className="w-full max-w-md mt-6 flex flex-col gap-3">
          <div className="p-4 rounded-xl" style={{ 
            background: 'white',
            border: '2px solid #E8F5E9',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">📸</span>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1C4532' }}>
                Print & Display
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.6' }}>
              इस QR code को प्रिंट करके mess के entrance पर लगा दें
            </p>
          </div>

          <div className="p-4 rounded-xl" style={{ 
            background: 'white',
            border: '2px solid #E8F5E9',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">✅</span>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1C4532' }}>
                Approve Requests
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.6' }}>
              Students के scan करने के बाद उनकी request "Join Requests" में दिखेगी
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
    </div>
  );
}