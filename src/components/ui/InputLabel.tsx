import { type ReactNode } from "react";
import "./InputLabel.css";

const BASE = "input-label";

interface InputLabelProps {
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

export const InputLabel = ({
  htmlFor,
  children,
  className = "",
}: InputLabelProps) => {
  const classes = [BASE, className].filter(Boolean).join(" ");

  return (
    <label htmlFor={htmlFor} className={classes}>
      {children}
    </label>
  );
};
