import { db } from "../db";
import { Deck } from "../deck/deck";
import { Note, NoteType } from "./note";

interface MoveNoteArgs {
  /**
   * The note to move. Can be a note object or a note id.
   */
  note: Note<NoteType> | string;
  /**
   * The deck to move the note to. Can be a deck object or a deck id
   */
  newDeck: Deck | string;
}

/**
 * Moves a note to a new deck. This function also updates all cards referincing the note.
 * @param args
 */
export async function moveNote(args: MoveNoteArgs) {
  return await db.transaction("rw", db.notes, db.cards, db.decks, async () => {
    const note =
      typeof args.note === "string" ? await db.notes.get(args.note) : args.note;
    const newDeck =
      typeof args.newDeck === "string"
        ? await db.decks.get(args.newDeck)
        : args.newDeck;

    if (!note || !newDeck) {
      throw new Error("Note or deck not found");
    }

    // Get linked cards
    const cards = await db.cards.where("note").equals(note.id).toArray();

    // Remove note and linked cards from old deck
    const oldDeck = await db.decks.get(note.deck);
    if (oldDeck) {
      oldDeck.notes = oldDeck.notes.filter((n) => n !== note.id);
      oldDeck.cards = oldDeck.cards.filter(
        (c) => !cards.map((c) => c.id).includes(c)
      );
      await db.decks.update(oldDeck.id, {
        notes: oldDeck.notes,
        cards: oldDeck.cards,
      });
    }

    // Add note and linked cards to new deck
    newDeck.notes.push(note.id);
    newDeck.cards.push(...cards.map((c) => c.id));
    await db.decks.update(newDeck.id, {
      notes: newDeck.notes,
      cards: newDeck.cards,
    });

    // Update all linked cards
    await db.cards.where("note").equals(note.id).modify({ deck: newDeck.id });

    // Set deck in note object
    note.deck = newDeck.id;
    return await db.notes.update(note.id, { deck: newDeck.id });
  });
}
