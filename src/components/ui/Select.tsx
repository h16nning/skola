import {
  type ReactNode,
  type SelectHTMLAttributes,
  forwardRef,
  useId,
} from "react";
import { InputDescription } from "./InputDescription";
import { InputError } from "./InputError";
import { InputLabel } from "./InputLabel";
import "./Select.css";

const BASE = "select";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value"> {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  data: SelectOption[];
  onChange?: (value: string | null) => void;
  value?: string | null;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      label,
      description,
      error,
      className = "",
      id,
      data,
      onChange,
      value,
      ...props
    },
    ref
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const classes = [BASE, error ? `${BASE}--error` : "", className]
      .filter(Boolean)
      .join(" ");

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        const val = e.target.value;
        onChange(val === "" ? null : val);
      }
    };

    return (
      <div className={classes}>
        {label && <InputLabel htmlFor={inputId}>{label}</InputLabel>}
        {description && <InputDescription>{description}</InputDescription>}
        <div className={`${BASE}__wrapper`}>
          <select
            ref={ref}
            id={inputId}
            className={`${BASE}__field`}
            value={value || ""}
            onChange={handleChange}
            {...props}
          >
            {data.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            className={`${BASE}__chevron`}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <InputError>{error}</InputError>
      </div>
    );
  }
);
