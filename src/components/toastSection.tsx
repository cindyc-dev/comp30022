import React from "react";
import {
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";

interface ToastProps {
  type: "error" | "success" | "warning" | "info";
  message: string;
}

export default function ToastSection({ toasts }: { toasts: ToastProps[] }) {
  return (
    <div className="toast z-50">
      {toasts.map(({ type, message }, i) => (
        <div className={`alert alert-${type}`} key={i}>
          {type === "info" && <FaInfoCircle />}
          {type === "success" && <FaCheckCircle />}
          {type === "warning" && <FaExclamationTriangle />}
          {type === "error" && <RxCrossCircled />}
          <span>{message}.</span>
        </div>
      ))}
    </div>
  );
}
