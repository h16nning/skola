import type { ReactNode } from "react";
import "./Kbd.css";

const BASE = "kbd";

interface KbdProps {
  children: ReactNode;
  className?: string;
}

export function Kbd({ children, className = "" }: KbdProps) {
  const classes = [BASE, className].filter(Boolean).join(" ");

  return <kbd className={classes}>{children}</kbd>;
}
