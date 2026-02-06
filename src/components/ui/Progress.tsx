import "./Progress.css";

const BASE = "progress";

type ProgressSize = "xs" | "sm" | "md" | "lg";

interface ProgressProps {
  value: number;
  size?: ProgressSize;
  className?: string;
  style?: React.CSSProperties;
}

export function Progress({
  value,
  size = "md",
  className = "",
  style,
}: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const classes = [BASE, `${BASE}--${size}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} style={style}>
      <div
        className={`${BASE}__bar`}
        style={{ width: `${clampedValue}%` }}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
