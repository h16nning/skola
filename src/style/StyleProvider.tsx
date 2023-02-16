import {
  ActionIconStylesParams,
  BadgeStylesParams,
  ButtonStylesParams,
  ColorScheme,
  MantineTheme,
  MantineThemeOverride,
  TableStylesParams,
  TextStylesParams,
} from "@mantine/core";
import { getButtonStyles } from "./ButtonStyleProvider";

export function getBaseTheme(
  theme: MantineTheme,
  colorScheme: ColorScheme
): MantineThemeOverride {
  return {
    other: undefined,
    headings: headingStyle,
    colorScheme: colorScheme,
    fontFamily: "Open Sans, sans-serif",
    fontSizes: {
      xs: 9,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 20,
    },
    colors: {
      seaweed: [
        "#dffbff",
        "#bdeaf1",
        "#99dae5",
        "#72ccd9",
        "#4ebdcd",
        "#36a3b4",
        "#267f8d",
        "#175b65",
        "#04373e",
        "#001418",
      ],
      coral: [
        "#ffe6ea",
        "#f7bec4",
        "#eb959d",
        "#e16b77",
        "#d74150",
        "#be2836",
        "#941e2a",
        "#6a141d",
        "#420910",
        "#1d0003",
      ],
      gull: [
        "#e6f2ff",
        "#c5d6ed",
        "#a3bbdc",
        "#80a0cb",
        "#5e84bb",
        "#446ba1",
        "#34537f",
        "#243b5c",
        "#12243a",
        "#010c1a",
      ],
    },

    primaryColor: "blue",
    defaultGradient: {
      deg: 150,
      from: theme.colors.blue[5],
      to: theme.colors.blue[9],
    },
    globalStyles: (theme) => ({
      ".icon-tabler": {
        strokeWidth: "1.2",
        width: "20px",
      },
      "*": {
        transition: "all 0.1s",
      },
    }),
    components: {
      ActionIcon: {
        defaultProps: {
          size: "lg",
          variant: "default",
        },
        styles: (theme, params: ActionIconStylesParams) => ({
          root: {
            color:
              theme.colorScheme === "light"
                ? theme.colors.gray[9]
                : theme.colors.gray[0],
          },
        }),
      },
      Badge: {
        styles: (theme, params: BadgeStylesParams) => ({
          root: {
            textTransform: "none",
          },
        }),
      },
      Text: {
        styles: (theme, params: TextStylesParams) => ({
          root: {
            color:
              theme.colorScheme === "light"
                ? theme.colors.gray[9]
                : theme.colors.gray[0],
          },
        }),
      },
      Button: getButtonStyles(theme),
      Modal: {
        defaultProps: {
          overlayColor: "#00000011",
          shadow: "xl",
          size: "500px",
          closeOnClickOutside: false,
          closeOnEscape: true,
          radius: "md",
        },
        styles: (theme, params: TextStylesParams) => ({
          title: {
            fontFamily: theme.headings.fontFamily,
            fontSize: theme.headings.sizes.h3.fontSize,
            fontWeight: "bold",
          },
        }),
      },
    },
  };
}

const headingStyle = {
  fontFamily: "Playfair Display",
  fontWeight: 600,
  lineHeight: "1.25",
  sizes: {
    h1: { fontSize: 50 },
    h2: { fontSize: 26 },
    h3: { fontSize: 20 },
    h4: { fontSize: 18 },
    h5: { fontSize: 16 },
    h6: { fontSize: 14 },
  },
};

const tableStyle = {};
