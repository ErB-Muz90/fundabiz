'use client';

import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = 'info', onClose, duration = 5000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const styles = {
    success: 'border-green-200 bg-green-50',
    error: 'border-red-200 bg-red-50',
    info: 'border-blue-200 bg-blue-50',
  };

  return (
    <div
      className={clsx(
        'fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all duration-300 max-w-sm',
        styles[type],
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      )}
    >
      {icons[type]}
      <p className="text-sm text-gray-800 flex-1">{message}</p>
      <button onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} className="p-1 rounded hover:bg-black/5">
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
}
