import {
  IconBold,
  IconClearFormatting,
  IconCode,
  IconHighlight,
  IconItalic,
  IconLink,
  IconLinkOff,
  IconList,
  IconListNumbers,
  IconStrikethrough,
  IconSubscript,
  IconSuperscript,
  IconUnderline,
} from "@tabler/icons-react";
import { Editor } from "@tiptap/react";
import { RichTextEditorControl } from "./RichTextEditor";

import { useCallback } from "react";

interface ControlProps {
  editor: Editor | null;
}

export function BoldControl({ editor }: ControlProps) {
  return (
    <RichTextEditorControl
      onClick={() => editor?.chain().focus().toggleBold().run()}
      active={editor?.isActive("bold")}
      disabled={!editor?.can().chain().focus().toggleBold().run()}
      title="Bold (Ctrl+B)"
    >
      <IconBold />
    </RichTextEditorControl>
  );
}

export function ItalicControl({ editor }: ControlProps) {
  return (
    <RichTextEditorControl
      onClick={() => editor?.chain().focus().toggleItalic().run()}
      active={editor?.isActive("italic")}
      disabled={!editor?.can().chain().focus().toggleItalic().run()}
      title="Italic (Ctrl+I)"
    >
      <IconItalic />
    </RichTextEditorControl>
  );
}

export function UnderlineControl({ editor }: ControlProps) {
  return (
    <RichTextEditorControl
      onClick={() => editor?.chain().focus().toggleUnderline().run()}
      active={editor?.isActive("underline")}
      disabled={!editor?.can().chain().focus().toggleUnderline().run()}
      title="Underline (Ctrl+U)"
    >
      <IconUnderline />
    </RichTextEditorControl>
  );
}

export function StrikethroughControl({ editor }: ControlProps) {
  return (
    <RichTextEditorControl
      onClick={() => editor?.chain().focus().toggleStrike().run()}
      active={editor?.isActive("strike")}
      disabled={!editor?.can().chain().focus().toggleStrike().run()}
      title="Strikethrough"
    >
      <IconStrikethrough />
    </RichTextEditorControl>
  );
}

export function HighlightControl({ editor }: ControlProps) {
  return (
    <RichTextEditorControl
      onClick={() => editor?.chain().focus().toggleHighlight().run()}
      active={editor?.isActive("highlight")}
      disabled={!editor?.can().chain().focus().toggleHighlight().run()}
      title="Highlight"
    >
      <IconHighlight />
    </RichTextEditorControl>
  );
}

export function CodeControl({ editor }: ControlProps) {
  return (
    <RichTextEditorControl
      onClick={() => editor?.chain().focus().toggleCode().run()}
      active={editor?.isActive("code")}
      disabled={!editor?.can().chain().focus().toggleCode().run()}
      title="Code"
    >
      <IconCode />
    </RichTextEditorControl>
  );
}

export function SubscriptControl({ editor }: ControlProps) {
  return (
    <RichTextEditorControl
      onClick={() => editor?.chain().focus().toggleSubscript().run()}
      active={editor?.isActive("subscript")}
      disabled={!editor?.can().chain().focus().toggleSubscript().run()}
      title="Subscript"
    >
      <IconSubscript />
    </RichTextEditorControl>
  );
}

export function SuperscriptControl({ editor }: ControlProps) {
  return (
    <RichTextEditorControl
      onClick={() => editor?.chain().focus().toggleSuperscript().run()}
      active={editor?.isActive("superscript")}
      disabled={!editor?.can().chain().focus().toggleSuperscript().run()}
      title="Superscript"
    >
      <IconSuperscript />
    </RichTextEditorControl>
  );
}

export function ClearFormattingControl({ editor }: ControlProps) {
  return (
    <RichTextEditorControl
      onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}
      title="Clear formatting"
    >
      <IconClearFormatting />
    </RichTextEditorControl>
  );
}

export function BulletListControl({ editor }: ControlProps) {
  return (
    <RichTextEditorControl
      onClick={() => editor?.chain().focus().toggleBulletList().run()}
      active={editor?.isActive("bulletList")}
      title="Bullet list"
    >
      <IconList />
    </RichTextEditorControl>
  );
}

export function OrderedListControl({ editor }: ControlProps) {
  return (
    <RichTextEditorControl
      onClick={() => editor?.chain().focus().toggleOrderedList().run()}
      active={editor?.isActive("orderedList")}
      title="Numbered list"
    >
      <IconListNumbers />
    </RichTextEditorControl>
  );
}

export function LinkControl({ editor }: ControlProps) {
  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  return (
    <RichTextEditorControl
      onClick={setLink}
      active={editor?.isActive("link")}
      title="Add link"
    >
      <IconLink />
    </RichTextEditorControl>
  );
}

export function UnlinkControl({ editor }: ControlProps) {
  return (
    <RichTextEditorControl
      onClick={() => editor?.chain().focus().unsetLink().run()}
      disabled={!editor?.isActive("link")}
      title="Remove link"
    >
      <IconLinkOff />
    </RichTextEditorControl>
  );
}
