import {
  type ReactElement,
  type ReactNode,
  cloneElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
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
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<NodeJS.Timeout>();
  const wrapperRef = useRef<HTMLSpanElement>(null);

  const updatePosition = () => {
    if (!wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    setCoords({
      top: rect.top,
      left: rect.left,
    });
  };

  const showTooltip = () => {
    if (disabled) return;
    updatePosition();
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

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isVisible]);

  const tooltipClasses = [
    BASE,
    `${BASE}--${position}`,
    isVisible ? `${BASE}--visible` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const getTooltipStyles = () => {
    const styles: React.CSSProperties = {
      position: "fixed",
    };

    const wrapperRect = wrapperRef.current?.getBoundingClientRect();
    if (!wrapperRect) return styles;

    switch (position) {
      case "top":
        styles.top = coords.top;
        styles.left = coords.left + wrapperRect.width / 2;
        styles.transform = "translate(-50%, calc(-100% - var(--spacing-xs)))";
        break;
      case "bottom":
        styles.top = coords.top + wrapperRect.height;
        styles.left = coords.left + wrapperRect.width / 2;
        styles.transform = "translate(-50%, var(--spacing-xs))";
        break;
      case "left":
        styles.top = coords.top + wrapperRect.height / 2;
        styles.left = coords.left;
        styles.transform = "translate(calc(-100% - var(--spacing-xs)), -50%)";
        break;
      case "right":
        styles.top = coords.top + wrapperRect.height / 2;
        styles.left = coords.left + wrapperRect.width;
        styles.transform = "translate(var(--spacing-xs), -50%)";
        break;
    }

    return styles;
  };

  return (
    <>
      <span className={`${BASE}-wrapper`} ref={wrapperRef}>
        {cloneElement(children, {
          onMouseEnter: showTooltip,
          onMouseLeave: hideTooltip,
          onFocus: showTooltip,
          onBlur: hideTooltip,
        })}
      </span>
      {isVisible &&
        createPortal(
          <span
            className={tooltipClasses}
            role="tooltip"
            style={getTooltipStyles()}
          >
            {label}
          </span>,
          document.body
        )}
    </>
  );
}
