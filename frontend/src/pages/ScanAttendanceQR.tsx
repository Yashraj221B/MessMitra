import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ScanLine, CheckCircle, XCircle, User } from 'lucide-react';
import { mockMembers } from '../data/mockData';

export default function ScanAttendanceQR() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(true);
  const [scannedData, setScannedData] = useState<any>(null);
  const [result, setResult] = useState<'success' | 'error' | null>(null);

  // Simulate QR scan - In production, use a QR scanner library
  const simulateScan = () => {
    setTimeout(() => {
      const mockScanData = {
        memberId: '1',
        mealType: 'lunch',
        date: '2025-10-06',
        timestamp: Date.now(),
      };
      
      handleScan(mockScanData);
    }, 2000);
  };

  const handleScan = async (data: any) => {
    setScanning(false);
    setScannedData(data);

    try {
      // Validate QR data
      const member = mockMembers.find(m => m.id === data.memberId);
      
      if (!member) {
        throw new Error('Member not found');
      }

      if (member.subscriptionStatus === 'expired') {
        throw new Error('Subscription expired');
      }

      // Mock API call to mark attendance
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In production: await api.markAttendance(data)

      setResult('success');
      
      // Auto-dismiss after 2 seconds
      setTimeout(() => {
        navigate('/attendance');
      }, 2000);
      
    } catch (error) {
      setResult('error');
    }
  };

  const resetScanner = () => {
    setScanning(true);
    setScannedData(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 pt-8 pb-8 rounded-b-3xl shadow-xl sticky top-0 z-20">
        <button
          onClick={() => navigate('/attendance')}
          className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity text-white"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
          <span className="font-medium text-white">Back</span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <ScanLine className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Scan QR Code</h1>
            <p className="text-white text-sm">For attendance marking</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-4 pb-24 animate-fade-in">
        {/* Scanner Area */}
        {scanning && !result && (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
              <div className="text-center">
                <div className="relative w-64 h-64 mx-auto mb-6">
                  {/* Camera placeholder */}
                  <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center overflow-hidden">
                    <ScanLine className="w-24 h-24 text-primary-400 animate-pulse" />
                  </div>
                  
                  {/* Scanning overlay */}
                  <div className="absolute inset-0 border-4 border-primary-600 rounded-2xl">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-600 rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-600 rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-600 rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-600 rounded-br-xl"></div>
                  </div>

                  {/* Scan line animation */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-primary-600 animate-scan-line"></div>
                </div>

                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Scanning for QR Code...
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  Ask the member to show their QR code
                </p>

                {/* Demo button for testing */}
                <button
                  onClick={simulateScan}
                  className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                >
                  Simulate Scan (Demo)
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800 font-medium mb-2">📱 How to use:</p>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Ask member to open their app</li>
                <li>Member clicks "Show QR" and selects meal</li>
                <li>Point camera at the QR code</li>
                <li>Attendance will be marked automatically</li>
              </ol>
            </div>
          </>
        )}

        {/* Success Result */}
        {result === 'success' && scannedData && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 animate-fade-in">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Attendance Marked! ✓
              </h3>

              {(() => {
                const member = mockMembers.find(m => m.id === scannedData.memberId);
                return member ? (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3 justify-center mb-3">
                      <User className="w-8 h-8 text-green-600" />
                      <div className="text-left">
                        <p className="font-bold text-slate-800">{member.name}</p>
                        <p className="text-sm text-slate-600">#{member.id.padStart(4, '0')}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                      <div className="bg-white rounded-lg p-2">
                        <p className="text-slate-600 text-xs">Meal</p>
                        <p className="font-semibold text-slate-800 capitalize">{scannedData.mealType}</p>
                      </div>
                      <div className="bg-white rounded-lg p-2">
                        <p className="text-slate-600 text-xs">Time</p>
                        <p className="font-semibold text-slate-800">
                          {new Date().toLocaleTimeString('en-IN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              <p className="text-slate-600 text-sm mt-4">
                Redirecting to attendance page...
              </p>
            </div>
          </div>
        )}

        {/* Error Result */}
        {result === 'error' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 animate-fade-in">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Scan Failed
              </h3>
              
              <p className="text-slate-600 mb-6">
                Unable to mark attendance. Please check:
              </p>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
                <ul className="text-sm text-red-700 space-y-2 list-disc list-inside">
                  <li>QR code is valid and not expired</li>
                  <li>Member subscription is active</li>
                  <li>Correct meal time selected</li>
                  <li>Member ID exists in system</li>
                </ul>
              </div>

              <button
                onClick={resetScanner}
                className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan-line {
          0% { transform: translateY(0); }
          100% { transform: translateY(256px); }
        }
        .animate-scan-line {
          animation: scan-line 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
