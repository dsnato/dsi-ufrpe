import React, { createContext, ReactNode, useContext, useState } from 'react';
import Toast, { ToastType } from './Toast';

interface ToastConfig {
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (config: ToastConfig) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toastConfig, setToastConfig] = useState<ToastConfig | null>(null);
  const [visible, setVisible] = useState(false);

  const showToast = (config: ToastConfig) => {
    setToastConfig(config);
    setVisible(true);
  };

  const showSuccess = (message: string, duration = 3000) => {
    showToast({ message, type: 'success', duration });
  };

  const showError = (message: string, duration = 3000) => {
    showToast({ message, type: 'error', duration });
  };

  const showInfo = (message: string, duration = 3000) => {
    showToast({ message, type: 'info', duration });
  };

  const handleHide = () => {
    setVisible(false);
    setTimeout(() => {
      setToastConfig(null);
    }, 300);
  };

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo }}>
      {children}
      {toastConfig && (
        <Toast
          message={toastConfig.message}
          type={toastConfig.type}
          visible={visible}
          duration={toastConfig.duration}
          onHide={handleHide}
        />
      )}
    </ToastContext.Provider>
  );
};
