import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
} from "react";
import { createPortal } from "react-dom";
import "./Menu.css";

const BASE = "menu";

type MenuPosition = "bottom-start" | "bottom-end" | "top-start" | "top-end";

interface MenuContextValue {
  dropdownElement: HTMLDivElement | null;
  setTriggerElement: (el: HTMLDivElement | null) => void;
  triggerElement: HTMLDivElement | null;
  close: () => void;
  closeOnItemClick: boolean;
}

const MenuContext = createContext<MenuContextValue | null>(null);

function useMenuContext() {
  const ctx = useContext(MenuContext);
  if (!ctx)
    throw new Error("Menu compound components must be used within <Menu>");
  return ctx;
}

interface MenuProps {
  children: ReactNode;
  position?: MenuPosition;
  closeOnItemClick?: boolean;
}

export function Menu({
  children,
  position = "bottom-end",
  closeOnItemClick = true,
}: MenuProps) {
  const popoverId = useId();
  const [triggerElement, setTriggerElement] = useState<HTMLDivElement | null>(
    null
  );
  const [dropdownElement, setDropdownElement] = useState<HTMLDivElement | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => {
    if (!dropdownElement) return;
    try {
      (dropdownElement as any).hidePopover();
    } catch {
      // already hidden
    }
  }, [dropdownElement]);

  useEffect(() => {
    if (!dropdownElement) return;

    dropdownElement.setAttribute("popover", "auto");

    function handleToggle(event: Event) {
      const opening = (event as any).newState === "open";
      setIsOpen(opening);
      if (opening) {
        positionDropdown();
      }
    }

    function positionDropdown() {
      if (!triggerElement || !dropdownElement) return;

      const triggerRect = triggerElement.getBoundingClientRect();
      const dropdownRect = dropdownElement.getBoundingClientRect();
      const verticalGap = 4;

      let top: number;
      let left: number;

      if (position.startsWith("top")) {
        top = triggerRect.top - dropdownRect.height - verticalGap;
      } else {
        top = triggerRect.bottom + verticalGap;
      }

      if (position.endsWith("end")) {
        left = triggerRect.right - dropdownRect.width;
      } else {
        left = triggerRect.left;
      }

      top = Math.max(
        8,
        Math.min(top, window.innerHeight - dropdownRect.height - 8)
      );
      left = Math.max(
        8,
        Math.min(left, window.innerWidth - dropdownRect.width - 8)
      );

      dropdownElement.style.top = `${top}px`;
      dropdownElement.style.left = `${left}px`;
    }

    dropdownElement.addEventListener("toggle", handleToggle);
    return () => dropdownElement.removeEventListener("toggle", handleToggle);
  }, [dropdownElement, triggerElement, position]);

  const contextValue: MenuContextValue = {
    dropdownElement,
    setTriggerElement,
    triggerElement,
    close,
    closeOnItemClick,
  };

  const dropdownClasses = [
    `${BASE}__dropdown`,
    isOpen && `${BASE}__dropdown--open`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <MenuContext.Provider value={contextValue}>
      <div className={BASE}>
        {children}
        <div
          ref={setDropdownElement}
          id={popoverId}
          className={dropdownClasses}
          role="menu"
        />
      </div>
    </MenuContext.Provider>
  );
}

interface MenuTriggerProps {
  children: ReactNode;
}

export function MenuTrigger({ children }: MenuTriggerProps) {
  const { dropdownElement, setTriggerElement } = useMenuContext();

  function handleClick() {
    if (!dropdownElement) return;
    try {
      (dropdownElement as any).togglePopover();
    } catch {
      // popover not supported
    }
  }

  return (
    <div
      ref={setTriggerElement}
      className={`${BASE}__trigger`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}

interface MenuDropdownProps {
  children: ReactNode;
}

export function MenuDropdown({ children }: MenuDropdownProps) {
  const { dropdownElement } = useMenuContext();

  if (!dropdownElement) return null;

  return createPortal(children, dropdownElement);
}

type MenuItemColor = "default" | "red";

interface MenuItemProps {
  children: ReactNode;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  onClick?: () => void;
  color?: MenuItemColor;
  disabled?: boolean;
}

export function MenuItem({
  children,
  leftSection,
  rightSection,
  onClick,
  color = "default",
  disabled = false,
}: MenuItemProps) {
  const { close, closeOnItemClick } = useMenuContext();

  function handleClick() {
    if (disabled) return;
    onClick?.();
    if (closeOnItemClick) {
      close();
    }
  }

  const classes = [
    `${BASE}__item`,
    color !== "default" && `${BASE}__item--${color}`,
    disabled && `${BASE}__item--disabled`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      onMouseUp={handleClick}
      role="menuitem"
      disabled={disabled}
    >
      {leftSection && (
        <span className={`${BASE}__item-left`}>{leftSection}</span>
      )}
      <span className={`${BASE}__item-label`}>{children}</span>
      {rightSection && (
        <span className={`${BASE}__item-right`}>{rightSection}</span>
      )}
    </button>
  );
}
