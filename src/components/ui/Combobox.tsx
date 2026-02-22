import {
  type ReactNode,
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import "./Combobox.css";
import { IconChevronDown } from "@tabler/icons-react";
import { InputDescription } from "./InputDescription";
import { InputError } from "./InputError";
import { InputLabel } from "./InputLabel";

const BASE = "combobox";

interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  data: ComboboxOption[];
  onChange?: (value: string | null) => void;
  value?: string | null;
  searchable?: boolean;
  nothingFoundMessage?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export const Combobox = forwardRef<HTMLButtonElement, ComboboxProps>(
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
    },
    ref
  ) {
    const generatedId = useId();
    const buttonId = id ?? generatedId;
    const popoverId = `${buttonId}-popover`;
    const [searchQuery, setSearchQuery] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const listboxRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const selectedOption = data.find((option) => option.value === value);

    const filteredData = searchable
      ? data.filter((option) =>
          option.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : data;

    useEffect(() => {
      const listbox = listboxRef.current;
      if (!listbox) return;

      const handleToggle = (e: ToggleEvent) => {
        if (e.newState === "closed") {
          setSearchQuery("");
          setHighlightedIndex(0);
        } else if (e.newState === "open" && searchable) {
          setTimeout(() => searchInputRef.current?.focus(), 0);
        }
      };

      listbox.addEventListener("toggle", handleToggle as EventListener);
      return () => {
        listbox.removeEventListener("toggle", handleToggle as EventListener);
      };
    }, [searchable]);

    useEffect(() => {
      const listbox = listboxRef.current;
      if (!listbox?.matches(":popover-open")) return;

      const optionElements = listbox.querySelectorAll(
        `.${BASE}__option:not(.${BASE}__option--empty)`
      );
      const highlighted = optionElements[highlightedIndex] as HTMLElement;
      highlighted?.scrollIntoView({ block: "nearest" });
    }, [highlightedIndex]);

    const handleSelect = (optionValue: string) => {
      onChange?.(optionValue);
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
            listboxRef.current?.showPopover();
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
          if (isOpen && filteredData[highlightedIndex]) {
            e.preventDefault();
            handleSelect(filteredData[highlightedIndex].value);
          }
          break;
        case " ":
          if (!searchable && !isOpen) {
            e.preventDefault();
            listboxRef.current?.showPopover();
          }
          break;
      }
    };

    const classes = [BASE, error ? `${BASE}--error` : "", className]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={classes}>
        {label && <InputLabel htmlFor={buttonId}>{label}</InputLabel>}
        {description && <InputDescription>{description}</InputDescription>}
        <div className={`${BASE}__wrapper`}>
          <button
            ref={(node) => {
              (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            }}
            type="button"
            id={buttonId}
            className={`${BASE}__trigger`}
            popoverTarget={popoverId}
            onKeyDown={!searchable ? handleKeyDown : undefined}
            disabled={disabled}
            aria-haspopup="listbox"
          >
            <span className={`${BASE}__value`}>
              {selectedOption?.label || "Select..."}
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
            {searchable && (
              <div className={`${BASE}__search-wrapper`}>
                <input
                  ref={searchInputRef}
                  type="text"
                  className={`${BASE}__search-input`}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search..."
                />
              </div>
            )}
            {filteredData.length === 0 ? (
              <div className={`${BASE}__option ${BASE}__option--empty`}>
                {nothingFoundMessage}
              </div>
            ) : (
              filteredData.map((option, index) => {
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
                    key={option.value}
                    type="button"
                    className={optionClasses}
                    onClick={() => handleSelect(option.value)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {option.label}
                  </button>
                );
              })
            )}
          </div>
        </div>
        <InputError>{error}</InputError>
      </div>
    );
  }
);
