import { MantineTheme } from "@mantine/core";

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
        backgroundColor: "transparent",
      },
      content: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        ".ProseMirror": {
          borderRadius: theme.radius.sm,
          border: "solid 1px",
          borderColor:
            theme.colorScheme === "light"
              ? theme.colors.gray[4]
              : theme.colors.dark[4],
        },
        ".ProseMirror-focused": {
          borderColor:
            theme.colorScheme === "light"
              ? theme.colors.seaweed[6]
              : theme.colors.seaweed[8],
        },
      },
      control: {},
    }),
  };
}
