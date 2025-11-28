import { useEffect } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = 'error', onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up mx-4 sm:mx-0">
      <div
        className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg max-w-xs sm:max-w-md ${
          type === 'success'
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
        }`}
      >
        {type === 'success' ? (
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
        )}
        <p
          className={`text-xs sm:text-sm font-medium ${
            type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}
        >
          {message}
        </p>
        <button
          onClick={onClose}
          className={`ml-auto p-1 rounded hover:bg-opacity-20 flex-shrink-0 ${
            type === 'success' ? 'hover:bg-green-600' : 'hover:bg-red-600'
          }`}
        >
          <X className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
}
