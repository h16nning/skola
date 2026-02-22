import { IconCheck, IconDots } from "@tabler/icons-react";
import { type ReactNode, useId } from "react";
import "./Menu.css";
import { IconButton } from "./IconButton";

const BASE = "menu";

type MenuPosition = "bottom-start" | "bottom-end" | "top-start" | "top-end";

/**
 * A dropdown menu component, using the native Popover and Anchor positioning APIs.
 *
 * @param children The menu items to display inside the menu.
 * @renderTrigger An optional render prop to replace the default *three dots* trigger button. It receives an object with the `id` of the popover, which must be passed to the trigger element as `popover-target` attribute.
 * @param position The position of the menu relative to the trigger button. Defaults to `bottom-start`.
 * @param closeOnItemClick Whether the menu should close when a menu item is clicked. Defaults to `true`.
 **/
interface MenuProps {
  children: ReactNode;
  renderTrigger?: (props: { id: string }) => ReactNode;
  position?: MenuPosition;
  closeOnItemClick?: boolean;
}

export function Menu({ children, renderTrigger }: MenuProps) {
  const id = useId();

  const trigger = renderTrigger ? (
    renderTrigger({ id })
  ) : (
    <IconButton popovertarget={id} variant="subtle" aria-label="Menu">
      <IconDots />
    </IconButton>
  );

  return (
    <>
      {trigger}
      <div className={`${BASE}__popover`} id={id} role="menu" popover="auto">
        {children}
      </div>
    </>
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
  checked?: boolean;
}

export function MenuItem({
  children,
  leftSection,
  rightSection,
  onClick,
  color = "default",
  disabled = false,
  checked,
}: MenuItemProps) {
  function handleClick() {
    if (disabled) return;
    onClick?.();
    // if (closeOnItemClick) {
    //   close();
    // }
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
      {checked !== undefined && (
        <span className={`${BASE}__item-left`}>
          {checked ? (
            <IconCheck size={16} />
          ) : (
            <span style={{ width: 16, height: 16, display: "inline-block" }} />
          )}
        </span>
      )}
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
