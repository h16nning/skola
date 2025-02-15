import { FileButton } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { IconPhoto } from "@tabler/icons-react";
import { Editor } from "@tiptap/react";
import React from "react";

interface AddImageControlProps {
  editor: Editor | null;
}

export default function AddImageControl({ editor }: AddImageControlProps) {
  return (
    <FileButton
      onChange={(file) => {
        const fileReader = new FileReader();
        let data: string | ArrayBuffer | null;
        if (file) {
          fileReader.readAsDataURL(file);
        }
        fileReader.onloadend = () => {
          data = fileReader.result;
          editor?.commands.insertContent(
            `<img src="` + data + `" alt="Image inserted by user"/>`
          );
          editor?.commands.focus();
        };
      }}
      accept={"image/jpeg, image/jpg, image/png, image/heic"}
    >
      {(props) => (
        <RichTextEditor.Control {...props} tabIndex={-1}>
          <IconPhoto />
        </RichTextEditor.Control>
      )}
    </FileButton>
  );
}
