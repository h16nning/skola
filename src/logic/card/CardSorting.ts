import { getDeck } from "../deck/getDeck";
import { NoteType } from "../note/note";
import { Card } from "./card";

//MIGHT BE DEPRECATED?

export type CardSortFunction = (sortOrder: 1 | -1) => (...args: any) => number;

export const CardSorts: Record<any, CardSortFunction> = {
  byCreationDate:
    (sortOrder: 1 | -1) => (a: Card<NoteType>, b: Card<NoteType>) => {
      if (
        typeof a.creationDate.getTime !== "function" ||
        typeof b.creationDate.getTime !== "function"
      ) {
        console.warn(
          "Failed to get time from creation date. Is it a date object? Treating as equal."
        );
        return 0;
      }
      return (a.creationDate.getTime() - b.creationDate.getTime()) * sortOrder;
    },
  /*bySortField:
    (sortOrder: 1 | -1) => (a: Card<CardType>, b: Card<CardType>) => {
      if (a.preview === undefined || b.preview === undefined) {
        console.warn("card.preview is undefined. Most likely to old db date.");
        return 0;
      }
      return a.preview.localeCompare(b.preview) * sortOrder;
    },*/
  byCustomOrder:
    (sortOrder: 1 | -1) => (a: Card<NoteType>, b: Card<NoteType>) => {
      if (a.customOrder === undefined || b.customOrder === undefined) {
        return 0;
      }
      return (a.customOrder - b.customOrder) * Math.abs(sortOrder);
    },
  byCardType: (sortOrder: 1 | -1) => (a: Card<NoteType>, b: Card<NoteType>) =>
    a.content.type.localeCompare(b.content.type) * sortOrder,
  byDeckName:
    (sortOrder: 1 | -1) =>
    (a: CardWithComparableDeckName, b: CardWithComparableDeckName) =>
      a.deckName.localeCompare(b.deckName) * sortOrder,
};

export interface CardWithComparableDeckName extends Card<NoteType> {
  deckName: string;
}

export async function getCardsWithComparableDeckName(
  cards: Card<NoteType>[]
): Promise<CardWithComparableDeckName[]> {
  return Promise.all(
    cards.map(async (card) => {
      return {
        ...card,
        deckName:
          (await getDeck(card.deck).then((deck) => deck?.name)) ?? "error",
      };
    })
  );
}
