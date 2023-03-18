import { MantineTheme, NavLinkStylesParams } from "@mantine/core";
import { swap, swapMono } from "../logic/ui";

export function getNavLinkStyles() {
  return {
    defaultProps: {
      variant: "light",
      className: "nav-link",
    },
    styles: (theme: MantineTheme, params: NavLinkStylesParams) => ({
      root: {
        borderRadius: theme.radius.sm,
        "&:hover": {
          backgroundColor: swapMono(theme, 6, 0, 0.1),
        },
        "&[data-active]": {
          backgroundColor: "transparent",
        },
        "&[data-active] span": {
          fontWeight: 600,
          color: swap(theme, "primary", 6, 6),
        },
        "&[data-active]:hover": {
          backgroundColor: swap(theme, "primary", 1, 9, 0.25),
        },
        "&:active": {
          transform: "scale(0.98)",
        },
      },
      label: {
        fontSize: theme.fontSizes.sm,
        fontWeight: 300,
        color: swap(theme, "gray", 7, 5),
      },
      icon: {
        color: swap(theme, "gray", 6, 6),
      },
    }),
  };
}

export function getNavBarStyles() {
  return { styles: { root: {} } };
}
