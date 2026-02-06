import {
  type ReactNode,
  type InputHTMLAttributes,
  forwardRef,
  useId,
  useState,
  useRef,
  useEffect,
} from "react";
import { InputDescription } from "./InputDescription";
import { InputError } from "./InputError";
import { InputLabel } from "./InputLabel";
import "./Combobox.css";

const BASE = "combobox";

interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "data"
  > {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  data: ComboboxOption[];
  onChange?: (value: string | null) => void;
  value?: string | null;
  searchable?: boolean;
  nothingFoundMessage?: string;
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  function Combobox(
    {
      label,
      description,
      error,
      className = "",
      id,
      data,
      onChange,
      value,
      searchable = false,
      nothingFoundMessage = "No options found",
      disabled,
      ...props
    },
    ref
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const listboxRef = useRef<HTMLUListElement>(null);

    const selectedOption = data.find((option) => option.value === value);

    const filteredData = searchable
      ? data.filter((option) =>
          option.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : data;

    useEffect(() => {
      if (!isOpen) {
        setSearchQuery("");
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

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

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

    const handleSelect = (optionValue: string) => {
      if (onChange) {
        onChange(optionValue);
      }
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
              prev < filteredData.length - 1 ? prev + 1 : prev
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
          e.preventDefault();
          if (isOpen && filteredData[highlightedIndex]) {
            handleSelect(filteredData[highlightedIndex].value);
          } else {
            setIsOpen(true);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          break;
        case " ":
          if (!searchable) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
          break;
      }
    };

    const handleFieldKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    const classes = [BASE, error ? `${BASE}--error` : "", className]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={classes} ref={containerRef}>
        {label && <InputLabel htmlFor={inputId}>{label}</InputLabel>}
        {description && <InputDescription>{description}</InputDescription>}
        <div className={`${BASE}__wrapper`}>
          <div
            className={`${BASE}__field ${isOpen ? `${BASE}__field--open` : ""}`}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleFieldKeyDown}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label={label ? undefined : "Select option"}
          >
            {searchable && isOpen ? (
              <input
                ref={ref}
                id={inputId}
                type="text"
                className={`${BASE}__search-input`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search..."
                autoFocus
                disabled={disabled}
                {...props}
              />
            ) : (
              <div
                className={`${BASE}__display`}
                role="combobox"
                aria-expanded={isOpen}
                aria-controls={`${inputId}-listbox`}
                aria-haspopup="listbox"
              >
                {selectedOption?.label || "Select..."}
              </div>
            )}
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
          </div>
          {isOpen && (
            <ul
              ref={listboxRef}
              id={`${inputId}-listbox`}
              className={`${BASE}__listbox`}
              role="listbox"
            >
              {filteredData.length === 0 ? (
                <li className={`${BASE}__option ${BASE}__option--empty`}>
                  {nothingFoundMessage}
                </li>
              ) : (
                filteredData.map((option, index) => (
                  <li
                    key={option.value}
                    className={`${BASE}__option ${
                      option.value === value ? `${BASE}__option--selected` : ""
                    } ${
                      index === highlightedIndex
                        ? `${BASE}__option--highlighted`
                        : ""
                    }`}
                    onClick={() => handleSelect(option.value)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    role="option"
                    aria-selected={option.value === value}
                  >
                    {option.label}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
        <InputError>{error}</InputError>
      </div>
    );
  }
);
