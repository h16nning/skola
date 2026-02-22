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
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const generatedId = useId();
  const buttonId = id ?? generatedId;

  const selectedOption = options.find((option) => option.value === value);

  useImperativeHandle(ref, () => ({
    focus: () => {
      triggerRef.current?.focus();
    },
    click: () => {
      if (!disabled) {
        setIsOpen((prev) => !prev);
        triggerRef.current?.focus();
      }
    },
  }));

  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && listboxRef.current) {
      const highlighted = listboxRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlighted) {
        highlighted.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (optionValue: T) => {
    onChange(optionValue);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen && options[highlightedIndex]) {
          handleSelect(options[highlightedIndex].value);
        } else {
          setIsOpen(true);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
    }
  };

  const classes = [
    BASE,
    error ? `${BASE}--error` : "",
    disabled ? `${BASE}--disabled` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {label && <InputLabel htmlFor={buttonId}>{label}</InputLabel>}
      {description && <InputDescription>{description}</InputDescription>}
      <div className={`${BASE}__wrapper`} ref={containerRef}>
        <button
          ref={triggerRef}
          type="button"
          id={buttonId}
          className={`${BASE}__trigger ${isOpen ? `${BASE}__trigger--open` : ""}`}
          onMouseDown={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className={`${BASE}__value`}>
            {selectedOption?.icon && (
              <selectedOption.icon width="1.2rem" strokeWidth="1.5px" />
            )}
            <span>{selectedOption?.label || "Select..."}</span>
          </span>
          <IconChevronDown
            className={`${BASE}__chevron ${isOpen ? `${BASE}__chevron--open` : ""}`}
            aria-hidden="true"
          />
        </button>
        {isOpen && (
          <div ref={listboxRef} className={`${BASE}__dropdown`}>
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isHighlighted = index === highlightedIndex;

              const optionClasses = [
                `${BASE}__option`,
                isSelected ? `${BASE}__option--selected` : "",
                isHighlighted ? `${BASE}__option--highlighted` : "",
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
                >
                  {option.icon && (
                    <option.icon width="1.2rem" strokeWidth="1.5px" />
                  )}
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <InputError>{error}</InputError>
    </div>
  );
}

export const Select = forwardRef(SelectInner) as <T = string>(
  props: SelectProps<T> & { ref?: React.Ref<SelectRef> }
) => React.ReactElement;
