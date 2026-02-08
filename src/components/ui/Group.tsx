import type { CSSProperties, ReactNode } from "react";

interface GroupProps {
  children: ReactNode;
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "space-between" | "space-around";
  wrap?: "wrap" | "nowrap";
  className?: string;
  style?: CSSProperties;
}

export function Group({
  children,
  gap = "md",
  align = "center",
  justify = "start",
  wrap = "wrap",
  className = "",
  style,
}: GroupProps) {
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

  const justifyMap = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    "space-between": "space-between",
    "space-around": "space-around",
  };

  const groupStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    gap: gapMap[gap],
    alignItems: alignMap[align],
    justifyContent: justifyMap[justify],
    flexWrap: wrap,
    ...style,
  };

  return (
    <div className={className} style={groupStyle}>
      {children}
    </div>
  );
}
