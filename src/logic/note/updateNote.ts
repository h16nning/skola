import { db } from "../db";

export function updateNote(
  noteId: string,
  changes: {
    [keyPath: string]: any;
  }
) {
  return db.notes.update(noteId, changes);
}
