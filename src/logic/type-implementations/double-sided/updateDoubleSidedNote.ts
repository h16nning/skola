import { db } from "@/logic/db";
import { Note, NoteType } from "@/logic/note/note";
import { updateNoteContent } from "@/logic/note/updateNoteContent";

export async function updateDoubleSidedNote(
  params: { field1: string; field2: string },
  existingNote: Note<NoteType.DoubleSided>
) {
  return db.transaction("rw", db.notes, db.cards, async () => {
    await updateNoteContent(existingNote.id, {
      type: NoteType.DoubleSided,
      field1: params.field1,
      field2: params.field2,
    });
  });
}
