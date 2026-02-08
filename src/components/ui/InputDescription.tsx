import { type ReactNode } from "react";
import "./InputDescription.css";

const BASE = "input-description";

interface InputDescriptionProps {
  children: ReactNode;
  className?: string;
}

export const InputDescription = ({
  children,
  className = "",
}: InputDescriptionProps) => {
  const classes = [BASE, className].filter(Boolean).join(" ");

  return <div className={classes}>{children}</div>;
};
