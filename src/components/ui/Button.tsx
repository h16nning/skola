import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.css";

const BASE = "button";

type ButtonVariant =
  | "default"
  | "primary"
  | "subtle"
  | "neutral"
  | "white"
  | "ghost"
  | "transparent-ghost"
  | "destructive";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  as?: "button" | "span";
}

export function Button({
  children,
  variant = "default",
  size = "md",
  leftSection,
  rightSection,
  className = "",
  as: Component = "button",
  ...props
}: ButtonProps) {
  const classes = [BASE, `${BASE}--${variant}`, `${BASE}--${size}`, className]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {leftSection && (
        <span className={`${BASE}__left-section`}>{leftSection}</span>
      )}
      <span className={`${BASE}__content`}>{children}</span>
      {rightSection && (
        <span className={`${BASE}__right-section`}>{rightSection}</span>
      )}
    </>
  );

  if (Component === "span") {
    return (
      <span className={classes} {...(props as any)}>
        {content}
      </span>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      {...props}
      aria-disabled={props.disabled}
    >
      {content}
    </button>
  );
}
