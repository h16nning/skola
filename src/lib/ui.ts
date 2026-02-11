import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useScrollResetOnLocationChange() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
}

export function useDynamicPageTheme(theme: "light" | "dark") {
  useEffect(() => {
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        theme === "light" ? "#ffffff" : "#171717"
      );
    }
  }, [theme]);
}

export function useEventListener(
  event: string,
  callback: EventListener,
  dependencies: any[] = []
) {
  useEffect(() => {
    window.addEventListener(event, callback);
    return () => {
      window.removeEventListener(event, callback);
    };
  }, [event, callback, ...dependencies]);
}
