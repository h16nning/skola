import type { MouseEvent, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./NavItem.css";

const BASE = "nav-item";

interface NavItemProps {
  label: string;
  path?: string;
  icon: ReactNode;
  rightElement?: ReactNode;
  collapsed?: boolean;
  indent?: number;
  onClick?: () => void;
  active?: boolean;
  size?: "default" | "small";
}

export function NavItem({
  label,
  path,
  icon,
  rightElement,
  collapsed = false,
  indent = 0,
  onClick,
  active,
  size = "default",
}: NavItemProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive =
    active ?? (path ? location.pathname.startsWith(path) : false);

  const handleClick = () => {
    onClick?.();
    if (path) {
      navigate(path);
    }
  };

  const handleRightElementClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const classes = [
    BASE,
    isActive && `${BASE}--active`,
    collapsed && `${BASE}--collapsed`,
    size === "small" && `${BASE}--small`,
  ]
    .filter(Boolean)
    .join(" ");

  const style =
    indent > 0
      ? { paddingLeft: `calc(var(--spacing-md) + ${indent * 0.75}rem)` }
      : undefined;

  return (
    <button
      type="button"
      className={classes}
      onClick={handleClick}
      title={collapsed ? label : undefined}
      style={style}
    >
      <span className={`${BASE}__icon`}>{icon}</span>
      {!collapsed && <span className={`${BASE}__label`}>{label}</span>}
      {!collapsed && rightElement && (
        <span className={`${BASE}__right`} onClick={handleRightElementClick}>
          {rightElement}
        </span>
      )}
    </button>
  );
}
