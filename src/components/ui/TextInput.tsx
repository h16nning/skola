import {
  type InputHTMLAttributes,
  type ReactNode,
  forwardRef,
  useId,
} from "react";
import { InputDescription } from "./InputDescription";
import { InputError } from "./InputError";
import { InputLabel } from "./InputLabel";
import "./TextInput.css";

const BASE = "text-input";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ label, description, error, className = "", id, ...props }, ref) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const classes = [BASE, error ? `${BASE}--error` : "", className]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={classes}>
        {label && <InputLabel htmlFor={inputId}>{label}</InputLabel>}
        {description && <InputDescription>{description}</InputDescription>}
        <input
          ref={ref}
          type="text"
          id={inputId}
          className={`${BASE}__field`}
          {...props}
        />
        <InputError>{error}</InputError>
      </div>
    );
  }
);
