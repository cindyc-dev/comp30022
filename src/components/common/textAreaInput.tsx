import React from "react";

interface TextAreaInputProps {
  label: string;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  props?: object;
  required?: boolean;
}

const TextAreaInput = ({
  label,
  value,
  setValue,
  placeholder,
  props,
  required = false,
}: TextAreaInputProps) => {
  return (
    <div className="w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <textarea
        className="textarea textarea-bordered w-full"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required={required}
        {...props}
      ></textarea>
    </div>
  );
};

export default TextAreaInput;
