import RequiredStar from "./requiredStar";

interface TextAreaInputProps {
  label: string;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  required?: boolean;
}

function TextAreaInput({
  label,
  value,
  setValue,
  placeholder,
  required = false,
}: TextAreaInputProps) {
  return (
    <div className="w-full">
      <label className="label">
        <span className="label-text">
          {label} {required && <RequiredStar />}
        </span>
      </label>
      <textarea
        className="textarea textarea-bordered w-full"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      ></textarea>
    </div>
  );
}

export default TextAreaInput;
