import { ToastI } from "../hooks/toastContext";
import Toast from "./toast";

export default function ToastSection({
  toasts,
  removeToast,
}: {
  toasts: ToastI[];
  removeToast: (index: number) => void;
}) {
  return (
    <div className="toast z-50">
      {toasts.map(({ type, message }, i) => (
        <Toast
          key={i}
          type={type}
          message={message}
          removeToast={() => removeToast(i)}
          i={i}
        />
      ))}
    </div>
  );
}
