import type { ReactNode } from "react";
import "./Paper.css";

const BASE = "paper";

interface PaperProps {
  children: ReactNode;
  withBorder?: boolean;
  shadow?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  style?: React.CSSProperties;
}

export function Paper({
  children,
  withBorder = false,
  shadow,
  className = "",
  style,
}: PaperProps) {
  const classes = [
    BASE,
    withBorder && `${BASE}--with-border`,
    shadow && `${BASE}--shadow-${shadow}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
}
