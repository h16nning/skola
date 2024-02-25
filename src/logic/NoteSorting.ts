import { getUtils } from "./TypeManager";
import { Card, CardType } from "./card";
import { getDeck } from "./deck";
import { Note } from "./note";

export type NoteSortFunction = (sortOrder: 1 | -1) => (...args: any) => number;

export const NoteSorts: Record<any, NoteSortFunction> = {
  byCreationDate:
    (sortOrder: 1 | -1) => (a: Note<CardType>, b: Note<CardType>) =>
      (a.creationDate.getTime() - b.creationDate.getTime()) * sortOrder,
  bySortField:
    (sortOrder: 1 | -1) => (a: Note<CardType>, b: Note<CardType>) => {
      return (
        getUtils(a)
          .getSortFieldFromNote(a)
          .localeCompare(getUtils(b).getSortFieldFromNote(b)) * sortOrder
      );
    },
  byCustomOrder:
    (sortOrder: 1 | -1) => (a: Note<CardType>, b: Note<CardType>) => {
      if (a.customOrder === undefined || b.customOrder === undefined) {
        return 0;
      }
      return (a.customOrder - b.customOrder) * Math.abs(sortOrder);
    },
  byType: (sortOrder: 1 | -1) => (a: Card<CardType>, b: Card<CardType>) =>
    a.content.type.localeCompare(b.content.type) * sortOrder,
  byDeckName:
    (sortOrder: 1 | -1) =>
    (a: NoteWithComparableDeckName, b: NoteWithComparableDeckName) =>
      a.deckName.localeCompare(b.deckName) * sortOrder,
};

export interface NoteWithComparableDeckName extends Note<CardType> {
  deckName: string;
}

export async function getNotesWithComparableDeckName(
  notes: Note<CardType>[]
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
