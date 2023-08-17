import React, { useState } from "react";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";

interface PasswordInputProps {
  setValue: React.Dispatch<React.SetStateAction<string>>;
  isShowHide: boolean;
}

export default function PasswordInput({
  setValue,
  isShowHide,
}: PasswordInputProps) {
  const [isShow, setIsShow] = useState(false);
  const [type, setType] = useState("password");

  const toggleShow = () => {
    setIsShow((prev) => !prev);
    setType((prev) => (prev === "password" ? "text" : "password"));
  };

  return (
    <>
      <input
        className="input input-bordered w-full"
        name="confirmPassword"
        type={type}
        placeholder="*******"
        autoComplete="new-password"
        onChange={(e) => setValue(e.target.value)}
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
    </>
  );
}
