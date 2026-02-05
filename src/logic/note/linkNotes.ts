import { db } from "../db";
import { getNote } from "./getNote";

export async function linkNotes(noteId1: string, noteId2: string) {
  return db.transaction("rw", db.notes, async () => {
    const note1 = await getNote(noteId1);
    const note2 = await getNote(noteId2);

    if (!note1 || !note2) {
      throw new Error("One or both notes not found");
    }

    const note1LinkedNotes = note1.linkedNotes ?? [];
    const note2LinkedNotes = note2.linkedNotes ?? [];

    if (!note1LinkedNotes.includes(noteId2)) {
      await db.notes.update(noteId1, {
        linkedNotes: [...note1LinkedNotes, noteId2],
      });
    }

    if (!note2LinkedNotes.includes(noteId1)) {
      await db.notes.update(noteId2, {
        linkedNotes: [...note2LinkedNotes, noteId1],
      });
    }
  });
}
