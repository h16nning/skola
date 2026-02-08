import {
  type InputHTMLAttributes,
  type ReactNode,
  forwardRef,
  useId,
} from "react";
import { InputDescription } from "./InputDescription";
import { InputError } from "./InputError";
import { InputLabel } from "./InputLabel";
import "./NumberInput.css";

const BASE = "number-input";

interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: ReactNode;
  error?: ReactNode;
  description?: ReactNode;
  onChange?: (value: number | string) => void;
  value?: number | string;
  rightSection?: ReactNode;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput(
    {
      label,
      error,
      description,
      className = "",
      id,
      onChange,
      value,
      rightSection,
      ...props
    },
    ref
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const classes = [BASE, error ? `${BASE}--error` : "", className]
      .filter(Boolean)
      .join(" ");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (onChange) {
        onChange(val === "" ? "" : Number(val));
      }
    };

    return (
      <div className={classes}>
        {label && <InputLabel htmlFor={inputId}>{label}</InputLabel>}
        {description && <InputDescription>{description}</InputDescription>}
        <div className={`${BASE}__wrapper`}>
          <input
            ref={ref}
            type="number"
            id={inputId}
            className={`${BASE}__field`}
            value={value}
            onChange={handleChange}
            {...props}
          />
          {rightSection && (
            <div className={`${BASE}__right-section`}>{rightSection}</div>
          )}
        </div>
        <InputError>{error}</InputError>
      </div>
    );
  }
);
