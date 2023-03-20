import { ColorScheme, MantineTheme, MantineThemeOverride } from "@mantine/core";
import { getButtonStyles } from "./ButtonStyleProvider";
import getRichTextEditorStyles from "./RichTextEditorStyleProvider";
import { getNavBarStyles, getNavLinkStyles } from "./NavStyleProvider";

export function getBaseTheme(
  theme: MantineTheme,
  colorScheme: ColorScheme
): MantineThemeOverride {
  return {
    other: {},
    headings: headingStyle,
    colorScheme: colorScheme,
    fontFamily: "Open Sans, sans-serif",
    colors: {
      forest: [
        "#E1EFE6",
        "#BADBC9",
        "#87C0A4",
        "#75B797",
        "#63AE8A",
        "#52A57E",
        "#439C72",
        "#378C6A",
        "#2E8064",
        "#1E6B5A",
      ],
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
    primaryColor: "forest",
    defaultGradient: {
      deg: 150,
      from: "forest.4",
      to: "forest.8",
    },
    globalStyles: globalStyle,
    components: {
      AppShell: {
        styles: () => ({
          main: {
            paddingLeft: "var(--mantine-navbar-width)",
            [`@media (max-width: 47.9375em)`]: {
              paddingLeft: "0",
            },
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
        styles: () => ({
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
            minWidth: "2.25rem",
            minHeight: "2.25rem",
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
          shadow: "xl",
          size: "500px",
          closeOnClickOutside: false,
          closeOnEscape: true,
          radius: "md",
          centered: true,
          withCloseButton: false,
        },
        styles: (theme) => ({
          title: {
            fontSize: theme.fontSizes.sm,
            fontWeight: 600,
          },
          overlay: {
            background:
              theme.colorScheme === "light"
                ? "linear-gradient(165deg, rgba(173,181,189,0.2) 80%, rgba(117,183,151,0.2) 100%)"
                : "linear-gradient(165deg, rgba(0,0,0,0.3) 80%, rgba(7, 61, 4, 0.2) 100%)",
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
      Navbar: getNavBarStyles(),
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
      Tabs: {
        styles: (theme) => ({
          tab: { padding: "0.25rem 0.75rem" },
        }),
      },
      TabsPanel: {
        defaultProps: {
          pt: "sm",
        },
      },
    },
  };
}

const headingStyle = {
  fontFamily: "Noto Serif Lao",
  fontWeight: 500,
  sizes: {
    h1: { fontSize: "2rem" },
    h2: { fontSize: "1.5rem" },
    h3: { fontSize: "1.25rem" },
    h4: { fontSize: "1.125rem" },
    h5: { fontSize: "1rem" },
    h6: { fontSize: "0.875rem" },
  },
};

function globalStyle() {
  return {
    ".tabler-icon": {
      strokeWidth: "1.5px",
      width: "19px",
    },
    "*": {
      transitionDuration: "0.1s",
      transitionProperty: "background, focus",
    },
    html: { overflow: "hidden" },
  };
}
