import { getAdapterOfType } from "../NoteTypeAdapter";
import { db } from "../db";

export function updateNote(
  noteId: string,
  changes: {
    [keyPath: string]: any;
  }
) {
  //changes contain changes to content, reevaluation of sortField is needed
  if (changes.content) {
    changes.sortField = getAdapterOfType(
      changes.content.type
    ).getSortFieldFromNoteContent(changes.content);
  }
  return db.notes.update(noteId, changes);
}
