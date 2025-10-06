import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, Copy, CheckCircle } from 'lucide-react';

export default function GenerateEnrollmentQR() {
  const navigate = useNavigate();
  const [enrollmentId] = useState(() => `ENR${Date.now()}`);
  const [copied, setCopied] = useState(false);

  const enrollmentUrl = `${window.location.origin}/enroll/${enrollmentId}`;

  // Placeholder for QR generation - Install 'qrcode' package to enable
  // npm install qrcode @types/qrcode
  useEffect(() => {
    // In production with qrcode package:
    // import QRCode from 'qrcode';
    // QRCode.toDataURL(enrollmentUrl, { width: 300, margin: 2 }).then(setQrCodeUrl);
  }, [enrollmentUrl]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(enrollmentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 pt-8 pb-8 rounded-b-3xl shadow-xl sticky top-0 z-20">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity text-white"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
          <span className="font-medium text-white">Back</span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <QrCode className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Enrollment QR</h1>
            <p className="text-white text-sm">Share with new member</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-4 pb-24 animate-fade-in">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 mb-2">📱 How it works:</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Show this QR code to the new member</li>
            <li>They scan it with their phone camera</li>
            <li>They fill in their details and submit</li>
            <li>You'll see them in "Pending Approvals"</li>
            <li>Approve and record payment to activate</li>
          </ol>
        </div>

        {/* QR Code Display */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Scan to Enroll
            </h2>
            
            {/* QR Code Placeholder - Install 'qrcode' package for real QR generation */}
            <div className="bg-white p-6 rounded-xl border-4 border-primary-600 inline-block shadow-lg">
              <div className="w-64 h-64 bg-slate-50 flex flex-col items-center justify-center gap-4">
                <QrCode className="w-32 h-32 text-primary-600" />
                <div className="text-center px-4">
                  <p className="text-xs text-slate-600 font-mono break-all">
                    {enrollmentUrl}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Install 'qrcode' package for actual QR
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-600 mb-2">Enrollment ID</p>
              <p className="text-sm font-mono font-bold text-slate-800 break-all">
                {enrollmentId}
              </p>
            </div>
          </div>
        </div>

        {/* URL Copy Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-3">Or share the link:</h3>
          
          <div className="flex gap-2">
            <div className="flex-1 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500 mb-1">Enrollment URL</p>
              <p className="text-sm font-mono text-slate-800 break-all">
                {enrollmentUrl}
              </p>
            </div>
          </div>

          <button
            onClick={copyToClipboard}
            className="w-full mt-3 bg-primary-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy Link
              </>
            )}
          </button>
        </div>

        {/* Tips */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-800 font-medium mb-2">💡 Pro Tips:</p>
          <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
            <li>This QR code is valid for this enrollment session</li>
            <li>Multiple students can use the same QR</li>
            <li>You can generate a new QR anytime</li>
            <li>Check "Pending Approvals" on Dashboard regularly</li>
          </ul>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-green-700 transition-colors"
        >
          Done - View Pending Approvals
        </button>
      </div>
    </div>
  );
}
