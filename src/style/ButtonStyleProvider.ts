import {
  ButtonProps,
  ButtonStylesParams,
  MantineColor,
  MantineTheme,
} from "@mantine/core";

export function getButtonStyles(theme: MantineTheme) {
  return {
    styles: getStyles,
  };
}

function getStyles(theme: MantineTheme, { variant, color }: ButtonProps) {
  if (variant === "filled") {
    return getFilledButtonStyles(theme, color);
  } else if (variant === "default") {
    return getDefaultButtonStyles(theme);
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
  color: MantineColor | undefined
) {
  return {
    root: {
      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors[color || theme.primaryColor][7]
            : undefined,
      },
      "&:active": { transform: "scale(0.96)" },
    },
  };
}

function getDefaultButtonStyles(theme: MantineTheme) {
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
