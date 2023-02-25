import { ColorScheme, MantineTheme, MantineThemeOverride } from "@mantine/core";
import { getButtonStyles } from "./ButtonStyleProvider";
import getRichTextEditorStyles from "./RichTextEditorStyleProvider";
import { getNavLinkStyles } from "./NavStyleProvider";

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
        "#e5f9fd",
        "#c4edf3",
        "#99dae5",
        "#7bd3e0",
        "#50bece",
        "#36a3b4",
        "#288391",
        "#227885",
        "#1d6873",
        "#12545d",
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
    primaryColor: "seaweed",
    defaultGradient: {
      deg: 150,
      from: "seaweed.5",
      to: "seaweed.9",
    },
    globalStyles: globalStyle,
    components: {
      Badge: {
        styles: () => ({
          root: {
            textTransform: "none",
          },
        }),
      },
      Text: {
        styles: (theme) => ({
          root: {},
        }),
      },
      Button: getButtonStyles(theme),
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
            "&:active": { transform: "scale(0.95)" },
          },
        }),
      },
      Modal: {
        defaultProps: {
          overlayColor: "#00000011",
          shadow: "xl",
          size: "500px",
          closeOnClickOutside: false,
          closeOnEscape: true,
          withCloseButton: false,
          radius: "md",
        },
        styles: (theme) => ({
          title: {
            fontSize: theme.headings.sizes.h4.fontSize,
            fontWeight: "bolder",
          },
        }),
      },
      Menu: {
        defaultProps: {
          position: "bottom-end",
        },
        styles: (theme) => ({
          dropdown: {
            boxShadow: theme.shadows.md,
          },
          item: {
            fontWeight: 500,
          },
        }),
      },
      Breadcrumbs: {
        styles: (theme) => ({
          breadcrumb: {
            fontSize: theme.fontSizes.sm,
            color:
              theme.colorScheme === "light"
                ? theme.colors.gray[6]
                : theme.colors.dark[2],
          },
        }),
      },
      RichTextEditor: getRichTextEditorStyles(),
      NavLink: getNavLinkStyles(),
      Popover: {
        styles: (theme) => ({
          dropdown: {
            boxShadow: theme.shadows.sm,
          },
        }),
      },
      Select: {
        defaultProps: {
          transition: "fade",
          transitionDuration: 150,
        },
        styles: (theme) => ({
          dropdown: {
            boxShadow: theme.shadows.md,
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
      transitionDuration: "0.1s",
      transitionProperty: "background, focus",
    },
  };
}
