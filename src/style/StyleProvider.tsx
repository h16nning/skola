import { ColorScheme, MantineTheme, MantineThemeOverride } from "@mantine/core";
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
      seagull: [
        "#e6f2ff",
        "#CFDCED",
        "#B8C7DB",
        "#A1B2C9",
        "#8A9DB7",
        "#7388A6",
        "#5C7394",
        "#455E82",
        "#2E4970",
        "#17345F",
      ],
    },

    primaryColor: "blue",
    defaultGradient: {
      deg: 150,
      from: theme.colors.blue[5],
      to: theme.colors.blue[9],
    },
    globalStyles: globalStyle,
    components: {
      ActionIcon: {
        defaultProps: {
          size: "lg",
          variant: "default",
        },
        styles: (theme) => ({
          root: {
            color:
              theme.colorScheme === "light"
                ? theme.colors.gray[9]
                : theme.colors.gray[0],
          },
        }),
      },
      Badge: {
        styles: () => ({
          root: {
            textTransform: "none",
          },
        }),
      },
      Text: {
        styles: (theme) => ({
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
        styles: (theme) => ({
          title: {
            fontFamily: theme.headings.fontFamily,
            fontSize: theme.headings.sizes.h3.fontSize,
            fontWeight: "bold",
          },
        }),
      },
      Menu: {
        defaultProps: {
          position: "bottom-end",
        },
        styles: (theme) => ({
          dropdown: {
            boxShadow: theme.shadows.xl,
          },
        }),
      },
      RichTextEditor: {
        styles: (theme) => ({
          root: {
            border: "none",
          },
          toolbar: {
            tabIndex: "-1",
            borderBottom: "none",
            paddingLeft: 0,
            backgroundColor: "transparent",
          },
          content: {
            border: "solid 1px",
            borderColor:
              theme.colorScheme === "light"
                ? theme.colors.gray[4]
                : theme.colors.dark[4],
            backgroundColor: "transparent",
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

function globalStyle() {
  return {
    ".icon-tabler": {
      strokeWidth: "1.5",
      width: "20px",
    },
    "*": {
      transition: "all 0.1s",
    },
  };
}
