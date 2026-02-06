import { useSettings } from "@/logic/settings/hooks/useSettings";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { Link } from "@tiptap/extension-link";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import {
  BubbleMenu,
  Editor,
  EditorOptions,
  Extension,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";

import { ImageDrop } from "./ImageDrop";
import classes from "./NoteEditor.module.css";
import { NoteEditorControls } from "./NoteEditorControls";

import { CustomHardBreak } from "./tiptap/CustomHardBreak";

interface NoteEditorProps {
  editor: Editor | null;
  className?: string;
  controls?: React.ReactNode;
}

export function useNoteEditor(props: {
  content: string;
  onUpdate?: EditorOptions["onUpdate"];
  extensions?: any[];
  finish?: () => void;
  focusSelectNoteType?: () => void;
}) {
  return useEditor(
    {
      extensions: [
        Extension.create({
          name: "addcard",
          addKeyboardShortcuts() {
            return {
              "Mod-Enter": () => {
                props.finish && props.finish();
                return false;
              },
              "Mod-j": () => {
                this.editor.commands.blur();
                props.focusSelectNoteType && props.focusSelectNoteType();
                return false;
              },
            };
          },
        }),
        StarterKit.configure({
          hardBreak: false,
        }),
        CustomHardBreak,
        Underline,
        Link,
        Superscript,
        SubScript,
        Highlight,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Color,
        TextStyle,
        ImageDrop,
        ...(props.extensions ?? []),
      ],
      content: props.content,
      onUpdate: props.onUpdate || (() => {}),
    },
    [props.content]
  );
}

function NoteEditor({ editor, controls, className }: NoteEditorProps) {
  const [settings, areSettingsReady] = useSettings();

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

  return (
    <>
      <div
        className={classes.contentWrapper}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          addImage(e.dataTransfer);
        }}
      >
        <RichTextEditor editor={editor} className={className}>
          {areSettingsReady && settings.useToolbar && editor && (
            <RichTextEditor.Toolbar className={classes.toolbar}>
              <NoteEditorControls controls={controls} editor={editor} />
            </RichTextEditor.Toolbar>
          )}
          {areSettingsReady && editor && settings.useBubbleMenu && (
            <BubbleMenu editor={editor} tippyOptions={{ maxWidth: "none" }}>
              <div className={classes.bubbleMenuWrapper}>
                <NoteEditorControls controls={controls} editor={editor} />
              </div>
            </BubbleMenu>
          )}
        </RichTextEditor>
      </div>
    </>
  );
}

export default NoteEditor;
