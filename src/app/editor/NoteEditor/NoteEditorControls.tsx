import { RichTextEditor } from "@/components/ui/RichTextEditor";
import {
  BoldControl,
  BulletListControl,
  ClearFormattingControl,
  CodeControl,
  HighlightControl,
  ItalicControl,
  LinkControl,
  OrderedListControl,
  StrikethroughControl,
  SubscriptControl,
  SuperscriptControl,
  UnderlineControl,
  UnlinkControl,
} from "@/components/ui/RichTextEditorControls";
import { useSettings } from "@/logic/settings/hooks/useSettings";
import { Editor } from "@tiptap/react";
import AddImageControl from "../AddImageControl";
import "./NoteEditorControls.css";

const BASE = "note-editor-controls";

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
    <div className={`${BASE}__wrapper`} tabIndex={-1}>
      <RichTextEditor.ControlsGroup>
        <BoldControl editor={editor} />
        <ItalicControl editor={editor} />
        <UnderlineControl editor={editor} />
        {settings["#showStrikethroughOptionInEditor"] && (
          <StrikethroughControl editor={editor} />
        )}
        {settings["#showHighlightOptionInEditor"] && (
          <HighlightControl editor={editor} />
        )}
        {settings["#showCodeOptionInEditor"] && <CodeControl editor={editor} />}
        {settings["#showSubAndSuperScriptOptionInEditor"] && (
          <>
            <SubscriptControl editor={editor} />
            <SuperscriptControl editor={editor} />
          </>
        )}

        <ClearFormattingControl editor={editor} />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        {settings["#showListOptionInEditor"] && (
          <>
            <BulletListControl editor={editor} />
            <OrderedListControl editor={editor} />
          </>
        )}

        <AddImageControl editor={editor} />
      </RichTextEditor.ControlsGroup>

      {settings["#showLinkOptionInEditor"] && (
        <RichTextEditor.ControlsGroup>
          <LinkControl editor={editor} />
          <UnlinkControl editor={editor} />
        </RichTextEditor.ControlsGroup>
      )}
      <RichTextEditor.ControlsGroup>{controls}</RichTextEditor.ControlsGroup>
    </div>
  );
}
