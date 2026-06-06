import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  addToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-white dark:bg-emerald-950 border-l-4 border-green-500',
          icon: <CheckCircle className="text-green-500" size={18} />,
        };
      case 'error':
        return {
          bg: 'bg-white dark:bg-slate-900 border-l-4 border-red-500',
          icon: <AlertCircle className="text-red-500" size={18} />,
        };
      default:
        return {
          bg: 'bg-white dark:bg-emerald-950 border-l-4 border-brand-accent',
          icon: <Info className="text-brand-accent" size={18} />,
        };
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      {/* Floating Toasts container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const { bg, icon } = getToastStyles(toast.type);
          return (
            <div
              key={toast.id}
              className={`${bg} shadow-2xl rounded-xl p-4 border border-slate-100 dark:border-slate-800 flex items-start gap-3 pointer-events-auto animate-slide-up transition-all duration-300`}
            >
              <div className="shrink-0 mt-0.5">{icon}</div>
              <div className="flex-1 text-xs">
                <span className="font-extrabold text-brand-dark dark:text-white block text-sm leading-snug">{toast.title}</span>
                <span className="text-slate-550 dark:text-slate-400 mt-0.5 block leading-relaxed">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                aria-label="Close notification"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
