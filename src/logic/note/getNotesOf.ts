import { db } from "../db";
import { Deck } from "../deck/deck";
import { Note, NoteType } from "./note";

export async function getNotesOf(
  deck?: Deck,
  directMembersOnly?: boolean,
  limit?: number
): Promise<Note<NoteType>[] | undefined> {
  if (!deck) return undefined;
  let notes: Note<NoteType>[] = (await db.notes.bulkGet(deck.notes))
    .slice(0, limit ?? 999999)
    .filter((n) => n !== undefined);
  if (!directMembersOnly && notes.length < (limit ?? 999999)) {
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
