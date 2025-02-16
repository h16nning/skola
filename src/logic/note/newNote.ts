import { db } from "../db";
import { Deck } from "../deck/deck";
import { NoteContent } from "./NoteContent";
import { createNoteSkeleton } from "./createNoteSkeleton";
import { NoteType } from "./note";

/**
 * This function creates a new note in the database.
 *
 * **Side effects:** It also updates the deck to include the new note.
 */

export async function newNote<T extends NoteType>(
  deck: Deck,
  content: NoteContent<T>
) {
  const note = {
    ...createNoteSkeleton(deck.id),
    content,
  };
  await db.transaction("rw", db.decks, db.notes, async () => {
    await db.notes.add(note, note.id);
    deck.notes.push(note.id);
    await db.decks.update(deck.id, { notes: deck.notes });
  });
  return note.id;
}
