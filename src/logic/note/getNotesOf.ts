import { db } from "../db";
import { Deck } from "../deck/deck";
import { Note, NoteType } from "./note";

export async function getNotesOf(
  deck?: Deck,
  directMembersOnly?: boolean
): Promise<Note<NoteType>[] | undefined> {
  if (!deck) return undefined;
  let notes: Note<NoteType>[] = await db.notes
    .where("id")
    .anyOf(deck.notes)
    .filter((n) => n !== undefined)
    .toArray();
  if (!directMembersOnly) {
    await Promise.all(
      deck.subDecks.map((subDeckID) =>
        db.decks
          .get(subDeckID)
          .then((subDeck) => {
            if (subDeck) {
              return getNotesOf(subDeck);
            }
          })
          .then((c) => {
            if (c) {
              notes = notes.concat(c);
            }
          })
      )
    );
  }
  return notes;
}
