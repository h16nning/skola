import type { ButtonHTMLAttributes } from "react";
import "./HamburgerButton.css";

const BASE = "hamburger-button";

interface HamburgerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  opened: boolean;
  size?: "sm" | "md" | "lg";
}

export function HamburgerButton({
  opened,
  size = "md",
  className = "",
  ...props
}: HamburgerButtonProps) {
  const classes = [
    BASE,
    `${BASE}--${size}`,
    opened && `${BASE}--opened`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      aria-label="Toggle menu"
      {...props}
    >
      <span className={`${BASE}__bar`} />
      <span className={`${BASE}__bar`} />
      <span className={`${BASE}__bar`} />
    </button>
  );
}
