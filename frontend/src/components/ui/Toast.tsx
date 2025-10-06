import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

export default function Toast({ message, type = 'info', onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  const styles = {
    success: {
      bg: 'bg-green-600',
      icon: CheckCircle,
      text: 'text-white'
    },
    error: {
      bg: 'bg-red-600',
      icon: XCircle,
      text: 'text-white'
    },
    info: {
      bg: 'bg-blue-600',
      icon: Info,
      text: 'text-white'
    },
    warning: {
      bg: 'bg-amber-600',
      icon: AlertCircle,
      text: 'text-white'
    }
  };

  const { bg, icon: Icon, text } = styles[type];

  return (
    <div
      className={`${bg} ${text} rounded-xl shadow-2xl p-4 flex items-center gap-3 min-w-[300px] transition-all duration-300 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="flex-1 font-medium text-sm">{message}</p>
      <button
        onClick={handleClose}
        className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
