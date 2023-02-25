import React, { useRef } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Image from "@tiptap/extension-image";

import { Link, RichTextEditor } from "@mantine/tiptap";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { IconFile } from "@tabler/icons";
import { FileButton } from "@mantine/core";

interface CardTextEditorProps {}

function CardTextEditor({}: CardTextEditorProps) {
  const editor = useEditor({
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
  });
  const ref = useRef();
  return (
    <div>
      <RichTextEditor editor={editor} itemRef="ref">
        <RichTextEditor.Toolbar
          sx={() => ({ display: !editor?.isFocused ? "none" : "flex" })}
        >
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold tabIndex={-1} />
            <RichTextEditor.Italic tabIndex={-1} />
            <RichTextEditor.Underline tabIndex={-1} />
            <RichTextEditor.Strikethrough tabIndex={-1} />
            <RichTextEditor.ClearFormatting tabIndex={-1} />
            <RichTextEditor.Highlight tabIndex={-1} />
            <RichTextEditor.Code tabIndex={-1} />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 tabIndex={-1} />
            <RichTextEditor.H2 tabIndex={-1} />
            <RichTextEditor.H3 tabIndex={-1} />
            <RichTextEditor.H4 tabIndex={-1} />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote tabIndex={-1} />
            <RichTextEditor.Hr tabIndex={-1} />
            <RichTextEditor.BulletList tabIndex={-1} />
            <RichTextEditor.OrderedList tabIndex={-1} />
            <RichTextEditor.Subscript tabIndex={-1} />
            <RichTextEditor.Superscript tabIndex={-1} />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link tabIndex={-1} />
            <RichTextEditor.Unlink tabIndex={-1} />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft tabIndex={-1} />
            <RichTextEditor.AlignCenter tabIndex={-1} />
            <RichTextEditor.AlignJustify tabIndex={-1} />
            <RichTextEditor.AlignRight tabIndex={-1} />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ColorPicker
            tabIndex={-1}
            colors={[
              "#25262b",
              "#868e96",
              "#fa5252",
              "#e64980",
              "#be4bdb",
              "#7950f2",
              "#4c6ef5",
              "#228be6",
              "#15aabf",
              "#12b886",
              "#40c057",
              "#82c91e",
              "#fab005",
              "#fd7e14",
            ]}
          />
          <FileButton
            onChange={(file) => {
              const fileReader = new FileReader();
              let data: string | ArrayBuffer | null;
              if (file) {
                fileReader.readAsDataURL(file);
              }
              fileReader.onloadend = () => {
                data = fileReader.result;
                editor?.commands.insertContent(`<img src="` + data + `"/>`);
                editor?.commands.focus();
              };
            }}
            accept={"image/jpeg, image/jpg, image/png, image/heic"}
          >
            {(props) => (
              <RichTextEditor.Control {...props} tabIndex={-1}>
                <IconFile />
              </RichTextEditor.Control>
            )}
          </FileButton>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
    </div>
  );
}

export default CardTextEditor;
