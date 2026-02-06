import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.css";

const BASE = "button";

type ButtonVariant = "default" | "primary" | "subtle" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
}

export function Button({
  children,
  variant = "default",
  size = "md",
  leftSection,
  rightSection,
  className = "",
  ...props
}: ButtonProps) {
  const classes = [BASE, `${BASE}--${variant}`, `${BASE}--${size}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      {...props}
      aria-disabled={props.disabled}
    >
      {leftSection && (
        <span className={`${BASE}__left-section`}>{leftSection}</span>
      )}
      <span className={`${BASE}__content`}>{children}</span>
      {rightSection && (
        <span className={`${BASE}__right-section`}>{rightSection}</span>
      )}
    </button>
  );
}
