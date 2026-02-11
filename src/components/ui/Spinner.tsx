import "./Spinner.css";

const BASE = "spinner";

type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const classes = [BASE, `${BASE}--${size}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <output className={classes} aria-label="Loading">
      <div className={`${BASE}__circle`} />
    </output>
  );
}
