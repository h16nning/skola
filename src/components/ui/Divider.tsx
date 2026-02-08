import "./Divider.css";

interface DividerProps {
  className?: string;
}

export function Divider({ className = "" }: DividerProps) {
  return <hr className={`divider ${className}`} />;
}
