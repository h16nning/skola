import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import "./TextInput.css";

const BASE = "text-input";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: ReactNode;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ label, error, className = "", id, ...props }, ref) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const classes = [BASE, error ? `${BASE}--error` : "", className]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={classes}>
        {label && (
          <label htmlFor={inputId} className={`${BASE}__label`}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          type="text"
          id={inputId}
          className={`${BASE}__field`}
          {...props}
        />
        {error && <span className={`${BASE}__error`}>{error}</span>}
      </div>
    );
  }
);
