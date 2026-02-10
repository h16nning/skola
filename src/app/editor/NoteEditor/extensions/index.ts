import { Extension, Extensions } from "@tiptap/core";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { ImageDrop } from "../ImageDrop";
import { UseNoteEditorProps } from "../NoteEditor";
import { CustomHardBreak } from "../tiptap/CustomHardBreak";

export default function getExtensions(props: UseNoteEditorProps): Extensions {
  return [
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
    Subscript,
    Highlight,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Color,
    TextStyle,
    ImageDrop,
    ...(props.extensions ?? []),
  ];
}
