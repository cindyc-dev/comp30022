import React, { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { useModal } from "../hooks/modalContext";
import { Modal } from "../common/modal";
import { useToast } from "../hooks/toastContext";
import ToastSection from "../common/toastSection";

export const Layout = ({ children }: { children: ReactNode }) => {
  const { modals, closeModal } = useModal();
  const { toasts, removeToast } = useToast();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container prose m-auto flex max-w-[80vw] flex-grow flex-col items-center justify-center xl:max-w-screen-xl">
        {children}
      </div>
      <Footer />
      {modals.map((modal) => (
        <Modal key={modal.id} closeModal={() => closeModal(modal.id)}>
          {modal.content}
        </Modal>
      ))}
      <ToastSection toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Layout;
