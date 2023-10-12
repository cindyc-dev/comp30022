import React, { ReactNode, useEffect, useState } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { useModal } from "../hooks/modalContext";
import { Modal } from "../common/modal";
import { useToast } from "../hooks/toastContext";
import ToastSection from "../common/toastSection";
import Chat from "~/components/connections/chat/chat";
import { AiOutlineClose } from "react-icons/ai";
import { BsChatDotsFill } from "react-icons/bs";

export const Layout = ({
  children,
  onlyChildren = false,
  props,
}: {
  children: ReactNode;
  onlyChildren?: boolean;
  props?: object;
}) => {
  const { modals, closeModal } = useModal();
  const { toasts, removeToast } = useToast();
  const [isChatMini, setIsChatMini] = useState<boolean>(true);

  return (
    <div className="flex min-h-screen flex-col" {...props}>
      {!onlyChildren && <Navbar />}
      <div className="container prose m-auto flex max-w-[80vw] flex-grow flex-col items-center xl:max-w-screen-xl">
        {children}
      </div>
      {!onlyChildren && <Footer />}
      {modals.map((modal) => (
        <Modal key={modal.id} closeModal={() => closeModal(modal.id)}>
          {modal.content}
        </Modal>
      ))}
      <ToastSection toasts={toasts} removeToast={removeToast} />
      {/* Chatbox at bottom right */}
      {!isChatMini && (
        <div className="fixed bottom-2 right-2  rounded-lg border-2 bg-base-100 p-2">
          <div className="flex w-full justify-between px-2 shadow-sm">
            <span className="font-semibold">Chat</span>
            <button
              className="btn btn-ghost btn-xs"
              onClick={() => setIsChatMini(true)}
            >
              <AiOutlineClose />
            </button>
          </div>
          <div className="h-[30vh]">
            <Chat />
          </div>
        </div>
      )}
      {isChatMini && (
        <div className="fixed bottom-2 right-2 rounded-lg p-2">
          <button
            className="btn btn-circle btn-secondary btn-lg border-2"
            onClick={() => setIsChatMini(false)}
          >
            <BsChatDotsFill />
          </button>
        </div>
      )}
    </div>
  );
};

export default Layout;
