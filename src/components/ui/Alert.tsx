import type { ReactNode } from "react";
import "./Alert.css";

const BASE = "alert";

type AlertVariant = "info" | "warning" | "error" | "success";

interface AlertProps {
  children: ReactNode;
  variant?: AlertVariant;
  icon?: ReactNode;
  className?: string;
}

export function Alert({
  children,
  variant = "info",
  icon,
  className = "",
}: AlertProps) {
  const classes = [BASE, `${BASE}--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} role="alert">
      {icon && <div className={`${BASE}__icon`}>{icon}</div>}
      <div className={`${BASE}__content`}>{children}</div>
    </div>
  );
}
