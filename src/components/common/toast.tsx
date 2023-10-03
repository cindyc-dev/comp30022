import { useEffect } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";

const alertStyleMap = {
  info: "alert-info",
  success: "alert-success",
  warning: "alert-warning",
  error: "alert-error",
};

interface ToastProps {
  type: "info" | "success" | "warning" | "error";
  message: string;
  removeToast: (i: number) => void;
  i: number;
}

function Toast({ type, message, removeToast, i }: ToastProps) {
  // Make toast disappear after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(i);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`${alertStyleMap[type]} alert cursor-pointer`}
      onClick={() => removeToast(i)}
    >
      {type === "info" && <FaInfoCircle />}
      {type === "success" && <FaCheckCircle />}
      {type === "warning" && <FaExclamationTriangle />}
      {type === "error" && <RxCrossCircled />}
      <div className="max-w-sm whitespace-normal lg:max-w-md">{message}</div>
    </div>
  );
}

export default Toast;
