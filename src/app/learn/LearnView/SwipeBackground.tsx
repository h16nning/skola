import { ReactNode } from "react";
import "./SwipeBackground.css";

interface SwipeBackgroundProps {
  swipeProgress: number;
  direction: "left" | "right" | null;
  children: ReactNode;
}

const BASE = "swipe-background";

function SwipeBackground({
  swipeProgress,
  direction,
  children,
}: SwipeBackgroundProps) {
  const leftOpacity =
    direction === "right" ? Math.min(swipeProgress * 2, 1) : 0;
  const rightOpacity =
    direction === "left" ? Math.min(swipeProgress * 2, 1) : 0;

  const getIntensity = (progress: number): number => {
    return Math.floor(progress * 9);
  };

  const leftIntensity = getIntensity(leftOpacity);
  const rightIntensity = getIntensity(rightOpacity);

  return (
    <div className={BASE}>
      <div
        className={`${BASE}__half ${BASE}__half--left`}
        style={{
          opacity: leftOpacity,
          backgroundColor: `var(--theme-lime-${100 + leftIntensity * 100})`,
        }}
      />
      <div
        className={`${BASE}__half ${BASE}__half--right`}
        style={{
          opacity: rightOpacity,
          backgroundColor: `var(--theme-red-${100 + rightIntensity * 100})`,
        }}
      />
      <div className={`${BASE}__content`}>{children}</div>
    </div>
  );
}

export default SwipeBackground;
