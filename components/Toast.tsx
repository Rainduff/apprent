import React, { useEffect } from 'react';
import { ToastNotification } from '../types';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  notifications: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ notifications, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-3 pointer-events-none">
      {notifications.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
           <Toast toast={toast} onDismiss={() => onDismiss(toast.id)} />
        </div>
      ))}
    </div>
  );
};

const Toast: React.FC<{ toast: ToastNotification; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  // Auto-dismiss
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const icons = {
    success: <CheckCircle className="h-6 w-6 text-emerald-500" />,
    error: <AlertCircle className="h-6 w-6 text-red-500" />,
    info: <Info className="h-6 w-6 text-sky-500" />
  };

  const borders = {
    success: 'border-l-emerald-500',
    error: 'border-l-red-500',
    info: 'border-l-sky-500'
  };

  return (
    <div className={`toast-slide bg-white shadow-lg rounded-r-lg border-l-4 ${borders[toast.type]} p-4 flex items-start max-w-sm w-full`}>
      <div className="flex-shrink-0">
        {icons[toast.type]}
      </div>
      <div className="ml-3 w-0 flex-1 pt-0.5">
        {toast.title && <p className="text-sm font-medium text-gray-900">{toast.title}</p>}
        <p className="text-sm text-gray-500">{toast.message}</p>
      </div>
      <div className="ml-4 flex-shrink-0 flex">
        <button
          className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
          onClick={onDismiss}
        >
          <span className="sr-only">Close</span>
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
