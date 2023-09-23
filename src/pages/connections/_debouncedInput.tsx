import { InputHTMLAttributes, useState, useEffect } from "react";
import RequiredStar from "~/components/common/requiredStar";

interface DebouncedInputProps {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
  label?: string;
  reuqired?: boolean;
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  label,
  required = false,
  ...props
}: DebouncedInputProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className="w-full">
      <label className="label py-0">
        <span className="label-text">
          {label}
          {required && <RequiredStar />}
        </span>
      </label>
      <input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

export default DebouncedInput;
