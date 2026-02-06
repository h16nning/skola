import { useSettings } from "@/logic/settings/hooks/useSettings";
import { Editor } from "@tiptap/react";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import {
  BoldControl,
  ItalicControl,
  UnderlineControl,
  StrikethroughControl,
  HighlightControl,
  CodeControl,
  SubscriptControl,
  SuperscriptControl,
  ClearFormattingControl,
  BulletListControl,
  OrderedListControl,
  LinkControl,
  UnlinkControl,
} from "@/components/ui/RichTextEditorControls";
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
    <div className={classes.controlsWrapper} tabIndex={-1}>
      <RichTextEditor.ControlsGroup>
        <BoldControl editor={editor} />
        <ItalicControl editor={editor} />
        <UnderlineControl editor={editor} />
        {settings.showStrikethroughOptionInEditor && (
          <StrikethroughControl editor={editor} />
        )}
        {settings.showHighlightOptionInEditor && (
          <HighlightControl editor={editor} />
        )}
        {settings.showCodeOptionInEditor && (
          <CodeControl editor={editor} />
        )}
        {settings.showSubAndSuperScriptOptionInEditor && (
          <>
            <SubscriptControl editor={editor} />
            <SuperscriptControl editor={editor} />
          </>
        )}

        <ClearFormattingControl editor={editor} />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        {settings.showListOptionInEditor && (
          <>
            <BulletListControl editor={editor} />
            <OrderedListControl editor={editor} />
          </>
        )}

        <AddImageControl editor={editor} />
      </RichTextEditor.ControlsGroup>

      {settings.showLinkOptionInEditor && (
        <RichTextEditor.ControlsGroup>
          <LinkControl editor={editor} />
          <UnlinkControl editor={editor} />
        </RichTextEditor.ControlsGroup>
      )}
      <RichTextEditor.ControlsGroup>
        {controls}
      </RichTextEditor.ControlsGroup>
    </div>
  );
}
