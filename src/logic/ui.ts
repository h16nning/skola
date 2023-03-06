import { MantineColor, MantineTheme } from "@mantine/core";

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
