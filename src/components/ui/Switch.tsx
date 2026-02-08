import {
  type InputHTMLAttributes,
  type ReactNode,
  forwardRef,
  useId,
} from "react";
import { InputDescription } from "./InputDescription";
import "./Switch.css";

const BASE = "switch";

interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
  description?: ReactNode;
  labelPosition?: "left" | "right";
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    label,
    description,
    labelPosition = "right",
    className = "",
    id,
    checked,
    onChange,
    disabled,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const classes = [
    BASE,
    `${BASE}--label-${labelPosition}`,
    disabled ? `${BASE}--disabled` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const labelContent = (label || description) && (
    <div className={`${BASE}__label-wrapper`}>
      {label && <span className={`${BASE}__label`}>{label}</span>}
      {description && <InputDescription>{description}</InputDescription>}
    </div>
  );

  return (
    <div className={classes}>
      {labelPosition === "left" && labelContent}
      <label htmlFor={inputId} className={`${BASE}__control-wrapper`}>
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          className={`${BASE}__input`}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
        <span className={`${BASE}__track`}>
          <span className={`${BASE}__thumb`} />
        </span>
      </label>
      {labelPosition === "right" && labelContent}
    </div>
  );
});
