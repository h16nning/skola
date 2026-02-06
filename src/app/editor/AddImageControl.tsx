import { RichTextEditorControl } from "@/components/ui/RichTextEditor";
import { IconPhoto } from "@tabler/icons-react";
import { Editor } from "@tiptap/react";
import { useRef } from "react";

interface AddImageControlProps {
  editor: Editor | null;
}

export default function AddImageControl({ editor }: AddImageControlProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = () => {
      const data = fileReader.result;
      editor?.commands.insertContent(
        `<img src="${data}" alt="Image inserted by user"/>`
      );
      editor?.commands.focus();
    };

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg, image/jpg, image/png, image/heic"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <RichTextEditorControl
        onClick={() => fileInputRef.current?.click()}
        title="Add image"
      >
        <IconPhoto />
      </RichTextEditorControl>
    </>
  );
}
