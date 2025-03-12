import { getAdapterOfType } from "../NoteTypeAdapter";
import { db } from "../db";
import { NoteContent } from "./NoteContent";
import { NoteType } from "./note";

export function updateNoteContent<T extends NoteType>(
  noteId: string,
  content: NoteContent<T>
) {
  return db.notes.update(noteId, { content, sortField: getAdapterOfType(content.type).getSortFieldFromNoteContent(
        content
      ), });
}
