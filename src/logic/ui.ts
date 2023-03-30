import { MantineColor, MantineTheme } from "@mantine/core";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function swap(
  theme: MantineTheme,
  color: MantineColor,
  light: number,
  dark: number,
  opacity?: number
) {
  const c =
    theme.colorScheme === "light"
      ? (theme.colors[color === "primary" ? "forest" : color] ??
          theme.colors.pink)[light]
      : (theme.colors[color === "primary" ? "forest" : color] ??
          theme.colors.pink)[dark];
  return opacity ? theme.fn.rgba(c, opacity) : c;
}

export function swapMono(
  theme: MantineTheme,
  light: number,
  dark?: number,
  opacity?: number
) {
  const c =
    theme.colorScheme === "light"
      ? theme.colors.gray[light]
      : theme.colors.dark[dark ?? light];
  return opacity ? theme.fn.rgba(c, opacity) : c;
}

export function swapLight(theme: MantineTheme) {
  return swap(theme, "gray", 5, 7);
}

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
    console.log(colorScheme);
    if (document && document.querySelector("meta[name='theme-color']")) {
      // @ts-ignore
      document.querySelector("meta[name='theme-color']").setAttribute(
        "content",

        colorScheme === "light" ? "#fff" : theme.colors.dark[7]
      );
    }
  }, [theme, colorScheme]);
}
