import { useLiveQuery } from "dexie-react-hooks";
import { CardType } from "./card";
import { db } from "./db";
import { v4 as uuidv4 } from "uuid";
import { Deck } from "./deck";
import { Table } from "dexie";

export interface NoteSkeleton {
  id: string;
  deck: string;
  referencedBy: string[];
  creationDate: Date;
  customOrder?: number;
}

export interface Note<T extends CardType> extends NoteSkeleton {
  content: NoteContent<T>;
}

export function createNoteSkeleton(deck: string): NoteSkeleton {
  return {
    deck: deck,
    creationDate: new Date(Date.now()),
    id: uuidv4(),
    referencedBy: [],
  };
}

export async function newNote<T extends CardType>(
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

export async function registerReferenceToNote(noteId: string, cardId: string) {
  const note = await db.notes.get(noteId);
  if (note) {
    note.referencedBy.push(cardId);
    await db.notes.update(noteId, note);
  }
}

export async function registerReferencesToNote(
  noteId: string,
  cardIds: string[]
) {
  const note = await db.notes.get(noteId);
  if (note) {
    note.referencedBy.push(...cardIds);
    await db.notes.update(noteId, note);
  }
}

export async function removeReferenceToNote(noteId: string, cardId: string) {
  const note = await db.notes.get(noteId);
  if (note) {
    note.referencedBy = note.referencedBy.filter((id) => id !== cardId);
    if (note.referencedBy.length === 0) {
      await db.notes.delete(noteId);
    } else {
      await db.notes.update(noteId, note);
    }
  }
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
    notes: Table<Note<CardType>>
  ) => Promise<Note<CardType>[] | undefined>,
  dependencies: any[]
): [Note<CardType>[] | undefined, boolean] {
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

export function updateNoteContent<T extends CardType>(
  noteId: string,
  content: NoteContent<T>
) {
  return db.notes.update(noteId, { content });
}

export function getCardsReferencingNote(note: Note<any>) {
  return Promise.all(note.referencedBy.map((cardId) => db.cards.get(cardId)));
}

export async function getNotesOf(
  deck?: Deck,
  excludeSubDecks?: boolean
): Promise<Note<CardType>[] | undefined> {
  if (!deck) return undefined;
  let notes: Note<CardType>[] = await db.notes
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
): [Note<CardType>[] | undefined, boolean] {
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

export type NoteContent<T extends CardType> = {
  type: T;
} & (T extends CardType.Normal ? NormalNoteContent : {}) &
  (T extends CardType.Cloze ? ClozeNoteContent : {}) &
  (T extends CardType.DoubleSided ? DoubleSidedNoteContent : {});

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
