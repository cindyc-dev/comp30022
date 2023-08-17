// https://vercel.com/guides/react-context-state-management-nextjs#using-context-in-client-components

import { ReactNode, createContext, useContext, useState } from "react";

interface ModalContextType {
  isModalOpened: boolean;
  openModal: () => void;
  closeModal: () => void;
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
  const [isModalOpened, setIsModalOpened] = useState(false);

  const openModal = () => {
    setIsModalOpened(true);
  };

  const closeModal = () => {
    setIsModalOpened(false);
  };

  return (
    <ModalContext.Provider value={{ isModalOpened, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
