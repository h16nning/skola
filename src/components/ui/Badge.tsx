import type { ReactNode } from "react";
import "./Badge.css";

const BASE = "badge";

type BadgeVariant = "light" | "filled" | "outline";
type BadgeSize = "sm" | "md" | "lg";
type BadgeColor = "primary" | "gray" | "neutral";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: BadgeColor;
  className?: string;
  style?: React.CSSProperties;
}

export function Badge({
  children,
  variant = "light",
  size = "md",
  color = "primary",
  className = "",
  style,
}: BadgeProps) {
  const classes = [
    BASE,
    `${BASE}--${variant}`,
    `${BASE}--${size}`,
    `${BASE}--${color}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} style={style}>
      {children}
    </span>
  );
}
