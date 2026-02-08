import type { ReactNode } from "react";
import "./Badge.css";

const BASE = "badge";

type BadgeVariant = "light" | "filled" | "outline";
type BadgeSize = "sm" | "md" | "lg";
type BadgeColor =
  | "primary"
  | "neutral"
  | "red"
  | "orange"
  | "lime"
  | "sky"
  | "fuchsia"
  | "grape"
  | "blue"
  | "green"
  | "yellow";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: BadgeColor;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function Badge({
  children,
  variant = "light",
  size = "md",
  color = "primary",
  className = "",
  style,
  onClick,
}: BadgeProps) {
  const classes = [
    BASE,
    `${BASE}--${variant}`,
    `${BASE}--${size}`,
    `${BASE}--${color}`,
    onClick && `${BASE}--clickable`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const Element = onClick ? "button" : "span";

  return (
    <Element
      className={classes}
      style={style}
      onClick={onClick}
      type={onClick ? "button" : undefined}
    >
      {children}
    </Element>
  );
}
