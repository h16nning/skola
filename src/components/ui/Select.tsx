import {
  type ReactNode,
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "./Select.css";
import { IconChevronDown } from "@tabler/icons-react";
import { InputDescription } from "./InputDescription";
import { InputError } from "./InputError";
import { InputLabel } from "./InputLabel";

const BASE = "select";

export interface SelectOption<T = string> {
  value: T;
  label: string;
  icon?: React.ComponentType<any>;
}

interface SelectProps<T = string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  id?: string;
  className?: string;
  disabled?: boolean;
}

export interface SelectRef {
  focus: () => void;
  click: () => void;
}

function SelectInner<T = string>(
  {
    value,
    onChange,
    options,
    label,
    description,
    error,
    id,
    className = "",
    disabled = false,
  }: SelectProps<T>,
  ref: React.Ref<SelectRef>
) {
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const buttonId = id ?? generatedId;
  const popoverId = `${buttonId}-popover`;

  const selectedOption = options.find((option) => option.value === value);

  useImperativeHandle(ref, () => ({
    focus: () => triggerRef.current?.focus(),
    click: () => {
      if (!disabled) triggerRef.current?.click();
    },
  }));

  useEffect(() => {
    const listbox = listboxRef.current;
    if (!listbox) return;

    const handleToggle = (e: ToggleEvent) => {
      if (e.newState === "closed") {
        setHighlightedIndex(0);
      }
    };

    listbox.addEventListener("toggle", handleToggle as EventListener);
    return () =>
      listbox.removeEventListener("toggle", handleToggle as EventListener);
  }, []);

  useEffect(() => {
    const listbox = listboxRef.current;
    if (!listbox?.matches(":popover-open")) return;

    const highlighted = listbox.children[highlightedIndex] as HTMLElement;
    highlighted?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  const handleSelect = (optionValue: T) => {
    onChange(optionValue);
    listboxRef.current?.hidePopover();
    triggerRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    const isOpen = listboxRef.current?.matches(":popover-open");

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          triggerRef.current?.click();
        } else {
          setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen && options[highlightedIndex]) {
          handleSelect(options[highlightedIndex].value);
        } else {
          triggerRef.current?.click();
        }
        break;
    }
  };

  const classes = [
    BASE,
    error && `${BASE}--error`,
    disabled && `${BASE}--disabled`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {label && <InputLabel htmlFor={buttonId}>{label}</InputLabel>}
      {description && <InputDescription>{description}</InputDescription>}
      <div className={`${BASE}__wrapper`}>
        <button
          ref={triggerRef}
          type="button"
          id={buttonId}
          className={`${BASE}__trigger`}
          popoverTarget={popoverId}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
        >
          <span className={`${BASE}__value`}>
            {selectedOption?.icon && (
              <selectedOption.icon width="var(--icon-size-sm)" />
            )}
            <span>{selectedOption?.label || "Select..."}</span>
          </span>
          <IconChevronDown className={`${BASE}__chevron`} aria-hidden="true" />
        </button>
        <div
          ref={listboxRef}
          id={popoverId}
          className={`${BASE}__dropdown`}
          popover="auto"
          role="listbox"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightedIndex;

            const optionClasses = [
              `${BASE}__option`,
              isSelected && `${BASE}__option--selected`,
              isHighlighted && `${BASE}__option--highlighted`,
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                key={String(option.value)}
                type="button"
                className={optionClasses}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                role="option"
                aria-selected={isSelected}
              >
                {option.icon && <option.icon width="var(--icon-size-sm)" />}
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <InputError>{error}</InputError>
    </div>
  );
}

export const Select = forwardRef(SelectInner) as <T = string>(
  props: SelectProps<T> & { ref?: React.Ref<SelectRef> }
) => React.ReactElement<any>;
