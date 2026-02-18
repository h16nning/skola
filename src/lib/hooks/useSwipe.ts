import { RefObject, useCallback, useRef } from "react";

export interface SwipeState {
  deltaX: number;
  deltaY: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isSwiping: boolean;
  velocity: number;
}

export interface SwipeCallbacks {
  onSwipeStart?: (state: SwipeState) => void;
  onSwipeMove?: (state: SwipeState) => void;
  onSwipeEnd?: (state: SwipeState) => void;
  onSwipeLeft?: (state: SwipeState) => void;
  onSwipeRight?: (state: SwipeState) => void;
}

export interface UseSwipeOptions extends SwipeCallbacks {
  threshold?: number;
  velocityThreshold?: number;
}

export function useSwipe<T extends HTMLElement = HTMLDivElement>(
  options: UseSwipeOptions = {}
): [RefObject<T>, SwipeState] {
  const {
    threshold = 50,
    velocityThreshold = 0.3,
    onSwipeStart,
    onSwipeMove,
    onSwipeEnd,
    onSwipeLeft,
    onSwipeRight,
  } = options;

  const ref = useRef<T>(null);
  const stateRef = useRef<SwipeState>({
    deltaX: 0,
    deltaY: 0,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isSwiping: false,
    velocity: 0,
  });

  const startTimeRef = useRef<number>(0);

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      stateRef.current = {
        deltaX: 0,
        deltaY: 0,
        startX: clientX,
        startY: clientY,
        currentX: clientX,
        currentY: clientY,
        isSwiping: true,
        velocity: 0,
      };
      startTimeRef.current = Date.now();
      onSwipeStart?.(stateRef.current);
    },
    [onSwipeStart]
  );

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!stateRef.current.isSwiping) return;

      const deltaX = clientX - stateRef.current.startX;
      const deltaY = clientY - stateRef.current.startY;
      const timeDelta = Date.now() - startTimeRef.current;
      const velocity = timeDelta > 0 ? Math.abs(deltaX) / timeDelta : 0;

      stateRef.current = {
        ...stateRef.current,
        deltaX,
        deltaY,
        currentX: clientX,
        currentY: clientY,
        velocity,
      };

      onSwipeMove?.(stateRef.current);
    },
    [onSwipeMove]
  );

  const handleEnd = useCallback(() => {
    if (!stateRef.current.isSwiping) return;

    const finalState = { ...stateRef.current, isSwiping: false };
    const { deltaX, velocity } = finalState;

    onSwipeEnd?.(finalState);

    if (Math.abs(deltaX) > threshold || velocity > velocityThreshold) {
      if (deltaX > 0) {
        onSwipeRight?.(finalState);
      } else {
        onSwipeLeft?.(finalState);
      }
    }

    stateRef.current = {
      deltaX: 0,
      deltaY: 0,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      isSwiping: false,
      velocity: 0,
    };
  }, [threshold, velocityThreshold, onSwipeEnd, onSwipeLeft, onSwipeRight]);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    },
    [handleStart]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    },
    [handleMove]
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        handleStart(e.clientX, e.clientY);
      }
    },
    [handleStart]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        handleMove(e.clientX, e.clientY);
      }
    },
    [handleMove]
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        handleEnd();
      }
    },
    [handleEnd]
  );

  const attachListeners = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: true });
    element.addEventListener("touchend", handleEnd);
    element.addEventListener("touchcancel", handleEnd);

    element.addEventListener("pointerdown", handlePointerDown);
    element.addEventListener("pointermove", handlePointerMove);
    element.addEventListener("pointerup", handlePointerUp);
    element.addEventListener("pointercancel", handleEnd);

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleEnd);
      element.removeEventListener("touchcancel", handleEnd);

      element.removeEventListener("pointerdown", handlePointerDown);
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerup", handlePointerUp);
      element.removeEventListener("pointercancel", handleEnd);
    };
  }, [
    handleTouchStart,
    handleTouchMove,
    handleEnd,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  ]);

  const observerRef = useRef<MutationObserver>();

  const observe = useCallback(() => {
    if (!ref.current) return;

    const cleanup = attachListeners();

    observerRef.current = new MutationObserver(() => {
      cleanup?.();
      attachListeners();
    });

    observerRef.current.observe(ref.current, {
      childList: true,
      subtree: true,
    });

    return () => {
      cleanup?.();
      observerRef.current?.disconnect();
    };
  }, [attachListeners]);

  if (ref.current && !observerRef.current) {
    observe();
  }

  return [ref, stateRef.current];
}
