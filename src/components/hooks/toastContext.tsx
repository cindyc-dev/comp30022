// ✏️ Confluence Documentation: https://comp30022team.atlassian.net/wiki/spaces/SD/pages/3538984/Context+and+Providers#Toast-Context-and-Provider

import { ReactNode, createContext, useContext, useState } from "react";

type ToastType = "success" | "error" | "warning" | "info";

export interface ToastI {
  id?: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toasts: ToastI[];
  addToast: (toast: ToastI) => void;
  removeToast: (index: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Custom hook to use the ToastContext
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  // Stores open toasts
  const [toasts, setToasts] = useState<ToastI[]>([]);

  const addToast = (toast: ToastI) => {
    setToasts((prevToasts) => [
      ...prevToasts,
      { ...toast, id: Date.now().toString() },
    ]);
  };

  const removeToast = (index: number) => {
    setToasts((prevToasts) => [
      ...prevToasts.slice(0, index),
      ...prevToasts.slice(index + 1),
    ]);
  };

  const toastContextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
  };

  return (
    <ToastContext.Provider value={toastContextValue}>
      {children}
    </ToastContext.Provider>
  );
};
