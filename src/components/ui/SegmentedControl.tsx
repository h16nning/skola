import { type ReactNode, useState } from "react";
import "./SegmentedControl.css";

const BASE = "segmented-control";

interface SegmentedControlOption {
  value: string;
  label: ReactNode;
}

interface SegmentedControlProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  data: SegmentedControlOption[];
  className?: string;
}

export function SegmentedControl({
  value: controlledValue,
  defaultValue,
  onChange,
  data,
  className = "",
}: SegmentedControlProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue || data[0]?.value || ""
  );

  const value =
    controlledValue !== undefined ? controlledValue : uncontrolledValue;

  const handleChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setUncontrolledValue(newValue);
    }
    onChange?.(newValue);
  };

  const classes = [BASE, className].filter(Boolean).join(" ");

  return (
    <div className={classes} role="radiogroup">
      {data.map((option) => {
        const isActive = value === option.value;
        const buttonClasses = [
          `${BASE}__option`,
          isActive && `${BASE}__option--active`,
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <button
            key={option.value}
            type="button"
            aria-checked={isActive}
            className={buttonClasses}
            onClick={() => handleChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
