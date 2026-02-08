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
  leftSection?: ReactNode;
  rightSection?: ReactNode;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    { label, description, error, leftSection, rightSection, className = "", id, ...props },
    ref
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const classes = [BASE, error ? `${BASE}--error` : "", className]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={classes}>
        {label && <InputLabel htmlFor={inputId}>{label}</InputLabel>}
        {description && <InputDescription>{description}</InputDescription>}
        <div className={`${BASE}__wrapper`}>
          {leftSection && (
            <span className={`${BASE}__left-section`}>{leftSection}</span>
          )}
          <input
            ref={ref}
            type="text"
            id={inputId}
            className={`${BASE}__field`}
            {...props}
          />
          {rightSection && (
            <span className={`${BASE}__right-section`}>{rightSection}</span>
          )}
        </div>
        <InputError>{error}</InputError>
      </div>
    );
  }
);
