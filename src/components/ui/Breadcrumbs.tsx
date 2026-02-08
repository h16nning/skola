import type { ReactNode } from "react";
import "./Breadcrumbs.css";

const BASE = "breadcrumbs";

interface BreadcrumbsProps {
  children: ReactNode;
  className?: string;
}

export function Breadcrumbs({ children, className = "" }: BreadcrumbsProps) {
  const classes = [BASE, className].filter(Boolean).join(" ");

  return (
    <nav className={classes} aria-label="Breadcrumb">
      {children}
    </nav>
  );
}

interface BreadcrumbItemProps {
  children: ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
}

export function BreadcrumbItem({
  children,
  onClick,
  isActive = false,
  className = "",
}: BreadcrumbItemProps) {
  const classes = [
    `${BASE}__item`,
    isActive && `${BASE}__item--active`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (onClick) {
    return (
      <button
        type="button"
        className={classes}
        onClick={onClick}
        aria-current={isActive ? "page" : undefined}
      >
        {children}
      </button>
    );
  }

  return (
    <span className={classes} aria-current={isActive ? "page" : undefined}>
      {children}
    </span>
  );
}

interface BreadcrumbSeparatorProps {
  children?: ReactNode;
}

export function BreadcrumbSeparator({
  children = "/",
}: BreadcrumbSeparatorProps) {
  return (
    <span className={`${BASE}__separator`} aria-hidden="true">
      {children}
    </span>
  );
}
