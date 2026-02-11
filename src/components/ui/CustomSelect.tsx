import { useEffect, useId, useRef, useState } from "react";
import "./CustomSelect.css";

const BASE = "custom-select";

export interface SelectOption<T = string> {
  value: T;
  label: string;
  icon?: React.ComponentType<any>;
}

interface CustomSelectProps<T = string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  className?: string;
  disabled?: boolean;
}

export function CustomSelect<T = string>({
  value,
  onChange,
  options,
  className = "",
  disabled = false,
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const buttonId = useId();

  const selectedOption = options.find((option) => option.value === value);

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
        break;
    }
  };

  const classes = [BASE, disabled ? `${BASE}--disabled` : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} ref={containerRef}>
      <button
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
        <svg
          className={`${BASE}__chevron ${isOpen ? `${BASE}__chevron--open` : ""}`}
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
  );
}
