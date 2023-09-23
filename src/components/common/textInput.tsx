import RequiredStar from "./requiredStar";

interface TextInputProps {
  label: string;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  type?: string;
  props?: object;
  required?: boolean;
}

export const TextInput = ({
  label,
  value,
  setValue,
  placeholder,
  type = "text",
  props,
  required = false,
}: TextInputProps) => (
  <div className="w-full">
    <label className="label py-0">
      <span className="label-text">
        {label}
        {required && <RequiredStar />}
      </span>
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="input input-bordered w-full"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      required={required}
      {...props}
    />
  </div>
);

export default TextInput;
