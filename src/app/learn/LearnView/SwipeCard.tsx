import { ReactNode, useEffect, useRef, useState } from "react";

interface SwipeCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeProgress?: (
    progress: number,
    direction: "left" | "right" | null
  ) => void;
  className?: string;
  disabled?: boolean;
}

interface SwipeState {
  isDragging: boolean;
  startX: number;
  currentX: number;
  offsetX: number;
  startTime: number;
}

const SWIPE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 0.5;
const MAX_ROTATION = 15;

function SwipeCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeProgress,
  className = "",
  disabled = false,
}: SwipeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isDragging: false,
    startX: 0,
    currentX: 0,
    offsetX: 0,
    startTime: 0,
  });

  const [isAnimating, setIsAnimating] = useState(false);

  const calculateProgress = (offset: number): number => {
    const progress = Math.abs(offset) / 300;
    return Math.min(progress, 1);
  };

  const calculateRotation = (offset: number): number => {
    const rotation = (offset / 300) * MAX_ROTATION;
    return Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, rotation));
  };

  const applyTransform = (offset: number, immediate = false) => {
    if (!cardRef.current) return;

    const progress = calculateProgress(offset);
    const rotation = calculateRotation(offset);
    const scale = 1 - progress * 0.05;
    const blur = progress * 3;
    const opacity = 1 - progress * 0.3;

    cardRef.current.style.transform = `translateX(${offset}px) rotate(${rotation}deg) scale(${scale})`;
    cardRef.current.style.filter = `blur(${blur}px)`;
    cardRef.current.style.opacity = `${opacity}`;
    cardRef.current.style.transition = immediate
      ? "none"
      : "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease, opacity 0.3s ease";
  };

  const resetCard = () => {
    if (!cardRef.current) return;
    applyTransform(0);
    onSwipeProgress?.(0, null);
    setTimeout(() => {
      setSwipeState({
        isDragging: false,
        startX: 0,
        currentX: 0,
        offsetX: 0,
        startTime: 0,
      });
    }, 300);
  };

  const animateSwipeOut = (
    direction: "left" | "right",
    callback?: () => void
  ) => {
    if (!cardRef.current) return;

    setIsAnimating(true);
    const targetX =
      direction === "left" ? -window.innerWidth : window.innerWidth;

    cardRef.current.style.transition =
      "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.4s ease, opacity 0.4s ease";
    applyTransform(targetX);

    setTimeout(() => {
      callback?.();
      onSwipeProgress?.(0, null);
      setIsAnimating(false);
      if (cardRef.current) {
        cardRef.current.style.transition = "none";
        applyTransform(0, true);
      }
    }, 400);
  };

  const handleStart = (clientX: number) => {
    if (disabled || isAnimating) return;

    setSwipeState({
      isDragging: true,
      startX: clientX,
      currentX: clientX,
      offsetX: 0,
      startTime: Date.now(),
    });
  };

  const handleMove = (clientX: number) => {
    if (!swipeState.isDragging || disabled || isAnimating) return;

    const offsetX = clientX - swipeState.startX;
    setSwipeState((prev) => ({
      ...prev,
      currentX: clientX,
      offsetX,
    }));

    applyTransform(offsetX, true);

    const progress = calculateProgress(offsetX);
    const direction = offsetX > 0 ? "right" : offsetX < 0 ? "left" : null;
    onSwipeProgress?.(progress, direction);
  };

  const handleEnd = () => {
    if (!swipeState.isDragging || disabled || isAnimating) return;

    const { offsetX, startTime } = swipeState;
    const duration = Date.now() - startTime;
    const velocity = Math.abs(offsetX) / duration;

    const shouldSwipe =
      Math.abs(offsetX) > SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD;

    if (shouldSwipe) {
      if (offsetX > 0) {
        animateSwipeOut("right", onSwipeRight);
      } else {
        animateSwipeOut("left", onSwipeLeft);
      }
    } else {
      resetCard();
    }
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      handleStart(touch.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      handleMove(touch.clientX);
    };

    const handleTouchEnd = () => {
      handleEnd();
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        handleStart(e.clientX);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        handleMove(e.clientX);
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        handleEnd();
      }
    };

    card.addEventListener("touchstart", handleTouchStart, { passive: true });
    card.addEventListener("touchmove", handleTouchMove, { passive: true });
    card.addEventListener("touchend", handleTouchEnd);
    card.addEventListener("touchcancel", handleTouchEnd);

    card.addEventListener("pointerdown", handlePointerDown);
    card.addEventListener("pointermove", handlePointerMove);
    card.addEventListener("pointerup", handlePointerUp);
    card.addEventListener("pointercancel", handlePointerUp);

    return () => {
      card.removeEventListener("touchstart", handleTouchStart);
      card.removeEventListener("touchmove", handleTouchMove);
      card.removeEventListener("touchend", handleTouchEnd);
      card.removeEventListener("touchcancel", handleTouchEnd);

      card.removeEventListener("pointerdown", handlePointerDown);
      card.removeEventListener("pointermove", handlePointerMove);
      card.removeEventListener("pointerup", handlePointerUp);
      card.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [swipeState.isDragging, disabled, isAnimating]);

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        touchAction: "pan-y",
        userSelect: "none",
        cursor: disabled ? "default" : "grab",
      }}
    >
      {children}
    </div>
  );
}

export default SwipeCard;
