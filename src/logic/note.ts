import { useLiveQuery } from "dexie-react-hooks";
import { CardType } from "./card";
import { db } from "./db";
import { v4 as uuidv4 } from "uuid";

export interface NoteSkeleton {
  id: string;
  referencedBy: string[];
  customOrder?: number;
}

export interface Note<T extends CardType> extends NoteSkeleton {
  content: NoteContent<T>;
}

export function createNoteSkeleton(): NoteSkeleton {
  return {
    id: uuidv4(),
    referencedBy: [],
  };
}

export async function newNote<T extends CardType>(content: NoteContent<T>) {
  const note = {
    ...createNoteSkeleton(),
    content,
  };
  await db.notes.add(note, note.id);
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

export function useNote(noteId: string) {
  return useLiveQuery(() => db.notes.get(noteId), [noteId], undefined);
}

export function updateNote<T extends CardType>(
  noteId: string,
  content: NoteContent<T>
) {
  return db.notes.update(noteId, { content });
}

export function getCardsReferencingNote(note: Note<any>) {
  return Promise.all(note.referencedBy.map((cardId) => db.cards.get(cardId)));
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
