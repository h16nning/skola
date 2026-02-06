import {
  type InputHTMLAttributes,
  type ReactNode,
  forwardRef,
  useId,
} from "react";
import { InputDescription } from "./InputDescription";
import "./Checkbox.css";

const BASE = "checkbox";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
  description?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { label, description, className = "", id, disabled, ...props },
    ref
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const classes = [BASE, disabled ? `${BASE}--disabled` : "", className]
      .filter(Boolean)
      .join(" ");

    return (
      <label htmlFor={inputId} className={classes}>
        <div className={`${BASE}__wrapper`}>
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            className={`${BASE}__input`}
            disabled={disabled}
            {...props}
          />
          <div className={`${BASE}__box`}>
            <svg
              className={`${BASE}__icon`}
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M13 4L6 11L3 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        {(label || description) && (
          <div className={`${BASE}__label-wrapper`}>
            {label && <span className={`${BASE}__label`}>{label}</span>}
            {description && <InputDescription>{description}</InputDescription>}
          </div>
        )}
      </label>
    );
  }
);
