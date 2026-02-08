import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./IconButton.css";

const BASE = "icon-button";

type IconButtonVariant = "default" | "subtle" | "ghost";
type IconButtonSize = "sm" | "md" | "lg";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
}

export function IconButton({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}: IconButtonProps) {
  const classes = [BASE, `${BASE}--${variant}`, `${BASE}--${size}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
