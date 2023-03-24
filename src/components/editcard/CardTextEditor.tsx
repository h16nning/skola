import React from "react";
import { Editor, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Image from "@tiptap/extension-image";

import {
  Link,
  RichTextEditor,
  RichTextEditorStylesNames,
} from "@mantine/tiptap";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { Box, createStyles, Styles } from "@mantine/core";
import { useSettings } from "../../logic/Settings";
import EditorOptionsMenu from "./EditorOptionsMenu";
import AddImageControl from "./AddImageControl";

interface CardTextEditorProps {
  editor: Editor | null;
  styles?: Styles<RichTextEditorStylesNames, Record<string, any>>;
}

const useStyles = createStyles(() => ({
  content: {
    "& .ProseMirror": {
      maxHeight: "400px",
      overflow: "scroll",
    },
  },
}));
export function useCardEditor(content: string) {
  return useEditor(
    {
      extensions: [
        StarterKit,
        Underline,
        Link,
        Superscript,
        SubScript,
        Highlight,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Color,
        TextStyle,
        Image.configure({
          allowBase64: true,
        }),
      ],
      content: content,
    },
    [content]
  );
}

function CardTextEditor({ editor, styles }: CardTextEditorProps) {
  const [settings, areSettingsReady] = useSettings();

  const { classes } = useStyles();
  return (
    <RichTextEditor editor={editor} withTypographyStyles={true} styles={styles}>
      <RichTextEditor.Toolbar
        sx={() => ({
          visibility: areSettingsReady ? "visible" : "hidden",
        })}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold tabIndex={-1} />
            <RichTextEditor.Italic tabIndex={-1} />
            <RichTextEditor.Underline tabIndex={-1} />
            {settings.showStrikethroughOptionInEditor && (
              <RichTextEditor.Strikethrough tabIndex={-1} />
            )}
            {settings.showHighlightOptionInEditor && (
              <RichTextEditor.Highlight tabIndex={-1} />
            )}
            {settings.showCodeOptionInEditor && (
              <RichTextEditor.Code tabIndex={-1} />
            )}
            {settings.showSubAndSuperScriptOptionInEditor && (
              <>
                <RichTextEditor.Subscript tabIndex={-1} />
                <RichTextEditor.Superscript tabIndex={-1} />
              </>
            )}

            <RichTextEditor.ClearFormatting tabIndex={-1} />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            {settings.showListOptionInEditor && (
              <>
                <RichTextEditor.BulletList tabIndex={-1} />
                <RichTextEditor.OrderedList tabIndex={-1} />
              </>
            )}

            <AddImageControl editor={editor} />
          </RichTextEditor.ControlsGroup>

          {settings.showLinkOptionInEditor && (
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link tabIndex={-1} />
              <RichTextEditor.Unlink tabIndex={-1} />
            </RichTextEditor.ControlsGroup>
          )}
        </Box>

        <EditorOptionsMenu />
      </RichTextEditor.Toolbar>
      <RichTextEditor.Content className={classes.content} />
    </RichTextEditor>
  );
}

export default CardTextEditor;
