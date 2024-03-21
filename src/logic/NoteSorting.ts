import { getUtils } from "./TypeManager";
import { Card, NoteType } from "./card";
import { getDeck } from "./deck";
import { Note } from "./note";

export type NoteSortFunction = (sortOrder: 1 | -1) => (...args: any) => number;

export const NoteSorts: Record<any, NoteSortFunction> = {
  byCreationDate:
    (sortOrder: 1 | -1) => (a: Note<NoteType>, b: Note<NoteType>) =>
      (a.creationDate.getTime() - b.creationDate.getTime()) * sortOrder,
  bySortField:
    (sortOrder: 1 | -1) => (a: Note<NoteType>, b: Note<NoteType>) => {
      return (
        getUtils(a)
          .getSortFieldFromNoteContent(a.content)
          .localeCompare(getUtils(b).getSortFieldFromNoteContent(b.content)) *
        sortOrder
      );
    },
  byCustomOrder:
    (sortOrder: 1 | -1) => (a: Note<NoteType>, b: Note<NoteType>) => {
      if (a.customOrder === undefined || b.customOrder === undefined) {
        return 0;
      }
      return (a.customOrder - b.customOrder) * Math.abs(sortOrder);
    },
  byType: (sortOrder: 1 | -1) => (a: Card<NoteType>, b: Card<NoteType>) =>
    a.content.type.localeCompare(b.content.type) * sortOrder,
  byDeckName:
    (sortOrder: 1 | -1) =>
    (a: NoteWithComparableDeckName, b: NoteWithComparableDeckName) =>
      a.deckName.localeCompare(b.deckName) * sortOrder,
};

export interface NoteWithComparableDeckName extends Note<NoteType> {
  deckName: string;
}

export async function getNotesWithComparableDeckName(
  notes: Note<NoteType>[]
): Promise<NoteWithComparableDeckName[]> {
  return Promise.all(
    notes.map(async (note) => {
      return {
        ...note,
        deckName:
          (await getDeck(note.deck).then((deck) => deck?.name)) ?? "error",
      };
    })
  );
}
