import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./NavItem.css";

const BASE = "nav-item";

interface NavItemProps {
  label: string;
  path: string;
  icon: ReactNode;
  collapsed?: boolean;
  onClick?: () => void;
}

export function NavItem({
  label,
  path,
  icon,
  collapsed = false,
  onClick,
}: NavItemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname.startsWith(path);

  const handleClick = () => {
    navigate(path);
    onClick?.();
  };

  const classes = [BASE, isActive && `${BASE}--active`, collapsed && `${BASE}--collapsed`]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={classes} onClick={handleClick} title={collapsed ? label : undefined}>
      <span className={`${BASE}__icon`}>{icon}</span>
      {!collapsed && <span className={`${BASE}__label`}>{label}</span>}
    </button>
  );
}
