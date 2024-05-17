import { Link, RichTextEditor } from "@mantine/tiptap";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
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
import { useSettings } from "../../../logic/Settings";
import classes from "./CardEditor.module.css";
import { NoteEditorControls } from "./CardEditorControls";
import { ImageDrop } from "./ImageDrop";
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
        Image.configure({
          allowBase64: true,
        }),
        ImageDrop,
        ...(props.extensions ?? []),
      ],
      content: props.content,
      onUpdate: props.onUpdate || (() => {}), // tiptap default
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
    <RichTextEditor
      editor={editor}
      withTypographyStyles={false}
      className={className}
      classNames={{
        root: classes.root,
        toolbar: classes.toolbar,
        content: classes.content,
      }}
    >
      {areSettingsReady && (
        <>
          {editor && settings.useToolbar && (
            <div tabIndex={-1}>
              <RichTextEditor.Toolbar className={classes.toolbar}>
                <NoteEditorControls controls={controls} editor={editor} />
              </RichTextEditor.Toolbar>
            </div>
          )}
          {editor && settings.useBubbleMenu && (
            <BubbleMenu editor={editor} tippyOptions={{ maxWidth: "none" }}>
              <NoteEditorControls controls={controls} editor={editor} />
            </BubbleMenu>
          )}
        </>
      )}

      <RichTextEditor.Content
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          addImage(e.dataTransfer);
        }}
      />
    </RichTextEditor>
  );
}

export default NoteEditor;
