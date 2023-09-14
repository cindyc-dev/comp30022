import { ReactNode } from "react";
import { ModalProvider } from "./modalContext";
import { ToastProvider } from "./toastContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ModalProvider>
      <ToastProvider>{children}</ToastProvider>
    </ModalProvider>
  );
}
