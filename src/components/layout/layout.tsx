import React, { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { useModal } from "../hooks/modalcontext";
import { Modal } from "../common/modal";

export const Layout = ({ children }: { children: ReactNode }) => {
  const { modals, closeModal } = useModal();
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
    </div>
  );
};
