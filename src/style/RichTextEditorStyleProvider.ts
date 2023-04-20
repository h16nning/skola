import { MantineTheme } from "@mantine/core";
import { swap, swapMono } from "../logic/ui";
import { CSSObject } from "@mantine/styles/lib/tss";
import { ContextStylesParams } from "@mantine/styles/lib/theme/types/MantineTheme";

export default function getRichTextEditorStyles(): {
  defaultProps: Object;
  styles: (
    theme: MantineTheme,
    params: any,
    context: ContextStylesParams
  ) => Record<string, CSSObject>;
} {
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
        overflowX: "scroll",
        overflowY: "visible",
        //hiding scrollbars on ios
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        flexWrap: "nowrap" as "nowrap",
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
