import { Card, CardType } from "./card";
import { getDeck } from "./deck";

//MIGHT BE DEPRECATED?

export type CardSortFunction = (sortOrder: 1 | -1) => (...args: any) => number;

export const CardSorts: Record<any, CardSortFunction> = {
  byCreationDate:
    (sortOrder: 1 | -1) => (a: Card<CardType>, b: Card<CardType>) =>
      (a.creationDate.getTime() - b.creationDate.getTime()) * sortOrder,
  /*bySortField:
    (sortOrder: 1 | -1) => (a: Card<CardType>, b: Card<CardType>) => {
      if (a.preview === undefined || b.preview === undefined) {
        console.warn("card.preview is undefined. Most likely to old db date.");
        return 0;
      }
      return a.preview.localeCompare(b.preview) * sortOrder;
    },*/
  byCustomOrder:
    (sortOrder: 1 | -1) => (a: Card<CardType>, b: Card<CardType>) => {
      if (a.customOrder === undefined || b.customOrder === undefined) {
        return 0;
      }
      return (a.customOrder - b.customOrder) * Math.abs(sortOrder);
    },
  byCardType: (sortOrder: 1 | -1) => (a: Card<CardType>, b: Card<CardType>) =>
    a.content.type.localeCompare(b.content.type) * sortOrder,
  byDeckName:
    (sortOrder: 1 | -1) =>
    (a: CardWithComparableDeckName, b: CardWithComparableDeckName) =>
      a.deckName.localeCompare(b.deckName) * sortOrder,
};

export interface CardWithComparableDeckName extends Card<CardType> {
  deckName: string;
}

export async function getCardsWithComparableDeckName(
  cards: Card<CardType>[]
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
