import type { ReactNode } from "react";
import "./Paper.css";

const BASE = "paper";

interface PaperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  withBorder?: boolean;
  withTexture?: boolean;
  shadow?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function Paper({
  children,
  withBorder = false,
  withTexture = true,
  shadow,
  className = "",
  ...props
}: PaperProps) {
  const classes = [
    BASE,
    withBorder && `${BASE}--with-border`,
    withTexture && `${BASE}--with-texture`,
    shadow && `${BASE}--shadow-${shadow}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
