import { ReactNode } from "react";
import { ModalProvider } from "./modalContext";
import { ToastProvider } from "./toastContext";
import ThemeProvider from "./themeContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ModalProvider>
      <ToastProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </ToastProvider>
    </ModalProvider>
  );
}
