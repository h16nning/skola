import { ButtonStylesParams, MantineTheme } from "@mantine/core";

export function getButtonStyles(theme: MantineTheme) {
  return {
    styles: getStyles,
  };
}

function getStyles(theme: MantineTheme, params: ButtonStylesParams) {
  if (params.variant === "filled") {
    return getFilledButtonStyles(theme, params);
  } else if (params.variant === "default") {
    return getDefaultButtonStyles(theme, params);
  }

  return {
    root: {
      /*backgroundColor: "transparent",
      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors[params.color || theme.primaryColor][7]
            : undefined,
      },*/
      "&:active": { transform: "scale(0.96)" },
    },
  };
}

function getFilledButtonStyles(
  theme: MantineTheme,
  params: ButtonStylesParams
) {
  return {
    root: {
      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors[params.color || theme.primaryColor][7]
            : undefined,
      },
      "&:active": { transform: "scale(0.96)" },
    },
  };
}

function getDefaultButtonStyles(
  theme: MantineTheme,
  params: ButtonStylesParams
) {
  return {
    root: {
      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[5] : undefined,
      },
      "&:active": { transform: "scale(0.96)" },
    },
  };
}
