import { MantineTheme, NavLinkStylesParams } from "@mantine/core";

export function getNavLinkStyles() {
  return {
    defaultProps: {
      variant: "filled",
    },
    styles: (theme: MantineTheme, params: NavLinkStylesParams) => ({
      root: {
        borderRadius: theme.radius.sm,
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "light"
              ? theme.colors.gray[1]
              : theme.colors.dark[5],
        },
        "&[data-active]:hover": {
          backgroundColor:
            theme.colorScheme === "light"
              ? theme.colors.seaweed[6]
              : theme.colors.seaweed[8],
        },
        "&:active": {
          transform: "scale(0.98)",
        },
      },
      label: {
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,
      },
    }),
  };
}

export function getNavBarStyles() {}
