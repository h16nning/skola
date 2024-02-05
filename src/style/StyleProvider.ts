import {
  ActionIcon,
  AppShell,
  Badge,
  Breadcrumbs,
  Button,
  Menu,
  Modal,
  NavLink,
  Popover,
  Select,
  Text,
  Tabs,
  createTheme,
  CSSVariablesResolver,
} from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import actionIcon from "./ActionIcon.module.css";
import appShell from "./AppShell.module.css";
import badge from "./Badge.module.css";
import breadcrumbs from "./Breadcrumbs.module.css";
import button from "./Button.module.css";
import input from "./Input.module.css";
import modal from "./Modal.module.css";
import menu from "./Menu.module.css";
import navbar from "./Navbar.module.css";
import navLink from "./NavLink.module.css";
import popover from "./Popover.module.css";
import richTextEditor from "./RichTextEditor.module.css";
import select from "./Select.module.css";
import tabs from "./Tabs.module.css";

const headingStyle = {
  fontFamily: "Noto Serif Lao",
  fontWeight: "500",
  sizes: {
    h1: { fontSize: "2rem" },
    h2: { fontSize: "1.5rem" },
    h3: { fontSize: "1.25rem" },
    h4: { fontSize: "1.125rem" },
    h5: { fontSize: "1rem" },
    h6: { fontSize: "0.875rem" },
  },
};

export const presetTheme = createTheme({
  other: {},
  headings: headingStyle,
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
    deg: 45,
    from: "forest.5",
    to: "forest.7",
  },
  components: {
    AppShell: AppShell.extend({
      classNames: appShell,
    }),
    Badge: Badge.extend({
      classNames: badge,
    }),
    Text: Text.extend({
      styles: () => ({
        root: { userSelect: "none" },
      }),
    }),
    Button: Button.extend({
      classNames: button,
    }),
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        size: "lg",
        variant: "default",
      },
      classNames: actionIcon,
    }),
    Modal: Modal.extend({
      defaultProps: {
        shadow: "xl",
        size: "500px",
        radius: "md",
        centered: true,
        closeOnClickOutside: false,
        closeOnEscape: true,
        withCloseButton: true,
        closeButtonProps: {
          size: "sm",
        },
      },
      classNames: modal,
    }),
    Menu: Menu.extend({
      classNames: menu,
    }),
    Breadcrumbs: Breadcrumbs.extend({
      classNames: breadcrumbs,
    }),
    Navbar: AppShell.Navbar.extend({ classNames: navbar }),
    NavLink: NavLink.extend({
      defaultProps: { variant: "light" },
      classNames: navLink,
    }),
    Popover: Popover.extend({
      classNames: popover,
    }),
    Select: Select.extend({
      classNames: select,
    }),
    Tabs: Tabs.extend({
      classNames: tabs,
    }),
    TabsPanel: Tabs.Panel.extend({
      defaultProps: {
        pt: "sm",
      },
    }),
    Tooltip: {
      styles: () => ({
        tooltip: {
          userSelect: "none",
        },
      }),
    },
    InputWrapper: {
      styles: () => ({
        label: {
          userSelect: "none",
        },
      }),
    },
    Input: {
      styles: () => ({
        icon: {
          "& svg": {
            strokeWidth: "1.5px",
            width: "1.2rem",
          },
        },
      }),
    },
  },
});

export const cssVariablesResolver: CSSVariablesResolver = (theme) => {
  return {
    variables: {},
    light: {
      "--mantine-color-red-strong": theme.colors.red[7],
      "--mantine-color-pink-strong": theme.colors.pink[7],
      "--mantine-color-grape-strong": theme.colors.grape[7],
      "--mantine-color-violet-strong": theme.colors.violet[7],
      "--mantine-color-indigo-strong": theme.colors.indigo[7],
      "--mantine-color-blue-strong": theme.colors.blue[7],
      "--mantine-color-cyan-strong": theme.colors.cyan[7],
      "--mantine-color-teal-strong": theme.colors.teal[7],
      "--mantine-color-green-strong": theme.colors.green[7],
      "--mantine-color-lime-strong": theme.colors.lime[7],
      "--mantine-color-yellow-strong": theme.colors.yellow[7],
      "--mantine-color-orange-strong": theme.colors.orange[7],
    },

    dark: {
      "--mantine-color-red-strong": theme.colors.red[3],
      "--mantine-color-pink-strong": theme.colors.pink[3],
      "--mantine-color-grape-strong": theme.colors.grape[3],
      "--mantine-color-violet-strong": theme.colors.violet[3],
      "--mantine-color-indigo-strong": theme.colors.indigo[3],
      "--mantine-color-blue-strong": theme.colors.blue[3],
      "--mantine-color-cyan-strong": theme.colors.cyan[3],
      "--mantine-color-teal-strong": theme.colors.teal[3],
      "--mantine-color-green-strong": theme.colors.green[3],
      "--mantine-color-lime-strong": theme.colors.lime[3],
      "--mantine-color-yellow-strong": theme.colors.yellow[3],
      "--mantine-color-orange-strong": theme.colors.orange[3],
    },
  };
};
