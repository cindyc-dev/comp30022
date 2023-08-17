// https://vercel.com/guides/react-context-state-management-nextjs#using-context-in-client-components

import { ReactNode, createContext, useContext, useState } from "react";

interface ModalI {
  id: string;
  content: ReactNode;
}

interface ModalContextType {
  modals: ModalI[];
  openModal: (content: ReactNode) => void;
  closeModal: (id: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Custom hook to use the ModalContext
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  // Stores open modals
  const [modals, setModals] = useState<ModalI[]>([]);

  const openModal = (content: ReactNode) => {
    const id = Date.now().toString();
    setModals((prevModals) => [...prevModals, { id, content }]);
  };

  const closeModal = (id: string) => {
    setModals((prevModals) => prevModals.filter((modal) => modal.id !== id));
  };
  const modalContextValue: ModalContextType = {
    modals,
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={modalContextValue}>
      {children}
    </ModalContext.Provider>
  );
};
