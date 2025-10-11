import { useState } from 'react';
import { ArrowLeft, QrCode, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { MemberBottomNav } from './MemberBottomNav';
import { messService } from '../../services';
import { QRScanner } from '../QRScanner';

interface JoinMessProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

interface MessInfo {
  messId: string;
  messName: string;
  ownerName: string;
  phone: string;
}

export function JoinMess({ currentScreen, onNavigate, onBack }: JoinMessProps) {
  const [scanning, setScanning] = useState(false);
  const [scannedMess, setScannedMess] = useState<MessInfo | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [manualMessId, setManualMessId] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  const handleScan = () => {
    setScanning(true);
  };

  const handleScanSuccess = async (decodedText: string) => {
    setScanning(false);
    
    try {
      // Parse QR code data
      const messData = JSON.parse(decodedText);
      
      if (!messData.messId) {
        toast.error('Invalid QR code. Please try again.');
        return;
      }

      // Fetch full mess details
      const mess = await messService.getMessById(messData.messId);
      setScannedMess({
        messId: mess.data.id,
        messName: mess.data.name,
        ownerName: mess.data.ownerName || messData.ownerName || 'Mess Owner',
        phone: mess.data.phone || messData.phone || ''
      });
      
      // Removed success toast - mess details are displayed below, obvious to user
    } catch (error: any) {
      console.error('Error processing QR code:', error);
      toast.error('Invalid QR code or mess not found.');
      setShowManualInput(true);
    }
  };

  const handleScanClose = () => {
    setScanning(false);
  };

  const handleManualJoin = async () => {
    if (!manualMessId.trim()) {
      toast.error('Please enter a valid Mess ID');
      return;
    }

    try {
      // Fetch mess details first
      const mess = await messService.getMessById(manualMessId);
      setScannedMess({
        messId: mess.data.id,
        messName: mess.data.name,
        ownerName: mess.data.ownerName || 'Mess Owner',
        phone: mess.data.phone || ''
      });
      setShowManualInput(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Mess not found. Check the ID.');
      console.error('Error fetching mess:', error);
    }
  };

  const handleJoinRequest = async () => {
    if (!scannedMess) return;

    try {
      // Send join request to backend
      await messService.joinMess(scannedMess.messId);

      setShowSuccess(true);
      
      setTimeout(() => {
        // Removed success toast - success animation is already showing
        setTimeout(() => {
          onBack();
        }, 1000);
      }, 2000);
    } catch (error: any) {
      console.error('Error sending join request:', error);
      toast.error(error.response?.data?.message || 'Failed to send join request');
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
              Join a Mess
            </h1>
            <p className="text-white/80" style={{ fontSize: '0.85rem' }}>Mess का QR स्कैन करें</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <span className="text-2xl">🍽️</span>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {scanning && (
        <QRScanner
          onScanSuccess={handleScanSuccess}
          onClose={handleScanClose}
          title="Scan Mess QR Code"
          description="Position the QR code within the frame"
        />
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-28">
        <AnimatePresence mode="wait">
          {!scannedMess ? (
            <motion.div
              key="scanner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              {/* Instructions */}
              <div className="w-full mb-6">
                <div className="p-4 rounded-xl" style={{ 
                  background: 'linear-gradient(135deg, #FFF9E6 0%, #FFF3D6 100%)',
                  border: '1.5px solid #FFE082'
                }}>
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">💡</span>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#F57C00', marginBottom: '4px' }}>
                        How to Join?
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.6' }}>
                        Mess entrance पर लगा QR code को स्कैन करें। Owner approval के बाद आप automatically mess में add हो जाएंगे।
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scanner */}
              <div className="w-full max-w-sm">
                <div className="aspect-square rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden" style={{ 
                  background: 'white',
                  boxShadow: '0 8px 32px rgba(72, 196, 121, 0.15)',
                  border: '3px solid #E8F5E9'
                }}>
                  <div className="w-3/4 aspect-square rounded-xl flex items-center justify-center relative" style={{ 
                    border: '3px dashed #48C479'
                  }}>
                    <QrCode className="w-24 h-24" style={{ color: '#48C479' }} />
                  </div>
                </div>

                <button
                  onClick={handleScan}
                  className="w-full py-4 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                  style={{ 
                    background: 'linear-gradient(135deg, #48C479 0%, #23AE5F 100%)',
                    color: 'white',
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    boxShadow: '0 4px 12px rgba(72, 196, 121, 0.3)'
                  }}
                >
                  <QrCode className="w-5 h-5" />
                  Start Scanning
                </button>

                {/* Or Divider */}
                {!showManualInput && (
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-gray-300" />
                    <span style={{ fontSize: '0.85rem', color: '#999' }}>या</span>
                    <div className="flex-1 h-px bg-gray-300" />
                  </div>
                )}

                {/* Manual Entry Button */}
                {!showManualInput && (
                  <button
                    onClick={() => setShowManualInput(true)}
                    className="w-full py-3 rounded-xl active:scale-95 transition-all"
                    style={{ 
                      background: 'white',
                      border: '2px solid #E8F5E9',
                      color: '#48C479',
                      fontSize: '0.95rem',
                      fontWeight: '700'
                    }}
                  >
                    Enter Mess ID Manually
                  </button>
                )}

                {/* Manual Entry Option */}
                {showManualInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-4 rounded-xl"
                    style={{ 
                      background: 'white',
                      border: '2px solid #E8F5E9',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1C4532', marginBottom: '8px' }}>
                      📝 Manual Entry
                    </div>
                    <input
                      type="text"
                      value={manualMessId}
                      onChange={(e) => setManualMessId(e.target.value)}
                      placeholder="Enter Mess ID (e.g. MESS-ABC123)"
                      className="w-full px-4 py-3 rounded-lg mb-3"
                      style={{ 
                        border: '2px solid #E8F5E9',
                        fontSize: '0.95rem'
                      }}
                    />
                    <button
                      onClick={handleManualJoin}
                      className="w-full py-3 rounded-lg active:scale-95 transition-all"
                      style={{ 
                        background: 'linear-gradient(135deg, #0B8043 0%, #23AE5F 100%)',
                        color: 'white',
                        fontSize: '0.95rem',
                        fontWeight: '700'
                      }}
                    >
                      Join with Mess ID
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Info Cards */}
              <div className="w-full mt-8 flex flex-col gap-3">
                <div className="p-4 rounded-xl flex items-start gap-3" style={{ 
                  background: 'white',
                  border: '2px solid #E8F5E9',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <span className="text-xl flex-shrink-0">📱</span>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1C4532', marginBottom: '2px' }}>
                      Step 1: Scan QR
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.6' }}>
                      Mess के entrance पर लगा QR code को स्कैन करें
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl flex items-start gap-3" style={{ 
                  background: 'white',
                  border: '2px solid #E8F5E9',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <span className="text-xl flex-shrink-0">⏳</span>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1C4532', marginBottom: '2px' }}>
                      Step 2: Wait for Approval
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.6' }}>
                      Mess owner आपकी request को approve करेंगे
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl flex items-start gap-3" style={{ 
                  background: 'white',
                  border: '2px solid #E8F5E9',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <span className="text-xl flex-shrink-0">✅</span>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1C4532', marginBottom: '2px' }}>
                      Step 3: Access Granted
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.6' }}>
                      Approval के बाद आप mess features access कर सकते हैं
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center"
            >
              <div className="text-center p-8">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6 }}
                  className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{ 
                    background: 'linear-gradient(135deg, #48C479 0%, #23AE5F 100%)',
                    boxShadow: '0 8px 32px rgba(72, 196, 121, 0.3)'
                  }}
                >
                  <Check className="w-12 h-12 text-white" />
                </motion.div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1C4532', marginBottom: '0.5rem' }}>
                  Request Sent!
                </h2>
                <p style={{ fontSize: '1rem', color: '#666', marginBottom: '1rem' }}>
                  आपकी request भेज दी गई है
                </p>
                <p style={{ fontSize: '0.85rem', color: '#999' }}>
                  Owner approval के बाद आपको notification मिलेगा
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Mess Info Card */}
              <div className="mb-6">
                <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
                  background: 'white',
                  border: '3px solid #E8F5E9',
                  boxShadow: '0 8px 32px rgba(72, 196, 121, 0.15)'
                }}>
                  <div 
                    className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10"
                    style={{ background: '#48C479' }}
                  />

                  <div className="relative z-10">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ 
                        background: 'linear-gradient(135deg, #48C479 0%, #23AE5F 100%)',
                        boxShadow: '0 4px 12px rgba(72, 196, 121, 0.3)'
                      }}>
                        <span style={{ fontSize: '2rem' }}>🍽️</span>
                      </div>
                      <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1C4532', marginBottom: '4px' }}>
                        {scannedMess.messName}
                      </h2>
                      <p style={{ fontSize: '0.9rem', color: '#666' }}>
                        by {scannedMess.ownerName}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 mb-4">
                      <div className="p-3 rounded-xl" style={{ background: '#F5F5F5' }}>
                        <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '2px' }}>
                          Mess ID
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1C4532', letterSpacing: '0.05em' }}>
                          {scannedMess.messId}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl" style={{ background: '#F5F5F5' }}>
                        <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '2px' }}>
                          Contact
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1C4532' }}>
                          {scannedMess.phone}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl flex items-start gap-3 mb-4" style={{ 
                      background: 'linear-gradient(135deg, #FFF9E6 0%, #FFF3D6 100%)',
                      border: '1.5px solid #FFE082'
                    }}>
                      <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#F57C00' }} />
                      <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.6' }}>
                        Join request भेजने के बाद mess owner आपकी profile को review करेंगे और approve करेंगे
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setScannedMess(null)}
                        className="flex-1 py-3 px-4 rounded-xl active:scale-95 transition-all"
                        style={{ 
                          background: 'white',
                          border: '2px solid #E0E0E0',
                          color: '#666',
                          fontSize: '1rem',
                          fontWeight: '700'
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleJoinRequest}
                        className="flex-1 py-3 px-4 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                        style={{ 
                          background: 'linear-gradient(135deg, #48C479 0%, #23AE5F 100%)',
                          color: 'white',
                          fontSize: '1rem',
                          fontWeight: '700',
                          boxShadow: '0 4px 12px rgba(72, 196, 121, 0.3)'
                        }}
                      >
                        <Check className="w-5 h-5" />
                        Send Request
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <MemberBottomNav currentScreen={currentScreen} onNavigate={onNavigate} />
    </div>
  );
}
