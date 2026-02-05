import { useCallback, useEffect, useState } from "react";

interface ScrollPosition {
  x: number;
  y: number;
}

type ScrollToOptions = {
  x?: number;
  y?: number;
};

export function useWindowScroll(): [ScrollPosition, (options: ScrollToOptions) => void] {
  const [position, setPosition] = useState<ScrollPosition>(() => ({
    x: typeof window !== "undefined" ? window.scrollX : 0,
    y: typeof window !== "undefined" ? window.scrollY : 0,
  }));

  useEffect(() => {
    const handleScroll = () => {
      setPosition({ x: window.scrollX, y: window.scrollY });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = useCallback((options: ScrollToOptions) => {
    window.scrollTo({
      left: options.x,
      top: options.y,
      behavior: "smooth",
    });
  }, []);

  return [position, scrollTo];
}
