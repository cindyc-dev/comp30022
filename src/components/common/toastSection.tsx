import React from "react";
import {
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { ToastI } from "../hooks/toastContext";

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
        <div
          className={`alert alert-${type} cursor-pointer`}
          key={i}
          onClick={() => removeToast(i)}
        >
          {type === "info" && <FaInfoCircle />}
          {type === "success" && <FaCheckCircle />}
          {type === "warning" && <FaExclamationTriangle />}
          {type === "error" && <RxCrossCircled />}
          <div className="max-w-sm whitespace-normal lg:max-w-md">
            {message}
          </div>
        </div>
      ))}
    </div>
  );
}
