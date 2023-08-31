import React, { useState } from "react";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";

interface PasswordInputProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  isShowHide: boolean;
  label: string;
}

export default function PasswordInput({
  value,
  setValue,
  isShowHide,
  label,
}: PasswordInputProps) {
  const [isShow, setIsShow] = useState(false);
  const [type, setType] = useState("password");

  const toggleShow = () => {
    setIsShow((prev) => !prev);
    setType((prev) => (prev === "password" ? "text" : "password"));
  };

  return (
    <div className="w-full">
      <label className="label py-0">
        <span className="label-text">{label}</span>
      </label>
      <input
        className="input input-bordered w-full"
        name={label}
        type={type}
        placeholder="*******"
        autoComplete="new-password"
        onChange={(e) => setValue(e.target.value)}
        value={value}
        required
      />
      <span className="flex justify-end">
        {isShowHide && (
          <span className="mr-5 mt-[-2rem] cursor-pointer">
            {isShow ? (
              <FaEye onClick={() => toggleShow()} />
            ) : (
              <FaRegEyeSlash onClick={() => toggleShow()} />
            )}
          </span>
        )}
      </span>
    </div>
  );
}
