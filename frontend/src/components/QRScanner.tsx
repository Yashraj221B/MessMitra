import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function QRScanner({ 
  onScanSuccess, 
  onClose, 
  title = "Scan QR Code",
  description = "Position the QR code within the frame to scan"
}: QRScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrCodeRegionId = "qr-reader";

  useEffect(() => {
    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      setError(null);
      setScanning(true);

      // Initialize scanner
      scannerRef.current = new Html5Qrcode(qrCodeRegionId);

      // Get cameras
      const cameras = await Html5Qrcode.getCameras();
      
      if (cameras.length === 0) {
        setError("No cameras found on this device");
        setScanning(false);
        return;
      }

      // Prefer back camera on mobile devices
      const backCamera = cameras.find(camera => 
        camera.label.toLowerCase().includes('back') || 
        camera.label.toLowerCase().includes('rear')
      );
      const cameraId = backCamera?.id || cameras[0].id;

      // Start scanning
      await scannerRef.current.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // Success callback
          handleScanSuccess(decodedText);
        },
        () => {
          // Error callback (can be ignored as it fires on every frame without QR)
        }
      );

    } catch (err: any) {
      console.error("Scanner error:", err);
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError("Camera permission denied. Please allow camera access and try again.");
      } else if (err.name === 'NotFoundError') {
        setError("No camera found on this device.");
      } else {
        setError(`Failed to start scanner: ${err.message || 'Unknown error'}`);
      }
      
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        const state = await scannerRef.current.getState();
        // Only stop if scanner is actually running or paused
        if (state === 2 || state === 3) { // 2=SCANNING, 3=PAUSED
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
        scannerRef.current = null;
      } catch (err: any) {
        // Silently handle if scanner is already stopped
        if (!err.message?.includes('not running')) {
          console.error("Error stopping scanner:", err);
        }
      }
    }
  };

  const handleScanSuccess = async (decodedText: string) => {
    await stopScanner();
    setScanning(false);
    onScanSuccess(decodedText);
  };

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#0B8043]" />
            <h2 className="font-semibold text-gray-900">{title}</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scanner Area */}
        <div className="p-4">
          {description && (
            <p className="text-sm text-gray-600 mb-4 text-center">
              {description}
            </p>
          )}

          {error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div 
            id={qrCodeRegionId} 
            className="rounded-lg overflow-hidden border-2 border-gray-200"
            style={{ minHeight: '300px' }}
          />

          {scanning && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Scanning...
              </div>
            </div>
          )}

          {error && (
            <Button
              onClick={startScanner}
              className="w-full mt-4 bg-[#0B8043] hover:bg-[#096936]"
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
