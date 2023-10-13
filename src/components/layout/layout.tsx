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
import { ConnectionI } from "~/types/ConnectionI";
import { api } from "~/utils/api";

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
  const [connections, setConnections] = useState<ConnectionI[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<ConnectionI>();

  const { addToast } = useToast();

  // Get all connections
  const {
    data: connectionsData,
    isLoading: isConnectionsLoading,
    error: connectionsError,
  } = api.connection.getAllConnections.useQuery();
  useEffect(() => {
    if (connectionsData) {
      setConnections(connectionsData.map((c) => ({ ...c, tags: [] })));
    }
    if (connectionsError) {
      console.error(connectionsError);
      addToast({
        type: "error",
        message: `Failed to load connections. Error: ${connectionsError.message}`,
      });
    }
  }, [connectionsData, connectionsError]);

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
        <div className="fixed bottom-2 right-2 rounded-lg border-2 bg-base-100 p-2">
          <div className="flex flex-col shadow-sm">
            <div className="flex w-full justify-between px-2">
              <span className="font-semibold">Chat</span>
              <button
                className="btn btn-ghost btn-xs"
                onClick={() => setIsChatMini(true)}
              >
                <AiOutlineClose />
              </button>
            </div>
            <select
              value={selectedConnection?.id}
              className="select select-bordered w-full max-w-xs"
              defaultValue="Select Connection"
              onChange={(e) => {
                const selected = connections.find(
                  (c) => c.id === e.target.value
                );
                if (selected) {
                  setSelectedConnection(selected);
                }
              }}
            >
              <option disabled>Select Connection</option>
              {connections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="h-[30vh]">
            <Chat connection={selectedConnection} />
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
