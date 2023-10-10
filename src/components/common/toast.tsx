import { useEffect, useState } from "react";
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
  // State to track the timer and hover state
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Effect to start the timer when the component is mounted
  useEffect(() => {
    // Start the timer only if it's not already running and the user is not hovering
    if (!timer && !isHovered) {
      const newTimer = setTimeout(() => {
        // Remove the toast
        removeToast(i);
      }, 5000);
      setTimer(newTimer);
    }

    // Cleanup function to clear the timer when the component unmounts
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer, isHovered]); // Dependencies to watch for changes

  // Event handlers for hover state
  const handleMouseEnter = () => {
    console.log("hovered");

    // Clear the timer if the user hovers over the component
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }

    // Set the hover state to true
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    console.log("not hovered");

    // Set the hover state to false
    setIsHovered(false);
  };

  return (
    <div
      className={`${alertStyleMap[type]} alert cursor-pointer`}
      onClick={() => removeToast(i)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
