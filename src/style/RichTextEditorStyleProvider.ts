import { MantineTheme } from "@mantine/core";
import { swap, swapMono } from "../logic/ui";

export default function getRichTextEditorStyles() {
  return {
    defaultProps: {
      labels: "hello",
    },
    styles: (theme: MantineTheme) => ({
      root: {
        border: "none",
      },
      toolbar: {
        tabindex: "-1",
        borderBottom: "none",
        paddingLeft: 0,
        paddingRight: 0,
        backgroundColor: "transparent",
        justifyContent: "space-between",
      },
      content: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        ".ProseMirror": {
          borderRadius: theme.radius.sm,
          border: "solid 1px",
          borderColor: swapMono(theme, 4, 4),
        },
        ".ProseMirror-focused": {
          borderColor: swap(theme, "primary", 6, 8),
        },
      },
      control: {
        border: "none !important",
        backgroundColor: "transparent",
        borderRadius: theme.radius.sm,
      },
    }),
  };
}
