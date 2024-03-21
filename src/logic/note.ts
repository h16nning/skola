import { Table } from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { v4 as uuidv4 } from "uuid";
import { NoteType } from "./card";
import { db } from "./db";
import { Deck } from "./deck";

export interface NoteSkeleton {
  id: string;
  deck: string;
  creationDate: Date;
  customOrder?: number;
}

export interface Note<T extends NoteType> extends NoteSkeleton {
  content: NoteContent<T>;
}

export function createNoteSkeleton(deck: string): NoteSkeleton {
  return {
    deck: deck,
    creationDate: new Date(Date.now()),
    id: uuidv4(),
  };
}

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
  await db.transaction("rw", db.decks, db.notes, () => {
    db.notes.add(note, note.id);
    db.decks.update(deck.id, { notes: deck.notes.concat(note.id) });
  });
  return note.id;
}

export async function getNote(noteId: string) {
  return db.notes.get(noteId);
}

export async function useNotes() {
  return db.notes.toArray();
}

export function useNote(noteId: string) {
  return useLiveQuery(() => db.notes.get(noteId), [noteId], undefined);
}

export function useNotesWith(
  querier: (
    notes: Table<Note<NoteType>>
  ) => Promise<Note<NoteType>[] | undefined>,
  dependencies: any[]
): [Note<NoteType>[] | undefined, boolean] {
  return useLiveQuery(
    () => querier(db.notes).then((notes) => [notes, notes !== undefined]),
    dependencies,
    [undefined, false]
  );
}

export function updateNote(
  noteId: string,
  changes: {
    [keyPath: string]: any;
  }
) {
  return db.notes.update(noteId, changes);
}

export function updateNoteContent<T extends NoteType>(
  noteId: string,
  content: NoteContent<T>
) {
  return db.notes.update(noteId, { content });
}
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

export function getCardsReferencingNote(note: Note<any>) {
  return db.cards.where("note").equals(note.id).toArray();
}

export async function getNotesOf(
  deck?: Deck,
  excludeSubDecks?: boolean
): Promise<Note<NoteType>[] | undefined> {
  if (!deck) return undefined;
  let notes: Note<NoteType>[] = await db.notes
    .where("id")
    .anyOf(deck.notes)
    .filter((n) => n !== undefined)
    .toArray();
  if (excludeSubDecks) {
    return notes;
  }
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
  return notes;
}

export function useNotesOf(
  deck: Deck | undefined,
  excludeSubDecks?: boolean
): [Note<NoteType>[] | undefined, boolean] {
  return useLiveQuery(
    () =>
      getNotesOf(deck, excludeSubDecks).then((notes) => [
        notes,
        deck !== undefined,
      ]),
    [deck, excludeSubDecks],
    [undefined, false]
  );
}

export type NoteContent<T extends NoteType> = {
  type: T;
} & (T extends NoteType.Normal ? NormalNoteContent : {}) &
  (T extends NoteType.Cloze ? ClozeNoteContent : {}) &
  (T extends NoteType.DoubleSided ? DoubleSidedNoteContent : {});

export interface NormalNoteContent {
  front: string;
  back: string;
}

export interface ClozeNoteContent {
  text: string;
}

export interface DoubleSidedNoteContent {
  field1: string;
  field2: string;
}
