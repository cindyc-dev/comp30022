interface TextInputProps {
  label: string;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  type?: string;
}

export const TextInput = ({
  label,
  value,
  setValue,
  placeholder,
  type = "text",
}: TextInputProps) => (
  <div className="w-full">
    <label className="label py-0">
      <span className="label-text">{label}</span>
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="input input-bordered w-full"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  </div>
);
