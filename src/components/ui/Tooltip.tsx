import {
  useState,
  useRef,
  type ReactNode,
  type ReactElement,
  cloneElement,
} from "react";
import "./Tooltip.css";

const BASE = "tooltip";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  label: ReactNode;
  children: ReactElement;
  position?: TooltipPosition;
  disabled?: boolean;
}

export function Tooltip({
  label,
  children,
  position = "top",
  disabled = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showTooltip = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 300);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const tooltipClasses = [
    BASE,
    `${BASE}--${position}`,
    isVisible ? `${BASE}--visible` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={`${BASE}-wrapper`}>
      {cloneElement(children, {
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
        onFocus: showTooltip,
        onBlur: hideTooltip,
      })}
      {isVisible && (
        <span className={tooltipClasses} role="tooltip">
          {label}
        </span>
      )}
    </span>
  );
}
