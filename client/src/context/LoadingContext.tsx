import React, { createContext, useContext, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingContextType {
  isLoading: boolean;
  showLoader: (message?: string) => void;
  hideLoader: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Processing action...');

  const showLoader = (msg = 'Processing action...') => {
    setMessage(msg);
    setIsLoading(true);
  };

  const hideLoader = () => {
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, showLoader, hideLoader }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white dark:bg-emerald-950 p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4 border border-slate-100 dark:border-emerald-900/30 max-w-xs text-center animate-scale-in">
            <Loader2 className="animate-spin text-brand-accent" size={36} />
            <div>
              <span className="font-extrabold text-brand-dark dark:text-white text-sm block">Please Wait</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-350 mt-1 block font-medium leading-relaxed">{message}</span>
            </div>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
