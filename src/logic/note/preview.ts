import { Note, NoteType } from "./note";

export interface NotePreview {
  front: string;
  back?: string;
}

export function getNotePreview(note: Note<NoteType>): NotePreview {
  switch (note.content.type) {
    case NoteType.Basic: {
      const content = note.content as Note<NoteType.Basic>["content"];
      return {
        front: htmlToPreviewText(content.front),
        back: htmlToPreviewText(content.back),
      };
    }
    case NoteType.DoubleSided: {
      const content = note.content as Note<NoteType.DoubleSided>["content"];
      return {
        front: htmlToPreviewText(content.field1),
        back: htmlToPreviewText(content.field2),
      };
    }
    case NoteType.Cloze: {
      const content = note.content as Note<NoteType.Cloze>["content"];
      return {
        front: htmlToPreviewText(revealClozeText(content.text)),
      };
    }
    default:
      return {
        front: note.sortField,
      };
  }
}

export function getNotePreviewText(note: Note<NoteType>) {
  const { front, back } = getNotePreview(note);
  return [front, back].filter(Boolean).join(" — ");
}

export function htmlToPreviewText(value: string) {
  return decodeCommonEntities(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function revealClozeText(value: string) {
  return value.replace(/\{\{c\d::((?!\{\{|}}).)*\}\}/g, (match) =>
    match.slice(6, -2)
  );
}

function decodeCommonEntities(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
