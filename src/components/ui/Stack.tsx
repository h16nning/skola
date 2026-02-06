import type { CSSProperties, ReactNode } from "react";

interface StackProps {
  children: ReactNode;
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  className?: string;
  style?: CSSProperties;
}

export function Stack({
  children,
  gap = "md",
  align = "stretch",
  className = "",
  style,
}: StackProps) {
  const gapMap = {
    xs: "var(--spacing-xs)",
    sm: "var(--spacing-sm)",
    md: "var(--spacing-md)",
    lg: "var(--spacing-lg)",
    xl: "var(--spacing-xl)",
  };

  const alignMap = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    stretch: "stretch",
  };

  const stackStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: gapMap[gap],
    alignItems: alignMap[align],
    ...style,
  };

  return (
    <div className={className} style={stackStyle}>
      {children}
    </div>
  );
}
