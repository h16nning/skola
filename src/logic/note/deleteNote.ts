import { db } from "../db";
import { Note, NoteType } from "./note";

/**
 * This function deletes a note from the database.
 *
 * **Side effects:** It also deletes all cards that reference the note and updates the deck to remove the note and the cards that reference it.
 */

export function deleteNote<T extends NoteType>(note: Note<T>) {
  return db.transaction("rw", db.notes, db.cards, db.decks, async () => {
    await db.notes.delete(note.id);
    const cardCollection = db.cards.where("note").equals(note.id);
    cardCollection.delete();
    const deck = await db.decks.get(note.deck);
    await db.decks.update(note.deck, {
      notes: deck?.notes.filter((n) => n !== note.id),
      cards: deck?.cards.filter((c) =>
        cardCollection.primaryKeys().then((a) => !a.includes(c))
      ),
    });
  });
}
