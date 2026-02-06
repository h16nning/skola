import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import "./Menu.css";

const BASE = "menu";

type MenuPosition = "bottom-start" | "bottom-end" | "top-start" | "top-end";

interface MenuContextValue {
  dropdownRef: React.RefObject<HTMLDivElement>;
  triggerRef: React.RefObject<HTMLDivElement>;
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
  const triggerRef = useRef<HTMLDivElement>(null!);
  const dropdownRef = useRef<HTMLDivElement>(null!);
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => {
    const el = dropdownRef.current;
    if (!el) return;
    try {
      (el as any).hidePopover();
    } catch {
      // already hidden
    }
  }, []);

  useEffect(() => {
    const el = dropdownRef.current;
    if (!el) return;

    el.setAttribute("popover", "auto");

    function handleToggle(event: Event) {
      const opening = (event as any).newState === "open";
      setIsOpen(opening);
      if (opening) {
        positionDropdown();
      }
    }

    function positionDropdown() {
      const trigger = triggerRef.current;
      const dropdown = dropdownRef.current;
      if (!trigger || !dropdown) return;

      const triggerRect = trigger.getBoundingClientRect();
      const dropdownRect = dropdown.getBoundingClientRect();
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

      dropdown.style.top = `${top}px`;
      dropdown.style.left = `${left}px`;
    }

    el.addEventListener("toggle", handleToggle);
    return () => el.removeEventListener("toggle", handleToggle);
  }, [position]);

  const contextValue: MenuContextValue = {
    dropdownRef,
    triggerRef,
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
          ref={dropdownRef}
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
  const { dropdownRef, triggerRef } = useMenuContext();

  function handleClick() {
    const el = dropdownRef.current;
    if (!el) return;
    try {
      (el as any).togglePopover();
    } catch {
      // popover not supported
    }
  }

  return (
    <div
      ref={triggerRef}
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
  const { dropdownRef } = useMenuContext();
  const portalRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const portal = portalRef.current;
    const target = dropdownRef.current;
    if (!target || !portal) return;

    const nodes: Node[] = [];
    while (portal.firstChild) {
      nodes.push(portal.firstChild);
      target.appendChild(portal.firstChild);
    }

    return () => {
      for (const node of nodes) {
        if (node.parentNode === target) {
          portal.appendChild(node);
        }
      }
    };
  }, [dropdownRef]);

  return (
    <div ref={portalRef} style={{ display: "none" }}>
      {children}
    </div>
  );
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
      onClick={handleClick}
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
