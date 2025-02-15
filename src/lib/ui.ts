import { MantineTheme } from "@mantine/core";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useScrollResetOnLocationChange() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
}

export function useDynamicPageTheme(
  theme: MantineTheme,
  colorScheme: "light" | "dark"
) {
  useEffect(() => {
    if (document && document.querySelector("meta[name='theme-color']")) {
      // @ts-ignore
      document.querySelector("meta[name='theme-color']").setAttribute(
        "content",

        colorScheme === "light" ? "#fff" : theme.colors.dark[7]
      );
    }
  }, [theme, colorScheme]);
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
  }, [event, ...dependencies]);
}
