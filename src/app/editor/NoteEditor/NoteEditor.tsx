import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { useSettings } from "@/logic/settings/hooks/useSettings";
import { BubbleMenu, Editor, EditorOptions, useEditor } from "@tiptap/react";
import React from "react";

import "./NoteEditor.css";
import { NoteEditorControls } from "./NoteEditorControls";
import getExtensions from "./extensions";

const BASE = "note-editor";

interface NoteEditorProps {
  editor: Editor | null;
  className?: string;
  controls?: React.ReactNode;
  Footer?: React.ReactNode;
}

export interface UseNoteEditorProps {
  content: string;
  onUpdate?: EditorOptions["onUpdate"];
  extensions?: any[];
  finish?: () => void;
  focusSelectNoteType?: () => void;
}

export function useNoteEditor(props: UseNoteEditorProps) {
  return useEditor(
    {
      extensions: getExtensions(props),
      content: props.content,
      onUpdate: props.onUpdate || (() => {}),
    },
    [props.content]
  );
}

function NoteEditor({ editor, controls, className, Footer }: NoteEditorProps) {
  const [settings, settingsAreReady] = useSettings();

  const addImage = (data: DataTransfer) => {
    const { files } = data;
    if (editor && files && files.length > 0) {
      for (const file of Array.from(files)) {
        const [mime] = file.type.split("/");
        if (mime === "image") {
          const url = URL.createObjectURL(file);
          editor.commands.insertImage({ src: url });
        }
      }
    }
  };

  if (!settingsAreReady) {
    return null;
  }

  return (
    <>
      <div
        className={`${BASE}__content-wrapper`}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          addImage(e.dataTransfer);
        }}
      >
        <RichTextEditor editor={editor} className={className}>
          {settings["#useToolbar"] && editor && (
            <RichTextEditor.Toolbar className={`${BASE}__toolbar`}>
              <NoteEditorControls controls={controls} editor={editor} />
            </RichTextEditor.Toolbar>
          )}
          {editor && settings["#useBubbleMenu"] && (
            <BubbleMenu editor={editor} tippyOptions={{ maxWidth: "none" }}>
              <div className={`${BASE}__bubble-menu-wrapper`}>
                <NoteEditorControls controls={controls} editor={editor} />
              </div>
            </BubbleMenu>
          )}
        </RichTextEditor>
        {Footer}
      </div>
    </>
  );
}

export default NoteEditor;
