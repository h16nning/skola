import type { ReactNode } from "react";
import "./InputError.css";

const BASE = "input-error";

interface InputErrorProps {
  children: ReactNode;
  className?: string;
}

export function InputError({ children, className = "" }: InputErrorProps) {
  if (!children) return null;

  const classes = [BASE, className].filter(Boolean).join(" ");

  return <span className={classes}>{children}</span>;
}
