import { ReactNode } from "react";

export const Modal = ({
  children,
  closeModal,
}: {
  children: ReactNode;
  closeModal: () => void;
}) => {
  return (
    <div className="prose modal modal-open">
      <div className="modal-box w-11/12 max-w-5xl">
        <button
          className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
          onClick={() => closeModal()}
        >
          ✕
        </button>
        {children}
      </div>
      <div className="modal-backdrop" onClick={() => closeModal()}></div>
    </div>
  );
};

export default Modal;
