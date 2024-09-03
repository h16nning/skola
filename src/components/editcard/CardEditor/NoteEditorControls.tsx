import { Box } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { Editor } from "@tiptap/react";
import { useSettings } from "../../../logic/Settings";
import AddImageControl from "../AddImageControl";
import classes from "./NoteEditor.module.css";

export interface NoteEditorControlsProps {
  editor: Editor | null;
  controls?: React.ReactNode;
}

export function NoteEditorControls({
  editor,
  controls,
}: NoteEditorControlsProps) {
  const [settings] = useSettings();
  return (
    <Box className={classes.controlsWrapper} tabIndex={-1}>
      <RichTextEditor.ControlsGroup tabIndex={-1}>
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

      <RichTextEditor.ControlsGroup tabIndex={-1}>
        {settings.showListOptionInEditor && (
          <>
            <RichTextEditor.BulletList tabIndex={-1} />
            <RichTextEditor.OrderedList tabIndex={-1} />
          </>
        )}

        <AddImageControl editor={editor} />
      </RichTextEditor.ControlsGroup>

      {settings.showLinkOptionInEditor && (
        <RichTextEditor.ControlsGroup tabIndex={-1}>
          <RichTextEditor.Link tabIndex={-1} />
          <RichTextEditor.Unlink tabIndex={-1} />
        </RichTextEditor.ControlsGroup>
      )}
      <RichTextEditor.ControlsGroup tabIndex={-1}>
        {controls}
      </RichTextEditor.ControlsGroup>
    </Box>
  );
}
