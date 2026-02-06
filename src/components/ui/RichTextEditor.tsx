import { EditorContent, Editor } from "@tiptap/react";
import type { ReactNode } from "react";
import "./RichTextEditor.css";

const BASE = "rich-text-editor";

interface RichTextEditorProps {
  editor: Editor | null;
  children?: ReactNode;
  className?: string;
}

export function RichTextEditor({
  editor,
  children,
  className = "",
}: RichTextEditorProps) {
  const classes = [BASE, className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      {children}
      <EditorContent editor={editor} className={`${BASE}__content`} />
    </div>
  );
}

interface ToolbarProps {
  children: ReactNode;
  className?: string;
}

export function RichTextEditorToolbar({
  children,
  className = "",
}: ToolbarProps) {
  return (
    <div className={`${BASE}__toolbar ${className}`} tabIndex={-1}>
      {children}
    </div>
  );
}

interface ControlsGroupProps {
  children: ReactNode;
  className?: string;
}

export function RichTextEditorControlsGroup({
  children,
  className = "",
}: ControlsGroupProps) {
  return (
    <div className={`${BASE}__controls-group ${className}`} tabIndex={-1}>
      {children}
    </div>
  );
}

interface ControlProps {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  title?: string;
}

export function RichTextEditorControl({
  children,
  onClick,
  active = false,
  disabled = false,
  className = "",
  title,
}: ControlProps) {
  return (
    <button
      type="button"
      className={`${BASE}__control ${className}`}
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      disabled={disabled}
      data-active={active || undefined}
      tabIndex={-1}
      title={title}
    >
      {children}
    </button>
  );
}

RichTextEditor.Toolbar = RichTextEditorToolbar;
RichTextEditor.ControlsGroup = RichTextEditorControlsGroup;
RichTextEditor.Control = RichTextEditorControl;
