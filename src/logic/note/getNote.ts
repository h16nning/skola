import { db } from "../db";

export async function getNote(noteId: string) {
  return db.notes.get(noteId);
}
