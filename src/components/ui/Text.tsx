import type { CSSProperties, ReactNode } from "react";
import "./Text.css";

const BASE = "text";

type TextSize = "xs" | "sm" | "base" | "lg" | "xl";
type TextWeight = "normal" | "medium" | "semibold" | "bold";
type TextVariant = "default" | "dimmed" | "primary";

interface TextProps {
  children: ReactNode;
  size?: TextSize;
  weight?: TextWeight;
  variant?: TextVariant;
  className?: string;
  style?: CSSProperties;
}

export function Text({
  children,
  size = "base",
  weight = "normal",
  variant = "default",
  className = "",
  style,
}: TextProps) {
  const classes = [
    BASE,
    `${BASE}--${size}`,
    `${BASE}--${weight}`,
    `${BASE}--${variant}`,
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
